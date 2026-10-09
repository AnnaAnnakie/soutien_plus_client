import { Component } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidators} from '../inscription/inscription.component';
import {HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {UserService} from '../../services/user/user.service';
import {first} from 'rxjs';
import {GroupService} from '../../services/group/group.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf
  ],
  providers: [AuthService, UserService],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {

  email: FormControl = new FormControl("", Validators.compose([
    Validators.required,
    Validators.email
  ]));
  password: FormControl = new FormControl("", Validators.compose([
    Validators.required
    //Validators.minLength(6),
    //CustomValidators.hasSpecialChar,
    //CustomValidators.hasUpperCase
  ]));

  error_message: string = "";

  constructor(private _authService: AuthService, private _router: Router, private _userService: UserService, private _groupService: GroupService) {}

  connexionForm = new FormGroup(
    {
      email: this.email,
      password: this.password
    }
  );

  isFieldsValid(): boolean {
      return this.connexionForm.valid;
  }

  goToRegister(): void {
    this._router.navigate([`/inscription`]);
  }

  onSubmit(): void {
    this._authService.login({ usrPassword: this.password.value, usrEmail: this.email.value })
      .subscribe({
        next: (log) => {
          localStorage.setItem("auth_token", log.token);
          this._router.navigate([`/groupes`]);
        },
        error: (error) => {
          this.error_message = error.message;
        }
      });
  }

}
