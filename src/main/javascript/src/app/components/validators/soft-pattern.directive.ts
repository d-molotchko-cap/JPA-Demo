import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[softPattern]',
    providers: [{provide: NG_VALIDATORS, useExisting: SoftPatternDirective, multi: true}]
})
export class SoftPatternDirective implements Validator {
    @Input() softPattern: Object;

    constructor(private el: ElementRef) {
    }

    validate(control: AbstractControl): {[key: string]: any} {
        const elems = this.el.nativeElement.parentNode.querySelector('.soft.pattern');
        if (!!elems) {
            elems.remove();
        }
        if (!!Validators.pattern(this.softPattern['pattern'])(control) ) {
            this.el.nativeElement.insertAdjacentHTML(
                'afterend', '<span class="soft pattern">' + (this.softPattern['message'] || 'This value might be other.') + '</span>');
        }
        return null;
    }
}
