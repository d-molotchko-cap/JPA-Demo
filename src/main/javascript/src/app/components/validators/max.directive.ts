import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[max]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxValueValidatorDirective, multi: true}]
})
export class MaxValueValidatorDirective implements Validator {
  @Input() max: number;

  validate(control: AbstractControl): {[key: string]: any} {
    return Validators.max(this.max)(control);
  }
}
