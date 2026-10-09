import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, first, map, Observable, of, switchMap} from 'rxjs';
import {environment} from '../../../assets/environment';
import {Permission} from '../../model/permission/permission';
import {RoleService} from '../roles/role.service';
import {UserService} from '../user/user.service';
import {GroupService} from '../group/group.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private readonly baseUrl = `http://${environment.apiUrl}/soutien`;

  constructor(private _groupeService: GroupService, private _userService: UserService, private http: HttpClient, private _roleService: RoleService) {}

  getAllPermission(): Observable<Permission[]> {
    const url = `${this.baseUrl}/permission`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        let permissions = [];
        for (let perm of response) {
          permissions.push(new Permission(perm.id, perm.permission, perm.description));
        }
        return permissions
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  getPermissionOfUsers(idGroupe: number): Observable<Permission[]> {

    return this._userService.getUser().pipe(
      first(),
      switchMap(user =>
        this._groupeService.getRoleOfUser(idGroupe, user.id).pipe(
          first(),
          map(role => role.permissions)
        )
      )
    );

  }

  getSelfPermissions(idGroupe: number): Observable<Permission[]> {
    return this._groupeService.getSelfRole(idGroupe).pipe(
      first(),
      map(role => role.permissions)
    );
  }

}
