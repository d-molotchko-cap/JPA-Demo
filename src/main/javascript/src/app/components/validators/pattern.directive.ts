import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[pattern]',
  providers: [{provide: NG_VALIDATORS, useExisting: PatternValidatorDirective, multi: true}]
})
export class PatternValidatorDirective implements Validator {
  @Input() pattern: string;

  validate(control: AbstractControl): {[key: string]: any} {
    return Validators.pattern(this.pattern)(control);
  }
}
