import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[softMinLength]',
    providers: [{provide: NG_VALIDATORS, useExisting: SoftMinLengthDirective, multi: true}]
})
export class SoftMinLengthDirective implements Validator {
    @Input() softMinLength: Object;

    constructor(private el: ElementRef) {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const elems = this.el.nativeElement.parentNode.querySelector('.soft.minlength');
        if (!!elems) {
            elems.remove();
        }
        if (!!control.value  &&  ('' + control.value).length < this.softMinLength['limit']) {
            this.el.nativeElement.insertAdjacentHTML(
                'afterend',
                '<span class="soft maxlength">' + (this.softMinLength['message'] || 'Value should have more chars') + '</span>');
        }
        return null;
    }
}
