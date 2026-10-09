import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment} from '../../../assets/environment';
import {Calendar} from '../../model/calendar/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = `http://${environment.apiUrl}/soutien/calendar`;

  constructor(private http: HttpClient) {}

  addEvent(eventData: any): Observable<any> {
    const url = `${this.baseUrl}/add`;
    const token = localStorage.getItem('auth_token');

    // Ajouter le token dans les headers
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, eventData, { headers }).pipe(
      map(response => {
        return {
          id: response.id,
          title: response.title,
          start_date: response.start_date,
          end_date: response.end_date,
          type: response.type,
          roomId: response.roomId
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de l\'ajout de l\'événement :', error);
        throw new Error('Impossible d\'ajouter l\'événement.');
      })
    );
  }

  getAllTaches(roomId: number): Observable<Calendar[]> {
    const url = `${this.baseUrl}/getAllTaches`;
    const token = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Calendar[]>(url, { roomId }, { headers }).pipe(
      map(response => {
        console.log("Tâches récupérées :", response); // Debugging

        return response
          .map((tacheData: any) => new Calendar(
            tacheData.id,
            tacheData.title,
            tacheData.start_date ? new Date(tacheData.start_date).toISOString() : null,
            tacheData.end_date ? new Date(tacheData.end_date).toISOString() : null,
            tacheData.type,
            tacheData.roomId
          ));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des tâches :', error);
        throw new Error('Impossible de récupérer les tâches.');
      })
    );
  }

  updateEvent(eventId: number |null, updatedFields: any, roomId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/setTache`, {
      id: eventId,
      roomId: roomId,
      ...updatedFields
    });
  }

  deleteEvent(eventId: number|null): Observable<any> {
    return this.http.request<any>('DELETE', `${this.baseUrl}/deleteTache`, {
      body: { id: eventId },
      responseType: 'text' as 'json'
    });
  }
}
