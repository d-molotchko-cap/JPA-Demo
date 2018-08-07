import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[softMin]',
    providers: [{provide: NG_VALIDATORS, useExisting: SoftMinDirective, multi: true}]
})
export class SoftMinDirective implements Validator {
    @Input() softMin: Object;

    constructor(private el: ElementRef) {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const elems = this.el.nativeElement.parentNode.querySelector('.soft.min');
        if (!!elems) {
            elems.remove();
        }
        if (!!control.value  &&  control.value < this.softMin['limit']) {
            this.el.nativeElement.insertAdjacentHTML(
                'afterend', '<span class="soft min">' + (this.softMin['message'] || 'Value should be greater') + '</span>');
        }
        return null;
    }
}
