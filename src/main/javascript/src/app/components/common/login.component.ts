import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    providers: []
})
export class LoginComponent {

    private username: String;
    private password: String;
    private message: String;

    constructor(
        private loginService: LoginService,
        private router: Router) {
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.loginService.login( this.username, this.password ).subscribe( res => {
            if (!res) {
                this.message = 'Bad credentials!';
            } else {
                if (this.loginService.isLoggedIn) {
                    const redirect = this.loginService.redirectUrl ? this.loginService.redirectUrl : '';

                    // Redirect the user
                    this.router.navigate([redirect]);
                  }
            }
        });
    }
}
