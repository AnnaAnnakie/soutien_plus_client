import { Component } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PermissionService} from '../../services/permissions/permission.service';
import {Permission} from '../../model/permission/permission';
import { NgIf } from '@angular/common';
import {GroupService} from '../../services/group/group.service';
import {KanbanService} from '../../services/kanban/kanban.service';
import {Tache} from '../../model/kanban/tache';

@Component({
  selector: 'app-groupe',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './groupe.component.html',
  styleUrl: './groupe.component.scss'
})
export class GroupeComponent {


  constructor(private a: KanbanService,private _router: Router, private _route: ActivatedRoute, private _permissionService: PermissionService,private _groupService: GroupService) {
    this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.getPermissions();
    this.getGroupName();


  }

  groupeId: number = 0;
  nom_groupe: string | null = null;

  getPermissions() {
    this._permissionService.getPermissionOfUsers(this.groupeId).subscribe(permissions => {
      this.permissions = permissions;
      console.log(this.permissions);
    });
  }

  getGroupName() {
    this._groupService.getGroup(this.groupeId).subscribe({
      next: (group) => {
        this.nom_groupe = group.roomName; // Assurez-vous que `roomName` est bien la propriété qui contient le nom
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du groupe :', err);
      }
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
  hasPermissionVisual(permission: string): boolean {
    const activePermission = this.permissions.some(p => p.permission === '*' || p.permission === permission);
    return activePermission;
  }

  supprimerGroupe() {
    alert("supprimer le groupe");
  }
}
