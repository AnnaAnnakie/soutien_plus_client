import { Component } from '@angular/core';
import { AsideBarComponent } from '../aside-bar/aside-bar.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../services/group/group.service';
import {first} from 'rxjs';
import {PermissionService} from '../../services/permissions/permission.service';
import {Permission} from '../../model/permission/permission';

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [AsideBarComponent, NgFor, NgIf, FormsModule],
  templateUrl: './membres.component.html',
  styleUrls: ['./membres.component.scss'],
})
export class MembresComponent {

  members = [];
  groupeId: number = 0;

  constructor(private _router: Router, private _route: ActivatedRoute, private _groupService: GroupService, private _permissionService: PermissionService) {
    this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getMembers();
    this.getCode();
    this.getPermissions();
  }

  getPermissions() {
    this._permissionService.getPermissionOfUsers(this.groupeId).subscribe(permissions => {
      this.permissions = permissions;
      console.log(this.permissions)
    });
  }

  getMembers(): void {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._groupService.getGroup(groupeId).pipe(first())
      .subscribe(group => {
        this.members = group.getUsers();
      });
  }

  showPopup = false; // Pour afficher/masquer la popup "Ajouter un membre"
  email = ''; // Mail saisi dans la popup
  activePopupId: number | null = null; // Pour afficher/masquer le menu contextuel des membres
  code: number | null = null;

  getCode(): void{
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._groupService.getGroup(groupeId).pipe(first())
      .subscribe(group => {
        this.code = group.getCodeInvitation()
      })
  }
  //members = [
  //  { id: 1, nom: 'Dupont', prenom: 'Jean', role: 'Admin' },
  //  { id: 2, nom: 'Martin', prenom: 'Sophie', role: 'Utilisateur' },
  //  { id: 3, nom: 'Durand', prenom: 'Paul', role: 'Modérateur' },
  //];

  // Toggle la popup principale
  togglePopup() {
    if(this.hasPermission('group_add_person')){
      this.showPopup = !this.showPopup;
    }
  }

  // Toggle le menu contextuel d'un membre
  togglePopupDot(id: number): void {
    this.activePopupId = this.activePopupId === id ? null : id;
  }

  // Actions : Modifier un membre
  editMember(id: number): void {
    if (this.hasPermission('member_modify')){
      alert(`Modifier le membre avec l'ID ${id}`);
    }
  }

  // Actions : Supprimer un membre
  deleteMember(id: number): void {
    if (this.hasPermission('group_remove_person')){
      alert(`Supprimer le membre avec l'ID ${id}`);
    }
  }

  // Ajouter un membre
  addMember(): void {
    alert('Ajouter un nouveau membre');
  }

  // Copier le code dans le presse-papiers
  copyCode() {
    navigator.clipboard.writeText(String(this.code)).then(() => {
      alert('Code copié');
    });
  }

  // Envoyer le mail
  sendMail() {
    const groupId = Number(this._route.snapshot.paramMap.get('id'));
    if (this.email) {
      this._groupService.sendMail(this.email, groupId).subscribe(mail =>{});
      alert(`Mail envoyé à ${this.email}`);
      this.email = ''; // Réinitialise le champ

    } else {
      alert('Veuillez entrer un email valide.');
    }
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
