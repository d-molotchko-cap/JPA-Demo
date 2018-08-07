import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Form_1Component as ProjectForm_1Component } from './components/project/form_1.component';

import { AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './components/common/login.component';
import { LoginService } from './services/login.service';
import { DataResolver } from './services/bpm.service';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'project/form_1'
    },
    {
        pathMatch: 'full',
        path: 'project/form_1',
        component: ProjectForm_1Component,
        canActivate: [AuthGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {}
    )
  ],
  providers: [
    AuthGuard,
    LoginService,
    DataResolver
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
