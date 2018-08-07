import { Injectable } from '@angular/core';
import { HttpClient } from './http-client.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FileStorageService {

    constructor(
        private http: HttpClient
    ) {
    }

    upload( piid, file: File ): Observable<String> {
        const self = this;
        return this.http.post('file-storage/upload/' + piid,
            {
                name: file.name,
                type: file.type,
                content: btoa(file['content'])
            }
        )
            .pipe(map(resp => resp['uuid']));
    }

    list( piid ): Observable<any> {
        const self = this;
        return this.http.get('file-storage/list/' + piid);
    }

    delete( piid, uuid ): void {
        const self = this;
        this.http.delete('file-storage/delete/' + piid);
    }
}
