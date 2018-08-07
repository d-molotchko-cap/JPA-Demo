import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppUIModule } from './app-ui.module';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createEpicMiddleware } from 'redux-observable';

// Translation
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient as HttpClientAngular } from '@angular/common/http';

// Charts
import { ChartModule } from './chart/chart.module';

// Common components
import { TableComponent } from './components/common/table.component';
import { PIDiagramComponent } from './components/common/process-instance-diagram.component';
import { FileStorageComponent } from './components/common/file-storage.component';
import { FileServiceListComponent } from './components/common/file-service-list.component';
import { FileServiceDownloadComponent } from './components/common/file-service-download.component';

// Soft validations
import { SoftRequiredDirective } from './components/validators/soft-required.directive';
import { SoftMinDirective } from './components/validators/soft-min.directive';
import { SoftMaxDirective } from './components/validators/soft-max.directive';
import { SoftMinLengthDirective } from './components/validators/soft-minlength.directive';
import { SoftMaxLengthDirective } from './components/validators/soft-maxlength.directive';
import { SoftPatternDirective } from './components/validators/soft-pattern.directive';

// Diagrams
import { BpmnJsModule } from './bpmn-js/bpmn-js.module';

import { AppComponent } from './app.component';
import { rootReducer, INITIAL_STATE } from './reducer';

import { Form_1Component as ProjectForm_1Component } from './components/project/form_1.component';

import { HttpClient } from './services/http-client.service';
import { LoginService } from './services/login.service';
import { LoginComponent } from './components/common/login.component';
import { DashboardComponent } from './components/common/dashboard.component';
import { BPMService, BPMEpics, DataTransformer } from './services/bpm.service';
import { ObjectFieldAccessor } from './services/objectFieldAccessor.service';

import { NotificationService } from './services/notification.service';
import { FileStorageService } from './services/file-storage.service';
import { FileServiceService } from './services/file-service.service';
import { GetPetByIdSOAService } from './services/get-pet-by-id-sOA.service';


const translateModule = TranslateModule.forRoot({
  loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClientAngular]
  }
});

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClientAngular) {
  return new TranslateHttpLoader(http, 'assets/lang/', '/translations.json');
}

@NgModule({
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule, NgxDatatableModule,
    AppUIModule, translateModule, NgReduxModule, ChartModule, BpmnJsModule
  ],
  declarations: [ AppComponent
    , SoftRequiredDirective
    , SoftMaxDirective
    , SoftMaxLengthDirective
    , SoftMinDirective
    , SoftMinLengthDirective
    , SoftPatternDirective
    , TableComponent
    , LoginComponent
    , PIDiagramComponent
    , DashboardComponent
    , FileServiceListComponent
    , FileServiceDownloadComponent
    , FileStorageComponent
    , ProjectForm_1Component
  ],
  providers: [
    GetPetByIdSOAService,
    BPMService,
    BPMEpics,
    DataTransformer,
    NotificationService,
    FileStorageService,
    FileServiceService,
    ObjectFieldAccessor,
    HttpClient
  ],
  entryComponents: [
    PIDiagramComponent
  ],
  exports: [ RouterModule ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
      private ngRedux: NgRedux<any>,
      private bpmEpics: BPMEpics
  ) {
    const epicMiddleware = createEpicMiddleware();
    ngRedux.configureStore(rootReducer, INITIAL_STATE, [epicMiddleware]);
    epicMiddleware.run(this.bpmEpics.getInstances);
    epicMiddleware.run(this.bpmEpics.loadTask);
    epicMiddleware.run(this.bpmEpics.finishTask);
  }
}
