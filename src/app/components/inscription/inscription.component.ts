import { Component, ViewContainerRef } from '@angular/core';
import {PopUpInscriptionComponent} from '../pop-up-inscription/pop-up.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import {first} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    HttpClientModule
  ],
  providers: [AuthService, UserService],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss'
})
export class InscriptionComponent {
  email: FormControl = new FormControl("", Validators.compose([
    Validators.required,
    Validators.email
  ]));
  password: FormControl = new FormControl("", Validators.compose([
    Validators.required,
    Validators.minLength(6),
    CustomValidators.hasSpecialChar,
    CustomValidators.hasUpperCase
  ]));
  passwordConfirm: FormControl = new FormControl("", Validators.compose([
    Validators.required,
    CustomValidators.passwordsMatch
  ]));
  nom: FormControl = new FormControl("", Validators.compose([
    Validators.required,
    Validators.minLength(3)
  ]))
  prenom: FormControl = new FormControl("", Validators.compose([
    Validators.required,
    Validators.minLength(3)
  ]))
  checkbox: FormControl = new FormControl(false, Validators.requiredTrue);



  inscriptionForm = new FormGroup(
    {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      confirmPassword: this.passwordConfirm,
      checkbox: this.checkbox
    },
    { validators: CustomValidators.passwordsMatch }
  );


  constructor(private dialog: MatDialog, private _authService: AuthService, private _userService: UserService, private _router: Router) { }

  openDialog(): void {
    this.dialog.open(PopUpInscriptionComponent, {
      data: {
        email: this.email.value,
        isEmail: true
      },
    });
  }


  isFieldsValid(): boolean {
    return this.inscriptionForm.valid;
  }

  onSubmit(): void {
    this.openDialog();
    this._authService.register({usrPassword: this.password.value, usrName: this.prenom.value,
      usrSecondName: this.nom.value, usrEmail: this.email.value}).subscribe(log => console.log(log));
  }

}

export class CustomValidators {

  static hasUpperCase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/[A-Z]/.test(value)) {
      return { noUpperCase: true };
    }
    return null;
  }

  static hasSpecialChar(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { noSpecialChar: true };
    }
    return null;
  }

  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
