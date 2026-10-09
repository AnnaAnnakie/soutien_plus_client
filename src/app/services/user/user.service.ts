import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {User} from '../../model/user/user';
import {environment} from '../../../assets/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL de base de l'API pour l'authentification
  private readonly baseUrl = `http://${environment.apiUrl}/soutien/user`;

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    const url = `${this.baseUrl}/getuser`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, {}, { headers }).pipe(
      map(response => {
        return new User(
          response.id,
          response.name,
          response.second_name,
          response.email,
          response.telephone,
          response.metier,
          response.groupes
        );
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.baseUrl}/getuser`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${url}/${id}`, {headers}).pipe(
      map(response => {
        return new User(
          response.id,
          response.name,
          response.second_name,
          response.email,
          response.telephone,
          response.metier,
          response.groupes
        );
      }),
      catchError((error: HttpErrorResponse) => {
        throw new Error('Une erreur est survenue.');
      })
    );
  }

}
