import { NgModule } from '@angular/core';

/*Bootstrap*/
import { BsDatepickerModule, ModalModule, BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [BsDatepickerModule.forRoot(), ModalModule.forRoot(), DataTablesModule, BsDropdownModule.forRoot(), TabsModule.forRoot()],
  exports: [BsDatepickerModule, ModalModule, DataTablesModule, BsDropdownModule, TabsModule],
})
export class AppUIModule {}
