import { FormControl } from "@angular/forms";

export class specialCharacterValidator {
    charValidator(control: FormControl): { [key: string]: boolean } {
        const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (control.value && nameRegexp.test(control.value)) {
           return { invalidChar: true };
        }
    }
}