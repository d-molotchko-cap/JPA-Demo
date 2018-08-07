import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[softMaxLength]',
    providers: [{provide: NG_VALIDATORS, useExisting: SoftMaxLengthDirective, multi: true}]
})
export class SoftMaxLengthDirective implements Validator {
    @Input() softMaxLength: Object;

    constructor(private el: ElementRef) {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const elems = this.el.nativeElement.parentNode.querySelector('.soft.maxlength');
        if (!!elems) {
            elems.remove();
        }
        if (!!control.value  &&  ('' + control.value).length > this.softMaxLength['limit']) {
            this.el.nativeElement.insertAdjacentHTML(
                'afterend',
                '<span class="soft maxlength">' + (this.softMaxLength['message'] || 'Value should have less chars') + '</span>');
        }
        return null;
    }
}
