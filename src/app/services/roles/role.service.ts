import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {Role} from '../../model/role/role';
import {environment} from '../../../assets/environment';
import {Permission} from '../../model/permission/permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly baseUrl = `http://${environment.apiUrl}/soutien`;

  constructor(private http: HttpClient) {}

  getRole(id: number): Observable<Role> {
    const url = `${this.baseUrl}/role/${id}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        let permissions = []
        for (let perm of response.permissions) {
          permissions.push(new Permission(perm.id,perm.permission, perm.description));
        }
        return new Role(response.id,response.name,response.description, permissions, response.base);
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  addRoleInGroupe(idGroupe: number, nom_role:string,description: string){
    const url = `${this.baseUrl}/groupe/${idGroupe}/role/add`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Corps de la requête (body)
    const body = {
      name: nom_role,
      description: description
    };

    return this.http.post(url, body, { headers }).subscribe();
  }

  setPermission(id: number, idGroupe: number,permIds: number[]) {
    const url = `${this.baseUrl}/groupe/${idGroupe}/role/${id}/setpermissions`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(url, permIds, { headers });
  }





}
