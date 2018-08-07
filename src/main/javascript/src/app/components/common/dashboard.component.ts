import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BPMService } from '../../services/bpm.service';
import { ProcessInstance } from '../../model/processInstance';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {PIDiagramComponent} from './process-instance-diagram.component';
import { TASK_STORE_KEY, TASK_STORE_LIST_KEY } from '../../reducer';
import { NgRedux } from '@angular-redux/store';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    bsModalRef: BsModalRef;
    isLoading: boolean;
    instances: ProcessInstance[] = [];
    subData;
    priorityOptions = {
        chart: {
            type: 'pieChart',
            height: 200,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true
        }
    };
    priorityData = [{x: 'Normal', y: 0}, {x: 'Low', y: 0}, {x: 'High', y: 0}];

    taskstateOptions = {
        chart: {
            type: 'pieChart',
            height: 200,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            useInteractiveGuideline: true
        }
    };
    taskstateData = [{x: 'On Track', y: 0}, {x: 'At Risk', y: 0}, {x: 'Past due', y: 0}];

    turnoverOptions = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            duration: 500,
            xAxis: {
                axisLabel: 'Date'
            },
            yAxis: {
                axisLabel: 'No of Tasks',
                axisLabelDistance: -10
            }
        }
    };
    turnoverData = [
        {
            key: 'Received',
            values: [
                {label: '6-23-18', value: 5},
                {label: '6-24-18', value: 3},
                {label: '6-25-18', value: 4},
                {label: '6-26-18', value: 2},
                {label: '6-27-18', value: 4},
                {label: '6-28-18', value: 8},
            ]
        },
        {
            key: 'Completed',
            values: [
                {label: '6-23-18', value: 3},
                {label: '6-24-18', value: 4},
                {label: '6-25-18', value: 6},
                {label: '6-26-18', value: 2},
                {label: '6-27-18', value: 7},
                {label: '6-28-18', value: 3},
            ]
        }
    ];
    burndownOptions = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function (d) {
                return d.index;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            duration: 500,
            xAxis: {
                axisLabel: 'Date'
            },
            yAxis: {
                axisLabel: 'No of remaining tasks',
                axisLabelDistance: -10
            }
        }
    };
    burndownData = [
        {
            key: 'Remaining tasks',
            values: [
                {index: 0, label: '6-23-18', value: 0},
                {index: 1, label: '6-24-18', value: 2},
                {index: 2, label: '6-25-18', value: 1},
                {index: 3, label: '6-26-18', value: 3},
                {index: 4, label: '6-27-18', value: 1},
                {index: 5, label: '6-28-18', value: 0},
            ]
        }
    ];

    performanceOptions = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            duration: 500,
            xAxis: {
                axisLabel: 'Date'
            },
            yAxis: {
                axisLabel: 'No of Tasks',
                axisLabelDistance: -10
            }
        }
    };
    performanceData = [
        {
            key: 'Completed',
            values: [
                {label: '6-23-18', value: 3},
                {label: '6-24-18', value: 4},
                {label: '6-25-18', value: 6},
                {label: '6-26-18', value: 2},
                {label: '6-27-18', value: 7},
                {label: '6-28-18', value: 3},
            ]
        }
    ];

    constructor(
        private ngRedux: NgRedux<any>,
        private service: BPMService,
        private router: Router,
        private modalService: BsModalService ) {
    }

    ngOnInit() {
        this.subData = this.ngRedux.select<any>(TASK_STORE_KEY).subscribe(
            data => {
                this.instances = data[TASK_STORE_LIST_KEY];
                this.constructPieData();
            }
        );
        this.refresh();
    }

    ngOnDestroy() {
        this.subData.unsubscribe();
    }

    constructPieData() {
        this.priorityData  = [{x: 'Normal', y: 0}, {x: 'Low', y: 0}, {x: 'High', y: 0}];
        this.taskstateData = [{x: 'On Track', y: 0}, {x: 'At Risk', y: 0}, {x: 'Past due', y: 0}];

        this.instances.forEach( task => {
            if (task.priority.priority === 50) {
                this.priorityData[0].y += 1;
            } else if (task.priority.priority < 50) {
                this.priorityData[2].y += 1;
            } else if (task.priority.priority > 50) {
                this.priorityData[1].y += 1;
            }

            const now: Date = new Date();

            if (task.due) {
                const dueDate: Date = new Date(task.due);
                if (now >= dueDate) {
                    this.taskstateData[2].y += 1;
                } else if ((dueDate.getTime() - now.getTime())/1000/60/60/24 <= 2){
                    this.taskstateData[1].y += 1;
                } else {
                    this.taskstateData[0].y += 1;
                }
            } else {
                this.taskstateData[0].y += 1;
            }
        });

    }

    refresh() {
        this.isLoading = true;
        this.ngRedux.dispatch({
            type: 'GET_INSTANCES',
            params: {succCallback: () => this.isLoading = false, errCallback: () => this.isLoading = false}
        });
    }

    showProcessInstanceImage( processInstance: ProcessInstance ) {
        this.bsModalRef = this.modalService.show(PIDiagramComponent, {class: 'modal-full-screen'});
        this.bsModalRef.content.processInstance  = processInstance;
    }

    prepareLink( row: ProcessInstance ) {
        const url = '/' + this.camel(row.instance.processInstanceName) +
                    '/' + this.camel(row.subject.displayName) +
                    '/' + row.subject.tkiid + 
                    '/' + row.instance.piid;
        return url;
    }

    camel( str ) {
        const camel = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
          }).replace(/[\s\\-]+/g, '');
        return camel.charAt(0).toLowerCase() + camel.slice(1);
    }
}
