import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GroupService} from '../../services/group/group.service';
import {first} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './new-group.component.html',
  styleUrl: './new-group.component.scss'
})
export class NewGroupComponent {

  constructor(private _groupService: GroupService, private _router: Router) {
  }

  nom: FormControl = new FormControl('', Validators.required);
  prenom: FormControl = new FormControl('', Validators.required);
  dateNaiss: FormControl = new FormControl('', Validators.required);
  numSecu: FormControl = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(15),
    Validators.maxLength(15)
    //Validators.pattern('^(1|2)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-9]\\d|2[AB])\\d{3}\\d{3}\\d{2}$'),
  ]));
  nom_groupe: FormControl = new FormControl('', Validators.required);
  desc_groupe: FormControl = new FormControl('', Validators.required);

  createGroupForm = new FormGroup(
    {
      nom: this.nom,
      prenom: this.prenom,
      dateNaiss: this.dateNaiss,
      numSecu: this.numSecu,
      nom_groupe: this.nom_groupe,
      desc_groupe: this.desc_groupe
    }
  )

  isFieldsValid(): boolean {
    return this.createGroupForm.valid;
  }

  onSubmit(): void {
    this._groupService.addGroup(this.nom_groupe.value, this.prenom.value, this.nom.value, this.numSecu.value, this.desc_groupe.value)
      .pipe(first()).subscribe(group => {
        this._router.navigate(['/groupes']);
    });
  }
}
