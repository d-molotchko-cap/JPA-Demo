import { Injectable } from '@angular/core';
import { HttpClient as HttpClientAngualar, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

const header = 'Authorization';

@Injectable()
export class HttpClient {

    constructor(
        private httpClient: HttpClientAngualar,
        private loginService: LoginService,
    ) {}

    get<T>(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        return this.httpClient.get<T>(url, this.appendAuthorizationHeader(options));
    }

    post<T>(url: string, body: any | null, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        return this.httpClient.post<T>(url, body, this.appendAuthorizationHeader(options));
    }

    put<T>(url: string, body: any | null, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        return this.httpClient.put<T>(url, body, this.appendAuthorizationHeader(options));
    }

    delete<T>(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<T> {
        return this.httpClient.delete<T>(url, this.appendAuthorizationHeader(options));
    }

    private appendAuthorizationHeader( options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } {
        const value: string = 'Bearer ' + this.loginService.token();
        if (!!options) {
            if (!options.headers) {
                options.headers = {'Authorization': value};
            } else if (options.headers instanceof HttpHeaders) {
                options.headers.set(header, value);
            } else {
                options.headers[header] = value;
            }
        } else {
            options = {
                headers: {'Authorization': value}
            };
        }
        return options;
    }
}
