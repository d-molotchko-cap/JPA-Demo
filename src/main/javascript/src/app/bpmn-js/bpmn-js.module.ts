import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramViewerComponent } from './diagram/diagram-viewer/diagram-viewer.component';
import { DiagramService } from './diagram/shared/diagram.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DiagramViewerComponent
  ],
  exports: [
    DiagramViewerComponent
  ],
  providers: [
    DiagramService
  ]
})
export class BpmnJsModule { }
