import { Injectable, Component, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
    isLoggedIn = false;
    redirectUrl: string;
    private authToken: string;
    public principal: EventEmitter<string> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.login = this.login.bind(this);
    }

    login(username, password): Observable<boolean> {
        const self = this;
        return this.http.post('login', {username: username, password: password})
            .pipe(
                map(resp => {
                    self.authToken = resp['token'];
                    self.isLoggedIn = !!self.authToken;
                    self.principal.emit(username);
                    return self.isLoggedIn;
                }))
    }

    logout() {
        const value: string = 'Bearer ' + this.token();
        this.http.post('logout', {}, {
            headers: {
                'Authorization': value
            }
        }).subscribe(
            data => {
                this.isLoggedIn = false;
                delete this.authToken;
                this.principal.emit(null);
                this.router.navigate(['/login']);
            },
            (err: HttpErrorResponse) => {
                console.log(err.message);
            }
        );
    }

    token() {
        return this.authToken;
    }
}
