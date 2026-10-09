import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsideBarComponent} from '../aside-bar/aside-bar.component';
import {PermissionService} from '../../services/permissions/permission.service';
import {Permission} from '../../model/permission/permission';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../services/group/group.service';

@Component({
  selector: 'app-profil-senior',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideBarComponent],
  templateUrl: './profil-senior.component.html',
  styleUrls: ['./profil-senior.component.scss']
})

export class ProfilSeniorComponent implements OnInit {


  // Attributs utilisateur
  nom_senior: string = 'default_lastname';
  prenom_senior: string = 'default_firstname';
  email_senior: string = 'senior@email.com';
  numtel_senior: string = '06 12 34 56 78';
  imgpp: string = 'assets/parametre/imgpp.png';
  adresse_senior: string = '';
  ddn_senior: Date = new Date('1920-01-01');

  // Attributs tuteur
  nom_tut: string = '';
  prenom_tut: string = 'Benjamin';
  email_tut: string = 'benjaminkalic131@gmail.com';
  numtel_tut: string = '';

  // Commentaires
  comments: string = 'Aucun commentaire disponible.';

  isEditable: boolean = false;

  constructor(private _groupService: GroupService,private _route: ActivatedRoute, private _permissionService: PermissionService) {
    this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getUser();
    this.getPermissions();
    this._groupService.getGroup(this.groupeId = Number(this._route.snapshot.paramMap.get('id'))).subscribe(groupe => {
      this.nom_senior = groupe.personSecondName;
      this.prenom_senior = groupe.personName;


    });
  }

  toggleEdit(): void {
    if(this.hasPermission('profile_modify')){
      if (this.isEditable) {
        // Sauvegarder les données dans le localStorage avec les mêmes clés
        localStorage.setItem('senior_nom', this.nom_senior);
        localStorage.setItem('senior_prenom', this.prenom_senior);
        localStorage.setItem('senior_email', this.email_senior);
        localStorage.setItem('senior_numtel', this.numtel_senior);
        localStorage.setItem('senior_imgpp', this.imgpp); // N'oublie pas l'image
        localStorage.setItem('senior_adresse', this.adresse_senior);
        localStorage.setItem('senior_ddn', this.ddn_senior.toISOString()); // Sauvegarde de la date de naissance
        localStorage.setItem('tut_nom', this.nom_tut);
        localStorage.setItem('tut_prenom', this.prenom_tut);
        localStorage.setItem('tut_email', this.email_tut);
        localStorage.setItem('tut_numtel', this.numtel_tut);
        localStorage.setItem('senior_commentaires', this.comments);
      }
      this.isEditable = !this.isEditable; // Bascule entre mode édition et mode lecture
    }
  }

  getUser(): void {
    // Récupération des informations depuis localStorage avec les bonnes clés
    this.nom_senior = localStorage.getItem('senior_nom') || this.nom_senior;
    this.prenom_senior = localStorage.getItem('senior_prenom') || this.prenom_senior;
    this.email_senior = localStorage.getItem('senior_email') || this.email_senior;
    this.numtel_senior = localStorage.getItem('senior_numtel') || this.numtel_senior;
    this.imgpp = localStorage.getItem('senior_imgpp') || this.imgpp;
    this.adresse_senior = localStorage.getItem('senior_adresse') || this.adresse_senior;

    // Gestion sécurisée de la date de naissance
    const savedDate = localStorage.getItem("senior_ddn");
    this.ddn_senior = savedDate ? new Date(savedDate) : new Date('1920-01-01');

    // Infos du tuteur
    this.nom_tut = localStorage.getItem('tut_nom') || this.nom_tut;
    this.prenom_tut = localStorage.getItem('tut_prenom') || this.prenom_tut;
    this.email_tut = localStorage.getItem('tut_email') || this.email_tut;
    this.numtel_tut = localStorage.getItem('tut_numtel') || this.numtel_tut;

    // Commentaires
    this.comments = localStorage.getItem('senior_commentaires') || this.comments;
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imgpp = reader.result as string;
        localStorage.setItem('senior_imgpp', this.imgpp);
      };

      reader.readAsDataURL(file);
    }
  }

  groupeId: number = 0;
  getPermissions() {
    this._permissionService.getPermissionOfUsers(this.groupeId).subscribe(permissions => {
      this.permissions = permissions;
      console.log(this.permissions);
    });
  }

  permissions: Permission[] = [];
  hasPermission(permission: string): boolean {
    const activePermission = this.permissions.some(p => p.permission === '*' || p.permission === permission);
    if (!activePermission) {
      alert('Vous n\'avez pas les permissions nécessaires pour effectuer cette action');
    }
    return activePermission;
  }

}
