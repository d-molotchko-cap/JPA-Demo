import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[softMax]',
    providers: [{provide: NG_VALIDATORS, useExisting: SoftMaxDirective, multi: true}]
})
export class SoftMaxDirective implements Validator {
    @Input() softMax: Object;

    constructor(private el: ElementRef) {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const elems = this.el.nativeElement.parentNode.querySelector('.soft.max');
        if (!!elems) {
            elems.remove();
        }
        if (!!control.value  &&  control.value > this.softMax['limit']) {
            this.el.nativeElement.insertAdjacentHTML(
                'afterend', '<span class="soft max">' + (this.softMax['message'] || 'Value should be less') + '</span>');
        }
        return null;
    }
}
