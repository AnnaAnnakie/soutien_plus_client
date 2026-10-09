import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../assets/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL de base de l'API pour l'authentification
  private readonly baseUrl = `http://${environment.apiUrl}/soutien/auth`;

  constructor(private http: HttpClient) {}

  isConnected(): Observable<boolean> {
    const url = `${this.baseUrl}/validate-token`;
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<boolean>(url, { headers }).pipe(
      map(response => response), // Si l'API retourne `true` ou `false`, transmettre directement la réponse
      catchError(() => of(false)) // En cas d'erreur (401 ou autre), renvoyer `false`
    );
  }

  register(userData: {
    usrPassword: string;
    usrName: string;
    usrSecondName: string;
    usrEmail: string;
  }): Observable<any> {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url, userData);
  }

  login(loginData: { usrEmail: string; usrPassword: string }): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post(url, loginData).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Erreur 401 : Email ou mot de passe incorrect.');
          return throwError(() => new Error('Email ou mot de passe incorrect.'));
        } else {
          console.error('Erreur serveur :', error.message);
          return throwError(() => new Error('Une erreur est survenue.'));
        }
      })
    );
  }
}
