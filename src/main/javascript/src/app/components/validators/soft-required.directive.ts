import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[softRequired]',
    providers: [{provide: NG_VALIDATORS, useExisting: SoftRequiredDirective, multi: true}]
})
export class SoftRequiredDirective implements Validator {
    @Input() softRequired: string;

    constructor(private el: ElementRef) {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const elems = this.el.nativeElement.parentNode.querySelector('.soft.required');
        if (!!elems) {
            elems.remove();
        }
        if (!control.value) {
            this.el.nativeElement.insertAdjacentHTML(
                'afterend', '<span class="soft required">' + (this.softRequired || 'This value might be entered.') + '</span>');
        }
        return null;
    }
}
