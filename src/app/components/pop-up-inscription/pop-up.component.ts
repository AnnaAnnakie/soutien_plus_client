import {Component, Inject, inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {GroupService} from '../../services/group/group.service';

@Component({
  selector: 'app-pop-up-inscription',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpInscriptionComponent {
  inputValue = '';
  email = "";
  isEmail = false;
  isGroupes= false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.email = data.email;
    this.isEmail = data.isEmail;
    this.isGroupes = data.isGroupes;
  }



}
