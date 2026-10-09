import { Injectable } from '@angular/core';
import {environment} from '../../../assets/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Board} from '../../model/kanban/board.model';
import {Groupe} from '../../model/groupe/groupe';
import {Colonne} from '../../model/kanban/colonne';
import {Tache} from '../../model/kanban/tache';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  private readonly baseUrl = `http://${environment.apiUrl}/soutien`;

  constructor(private http: HttpClient) {
  }
  getColonnes(idGroupe: number): Observable<Colonne[]> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/kanban`;
    console.log(url)
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => response.map(colonne => new Colonne(
        colonne.id,
        colonne.nom,
        colonne.ordre,
        colonne.taches.map((tache:any) => new Tache(
          tache.id,
          tache.titre,
          tache.description,
          tache.responsable_id,
          tache.type,
          tache.id_document,
          tache.date,
          tache.is_in_calendrier,
          tache.id_personne_assignee,
          tache.id_role_assignee
        ))
      ))),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des colonnes', error);
        return throwError(() => new Error('Une erreur est survenue.'));
      })
    );
  }

  addTache(idGroupe: number, idColonne: number, tache: Tache): Observable<Tache> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/kanban/add/${idColonne}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      titre: tache.titre,
      description: tache.description,
      typeTache: tache.type,
      dateEcheance: tache.date,
      isInCalendrier: tache.isInCalendrier,
      responsable: { usrId: tache.responsableId },
      ...(tache.idDocument && { document: { doc_id: tache.idDocument } }),
      ...(tache.idPersonneAssignee && { personne_assignee: { usrId: tache.idPersonneAssignee } }),
      ...(tache.idRoleAssignee && { role_assignee: { id: tache.idRoleAssignee } })
    };
    console.log(payload);    

    return this.http.post<any>(url, payload, { headers }).pipe(
      map(response => new Tache(
        response.id,
        response.titre,
        response.description,
        response.responsable_id,
        response.type,
        response.id_document,
        response.date,
        response.is_in_calendrier,
        response.id_personne_assignee,
        response.id_role_assignee
      )),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de l\'ajout de la tâche', error);
        return throwError(() => new Error('Impossible d\'ajouter la tâche.'));
      })
    );
  }

  addColonne(idGroupe: number, nom: string, ordre: number): Observable<Colonne> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/kanban/colonne/add`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nom, ordre };

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => new Colonne(
        response.id,
        response.nom,
        response.ordre,
        []
      )),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de l\'ajout de la colonne', error);
        return throwError(() => new Error('Impossible d\'ajouter la colonne.'));
      })
    );
  }


  modifyTache(idTache: number, tache: Tache): Observable<Tache> {
    const url = `${this.baseUrl}/groupe/kanban/tache/${idTache}/modify`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<Tache>(url, tache, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la modification de la tâche', error);
        return throwError(() => new Error('Une erreur est survenue lors de la modification de la tâche.'));
      })
    );
  }


  modifyColonne(idColonne: number, nom: string, ordre: number): Observable<Colonne> {
    const url = `${this.baseUrl}/groupe/kanban/colonne/${idColonne}/modify`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { nom, ordre };

    return this.http.put<Colonne>(url, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la modification de la colonne', error);
        return throwError(() => new Error('Une erreur est survenue lors de la modification de la colonne.'));
      })
    );
  }

  deleteTache(idTache: number): Observable<void> {
    const url = `${this.baseUrl}/groupe/kanban/tache/${idTache}/delete`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.delete(url, { headers,observe: 'response', responseType: 'text'  }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('La suppression de la tâche a échoué.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la suppression de la tâche', error);
        return throwError(() => new Error('Une erreur est survenue lors de la suppression de la tâche.'));
      })
    );
  }

  deleteColonne(idColonne: number): Observable<void> {
    const url = `${this.baseUrl}/groupe/kanban/colonne/${idColonne}/delete`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.delete(url, { headers,observe: 'response', responseType: 'text'  }).pipe(
      map(response => {
        if (response.status !== 200) {
          throw new Error('La suppression de la colonne a échoué.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la suppression de la colonne', error);
        return throwError(() => new Error('Une erreur est survenue lors de la suppression de la colonne.'));
      }));
  }
  }
