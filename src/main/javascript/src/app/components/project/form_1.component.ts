import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription ,  interval } from 'rxjs';
import { isNil, isPlainObject, isEmpty, cloneDeep, isEqual  } from 'lodash';
import { NgRedux } from '@angular-redux/store';
import { FORM_STORE_KEY } from '../../reducer';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BPMService, DataTransformer } from '../../services/bpm.service';

// Data types
import { Category } from '../../model/category';
import { Tag } from '../../model/tag';
import { Pet } from '../../model/pet';
import { VariableSet } from './variable.set';

// Modals
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


// Services
import { Instances } from './instances';
import { NotificationService } from '../../services/notification.service';
import { ObjectFieldAccessor } from '../../services/objectFieldAccessor.service';
import { GetPetByIdSOAService } from '../../services/get-pet-by-id-sOA.service';

@Component({
    templateUrl: './form_1.component.html',
    styleUrls: ['./form_1.component.css']
})
export class Form_1Component implements OnInit, OnDestroy {
    private subData;
    private data: VariableSet;
    private subForm;
    private modalRef: BsModalRef;
    private calculated = [];
    // Pettags table
    private editingStateOfTablePettags: any = {}; 
    @ViewChild(DatatableComponent) pettagsTable: DatatableComponent;

    @ViewChild('form_1Form') set ngForm(form: NgForm) {
        if (form) {
            let _data = null;
            this.subForm = form.valueChanges.subscribe(data => {
                if (form.dirty && !isEqual(this.data, _data)) {
                    this.calculated.forEach(calcFn => calcFn(this.data));
                    _data = cloneDeep(this.data);
                    this.ngRedux.dispatch({ type: 'CREATE_INSTANCE', store: 'project', data: this.data});
                }
            });
        }
     }

    constructor (
        private ngRedux: NgRedux<any>,
        private modalService: BsModalService,
        private getPetByIdSOAService: GetPetByIdSOAService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationService: NotificationService,
        private dataTransformer: DataTransformer,
        private objectFieldAccessor: ObjectFieldAccessor
    ) {
    }

    ngOnInit() {
        this.subData = this.ngRedux.select<any>(FORM_STORE_KEY).subscribe(
            data => {
                let _data = data['project'];
//                if (!isEqual(this.data, _data)) {
                    this.data = _data;
//				}
            }
        );
    }

    ngOnDestroy() {
        this.subData.unsubscribe();
        this.subForm.unsubscribe();
    }


	// Pettags table
	
    addNewRowToTablePettags(){
        this.editingStateOfTablePettags[this.pettagsTable.rows.length] = true;
        const row: Tag = <Tag>{};
        this.pettagsTable.rows.push(row);
        if (this.data.pet.tags.indexOf(row) === -1 ) {
            this.data.pet.tags.push(row);
        }
        this.pettagsTable.rows = [...this.pettagsTable.rows];
    }
    updateValueInTablePettags($event, field, $index) {
        this.objectFieldAccessor.setValue(
            this.pettagsTable.rows[$index],
            field,
            $event instanceof Date ? $event : ($event.target.type === "checkbox" ? $event.target.checked : $event.target.value)
        );
        this.pettagsTable.rows = [...this.pettagsTable.rows];
    }
    editRowInTablePettags($index, $row) {
        this.editingStateOfTablePettags[$index] = !this.editingStateOfTablePettags[$index];
    }
    removeRowFromTablePettags($index) {
        const removed = this.pettagsTable.rows.splice($index, 1);
        const index = this.data.pet.tags.indexOf(removed[0]);
        if (index !== -1) {
            this.data.pet.tags.splice(index, 1);
        }
        this.pettagsTable.rows = [...this.pettagsTable.rows];
    }

}
