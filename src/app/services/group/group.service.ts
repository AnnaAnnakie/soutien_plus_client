import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {User} from '../../model/user/user';
import {Groupe} from '../../model/groupe/groupe';
import {Role} from '../../model/role/role';
import {environment} from '../../../assets/environment';
import {Permission} from '../../model/permission/permission';
import {id} from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly baseUrl = `http://${environment.apiUrl}/soutien/groupe`;

  constructor(private http: HttpClient) {
  }

  getGroup(id: number): Observable<Groupe> {
    const url = `${this.baseUrl}/${id}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        return new Groupe(
          response.roomId,
          response.roomName,
          response.roomPersonName,
          response.roomPersonSecondName,
          response.roomSecurityNumber,
          response.roomDescription,
          response.roomInvitationCode,
          response.users
        );
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  getRolesOfGroupe(idGroupe: number,): Observable<Role[]> {
    const url = `${this.baseUrl}/${idGroupe}/roles`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Role[]>(url, { headers }).pipe(
      map(response => {
        let roles = [];
        for(let role of response){
          roles.push(new Role(role.id,role.name,role.description, [], role.base))
        }
        return roles;
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  getUtilisateursWithRolesInGroupe(idGroupe: number, idRole: number): Observable<User[]> {
    const url = `${this.baseUrl}/${idGroupe}/role/${idRole}/utilisateurs`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<User[]>(url, { headers }).pipe(
      map(response => {
        let users = [];
        for(let userReponse of response){
          users.push(new User(userReponse.id,userReponse.name,userReponse.second_name,userReponse.email, userReponse.telephone, userReponse.metier, []))
        }
        return users;
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  setUserToGroup(id_groupe: number, id_user: number): void {

  }

  setRoleToUserInGroup(id_groupe: number, id_role: number, id_user:number) {
    const url = `${this.baseUrl}/${id_groupe}/role/${id_role}/addUser/${id_user}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<User[]>(url, { headers }).pipe(
      map(response => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  addGroup(roomName: string, personName: string, personSecondName: string, securityNumber: number, description: string){
    const url = `${this.baseUrl}/add`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Corps de la requête (body)
    const body = {
      roomName: roomName,
      roomPersonName: personName,
      roomPersonSecondName: personSecondName,
      roomSecurityNumber: securityNumber,
      roomDescription: description
    };

    return this.http.post(url, body, { headers });
  }

  getRoleOfUser(idGroupe: number, idUser: number): Observable<Role> {
    const url = `${this.baseUrl}/${idGroupe}/roleUser/${idUser}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Role>(url, { headers }).pipe(
      map(response => {
        return new Role(response.id,response.name,response.description, response.permissions
          .map(permission => new Permission(permission.id,permission.permission,permission.description)), response.base);
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );

  }

  getSelfRole(idGroupe: number): Observable<Role> {
    const url = `${this.baseUrl}/${idGroupe}/selfRole`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Role>(url, { headers }).pipe(
      map(response => {
        return new Role(response.id,response.name,response.description, response.permissions
          .map(permission => new Permission(permission.id,permission.permission,permission.description)), response.base);
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );

  }

  joinGroup(roomInvitationCode: number){
    const url = `${this.baseUrl}/join`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    //Corps de la requete
    const body = {
      roomInvitationCode: roomInvitationCode
    };
    return this.http.post(url, body, { headers });
  }


   sendMail(toEmail: string, groupId: number){
    const url ='http://localhost:8080/soutien/invite/sendEmail';
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body ={
      groupId: groupId,
      toEmail: toEmail
    };
    return this.http.post(url, body, {headers});
  }
}
