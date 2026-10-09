import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Contact } from '../../model/contact/contact';
import { environment } from '../../../assets/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly baseUrl = `http://${environment.apiUrl}/soutien`;

  constructor(private http: HttpClient) {}

  getContacts(idGroupe: number): Observable<Contact[]> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/contacts`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => response.map(contact => new Contact(
        contact.id,
        contact.id_groupe,
        contact.nom,
        contact.prenom,
        contact.metier,
        contact.email,
        contact.telephone
      ))),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des contacts', error);
        return throwError(() => new Error('Une erreur est survenue.'));
      })
    );
  }

  addContact(idGroupe: number, contact: Contact): Observable<Contact> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/contacts/add`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const contactData = {
      nom: contact.nom,
      prenom: contact.prenom,
      metier: contact.metier,
      email: contact.email,
      telephone: contact.telephone
    };

    return this.http.post<any>(url, contactData, { headers }).pipe(
      map(response => new Contact(
        response.id,
        response.id_groupe,
        response.nom,
        response.prenom,
        response.metier,
        response.email,
        response.telephone
      )),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de l\'ajout du contact', error);
        return throwError(() => new Error('Impossible d\'ajouter le contact.'));
      })
    );
  }

  deleteContact(idGroupe: number, idContact: number): Observable<void> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/contacts/${idContact}/delete`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.delete(url, { headers, observe: 'response', responseType: 'text' }).pipe(
      map(response => {
        if (response.status !== 204) {
          throw new Error('La suppression du contact a échoué.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la suppression du contact', error);
        return throwError(() => new Error('Une erreur est survenue lors de la suppression du contact.'));
      })
    );
  }
}
