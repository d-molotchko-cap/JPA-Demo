import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ProcessInstance} from "../../model/processInstance";

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'modal-content',
    template: `
      <div class="modal-header">
        <h4 class="modal-title pull-left">{{processInstance.instance.processInstanceName}}</h4>
        <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="bsModalRef.hide()">Close</button>
      </div>
    `
  })
  export class PIDiagramComponent {
    processInstance: ProcessInstance;
    constructor(public bsModalRef: BsModalRef) {}
  }
