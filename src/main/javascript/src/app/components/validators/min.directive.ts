import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[min]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValueValidatorDirective, multi: true}]
})
export class MinValueValidatorDirective implements Validator {
  @Input() min: number;

  validate(control: AbstractControl): {[key: string]: any} {
    return Validators.min(this.min)(control);
  }
}
