import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PermissionService} from '../../services/permissions/permission.service';
import {Permission} from '../../model/permission/permission';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss'
})
export class AsideBarComponent {

  constructor(private _router: Router, private _route: ActivatedRoute, private _permissionService: PermissionService) {
    this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.getPermissions();
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
  hasPermissionVisual(permission: string): boolean {
    const activePermission = this.permissions.some(p => p.permission === '*' || p.permission === permission);
    return activePermission;
  }
}
