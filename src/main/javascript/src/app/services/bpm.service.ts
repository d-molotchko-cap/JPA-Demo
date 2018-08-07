import { Injectable } from '@angular/core';
import { HttpClient } from './http-client.service';
import { ProcessInstance } from '../model/processInstance';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isNil, isPlainObject, isEmpty, cloneDeep } from 'lodash';

import {ActionsObservable, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { mergeMap, map, catchError, take } from 'rxjs/operators';
import { of } from 'rxjs'

const api = {
    process: {
        list: 'api/v1/instances',
        launch: 'api/v1/instance?acronym={acronym}'
    },
    task: {
        getData: 'api/v1/task/{tkiid}',
        finish: 'api/v1/task/{tkiid}/{piid}?params={params}',
    }
};

@Injectable()
export class BPMService {

    constructor(
        private http: HttpClient
    ) {
    }

    getInstances(): Observable<ProcessInstance[]> {
        const url = api.process.list;
        return this.http.get<ProcessInstance[]>( url );
    }

    getTaskData(tkiid: string) {
        return this.http.get(api.task.getData.replace('{tkiid}', tkiid));
    }

    finishTask(tkiid: string, piid: string, data: string, boTracking? ) {
        return this.http.put(
                api.task.finish
                    .replace('{tkiid}', tkiid)
                    .replace('{piid}',  piid )
                    .replace('{params}',
                encodeURIComponent(data)), boTracking ? boTracking : {});
    }

    launch(id: string, data?: string) {
        return this.http.post(api.process.launch.replace('{acronym}', id), data);
    }
}

@Injectable()
export class DataResolver implements Resolve<any> {
    constructor(private service: BPMService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const tkiid = route.paramMap.get('id');

        return this.service.getTaskData(tkiid)
            .pipe(
                take(1),
                map(data => {
                    if (data) {
                        return data;
                    } else { // id not found
                        this.router.navigate(['/']);
                        return null;
                    }
                })
            );
    }
}

@Injectable()
export class DataTransformer {

    public fixEmptyObjects(src, target) {
        const self = this;

        if (isEmpty(target)) {
            Object.keys(src).forEach(function (varname) {
                target[varname] = cloneDeep(src[varname]);
            });
        }

        Object.keys(target).forEach(function (varname) {
            if (target[varname] === undefined || target[varname] == null) {
                Object.keys(src).forEach(function (vn) {
                    target[vn] = cloneDeep(src[vn]);
                });
            } else {
                if (!!src[varname]) {
                    Object.keys(src[varname]).forEach(function (field) {
                        if (isPlainObject(src[varname][field])) {
                            if (isNil(target[varname][field])) {
                                target[varname][field] = {};
                            }
                            self.fixEmptyObjects(src[varname][field], target[varname][field]);
                        }
                    });
                }
            }
        });

        // fix dates
        this.fixDates(src, target);
        return target;
    }

    public fixDates(src, target) {
        const self = this;
        Object.keys(src).forEach(function (field) {
            const obj1 = src[field];
            if (!!target[field]) {
                if (obj1 instanceof Date) {
                    target[field] = new Date(target[field]);
                } else if (isPlainObject(obj1)) {
                    self.fixDates(obj1, target[field]);
                }
            }
        });
    }

    public prepareData(data: any): string {
        this.removeFiles(data);
        return JSON.stringify(data, (k, v) => {
            if (v instanceof Date) {
                return v.toISOString();
            }
            return v;
        });
    }

    public removeFiles(data) {
        Object.keys(data).forEach(function(k){
            if (data[k]  == null  ||  data[k]  === undefined) {
                delete data[k];
            }
            if (!!data[k] &&  !!data[k]['name'] && !!data[k]['type']  &&  !!data[k]['uuid']  &&  !!data[k]['content']) {
                delete data[k];
            }
            if (!!data[k]  &&  isPlainObject(data[k])) {
                this.removeFiles(data[k]);
            }
        }.bind(this));
    }
}

@Injectable()
export class BPMEpics {
    constructor(private bpmService: BPMService, private dt: DataTransformer ) {
    }

    loadTask = (action$: ActionsObservable<any>): Observable<any> => {
        return action$.pipe(
            ofType('LOAD_TASK_DATA'),
            mergeMap(({tkiid, store, empty}) => {
                return this.bpmService.getTaskData(tkiid)
                    .pipe(
                        map(result => ({type: 'CREATE_INSTANCE', store: store, data: this.dt.fixEmptyObjects(empty, result)})),
                        catchError(error => of({type: 'LOAD_TASK_DATA_FAILED'}))
                    );
            })
        );
    };

    finishTask = (action$: ActionsObservable<any>): Observable<any> => {
        return action$.pipe(
            ofType('FINISH_TASK'),
            mergeMap(({data, params}) => {
                return this.bpmService.finishTask(params.tkiid, params.piid, this.dt.prepareData(data), params.boTracking)
                    .pipe(
                        map(result => ({type: 'FINISH_TASK_SUCCESSED', callback: params.succCallback})),
                        catchError(error => of({type: 'FINISH_TASK_FAILED'}))
                    )
            })
        );
    };


    getInstances = (action$: ActionsObservable<any>): Observable<any> => {
        return action$
            .pipe(
                ofType('GET_INSTANCES'),
                mergeMap(({data, params}) => {
                    return this.bpmService.getInstances()
                        .pipe(
                            map(result => ({
                                type: 'GET_INSTANCES_SUCCESSED',
                                data: result,
                                callback: params && params.succCallback
                            })),
                            catchError(error => of({
                                type: 'GET_INSTANCES_FAILED',
                                callback: params && params.errCallback
                            }))
                        )
                })
            );
    };

}
