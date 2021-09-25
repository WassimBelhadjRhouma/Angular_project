import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
@Injectable()
export class InputService {

    private data =
        {
            signup: {
                nameMinLength: 3,
                nameMaxLength: 40,
                emailPattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                passwordPattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/,
                emplacementMinLength: 3,
                emplacementMaxLength: 20,
            },
            login: {
                emailPattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                passwordPattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/,
            },

            addTerrain: {
                titleMinLength: 5,
                titleMaxLength: 45,
                descriptionMinLength: 20,
                descriptionMaxLength: 200,
                minPrice: 0,
                maxPrice: 10000,
                minCapacity: 10,
                maxCapacity: 22,
                emplacementMinLength: 3,
                emplacementMaxLength: 20,
            },
        };

    private tunisianStates = ["Aryanah", "Bajah", "Binzart", "Jundubah", "Madaniyin", "Manubah", "Monastir", "Nabul", "Qabis", "Qafsah", "Qibili", "Safaqis", "Sfax", "Silyanah", "Susah", "Tatawin", "Tawzar", "Tunis", "Zaghwan", "al-Kaf", "al-Mahdiyah", "al-Munastir", "al-Qasrayn", "al-Qayrawan"];



    static MatchPassword(AC: AbstractControl): ValidationErrors | null {
        const Newpassword = AC.get('password').value;
        const ReNewpassword = AC.get('confirmPassword').value;
        if (Newpassword !== ReNewpassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true });
            return ({ MatchPassword: true });
        } else {
            AC.get('confirmPassword').setErrors(null);
            return null;
        }
    }

    static noNegativePrice(AC: AbstractControl): ValidationErrors | null {
        // static MatchPassword(AC: AbstractControl) {
        const priceVal = AC.get('price').value;

        if (!AC.get('price').errors?.required && !AC.get('price').errors?.max) {
            if (priceVal < 0) {
                AC.get('price').setErrors({ negativePrice: true });
                return ({ negativePrice: true });
            }
            else {
                AC.get('price').setErrors(null);
                return null;
            }
        }

    }

    static noNegativeCapacity(AC: AbstractControl): ValidationErrors | null {
        // static MatchPassword(AC: AbstractControl) {
        const capacityVal = AC.get('capacity').value;
        if (!AC.get('capacity').errors?.required && !AC.get('capacity').errors?.max) {

            if (capacityVal < 0) {
                AC.get('capacity').setErrors({ negativeCapacity: true });
                return ({ negativeCapacity: true });
            }
            else {
                AC.get('capacity').setErrors(null);
                return null;
            }
        }

    }
    static NotMatchPassword(AC: AbstractControl): ValidationErrors | null {
        // static MatchPassword(AC: AbstractControl) {
        const Newpassword = AC.get('password').value;
        const ReNewpassword = AC.get('currentPassword').value;
        if (Newpassword === ReNewpassword) {
            AC.get('currentPassword').setErrors({ MatchPassword: true });
            return ({ MatchPassword: true });
        } else {
            AC.get('currentPassword').setErrors(null);
            return null;
        }
    }
    static notEmptyState(AC: AbstractControl): ValidationErrors | null {
        // static MatchPassword(AC: AbstractControl) {
        const state = AC.get('region').value;
        if (state === 'State') {
            AC.get('region').setErrors({ invalidState: true });
            return ({ invalidState: true });
        }
        else {
            AC.get('region').setErrors(null);
            return null;
        }
    }
    static notEmptyCity(AC: AbstractControl): ValidationErrors | null {
        // static MatchPassword(AC: AbstractControl) {
        const city = AC.get('city').value;
        if (city === 'city') {
            AC.get('city').setErrors({ invalidCity: true });
            return ({ invalidCity: true });
        }
        else {
            AC.get('city').setErrors(null);
            return null;
        }
    }

    getInputConfig(key): any {
        return this.data[key];
    }
    getTunisianStates(): string[] {
        return this.tunisianStates;
    }
}
