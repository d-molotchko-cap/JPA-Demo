import { Injectable } from '@angular/core';
import { HttpClient } from './http-client.service';
import { Observable } from 'rxjs';

export interface Credential {
    username: String;
    password: String;
    url: String;
}

export interface FileContent {
    base64: String;
}

export interface FileMetadata {
    type?: string;
    key?: string;
    path: string;
    name: string;
    size?: number;
    created?: Date;
    modified?: Date;
    createdBy?: string;
    modifiedBy?: string;
    content?: FileContent;
}

@Injectable()
export class FileServiceService {

    constructor(
        private http: HttpClient
    ) {
    }

    list( url: String, credential: Credential, folder: String ): Observable<any> {
        return this.http.post(url + '/list' + folder, credential);
    }

    download( url: String, file: FileMetadata ): Observable<any> {
        return this.http.post(url + '/get', file);
    }

    addFile( url: String, credential: Credential, file: FileMetadata): Observable<any> {
        return this.http.post(url + '/create', {credential: credential, file: file});
    }

    updateFile( url: String, file: FileMetadata): Observable<any> {
        return this.http.post(url + '/update', file);
    }

    removeFile( url: String, file: FileMetadata ): Observable<any> {
        return this.http.post(url + '/delete', file);
    }
}
