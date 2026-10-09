import {Injectable} from '@angular/core';
import {Document} from '../../model/document/document';
import {map, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../assets/environment';
import { User } from '../../model/user/user';
import { Role } from '../../model/role/role';
import { Assignement } from '../../model/document/assignement';
import { CreateDocumentDTO } from '../../model/document/createDocumentDTO';
import { NotificationAssignement } from '../../model/document/notificationAssignement';
import {group} from '@angular/animations';

@Injectable({
  providedIn: 'root',  // Fournit ce service à l'échelle de l'application
})
export class DocumentService {

  private readonly baseUrl = `http://${environment.apiUrl}/soutien`;


  constructor(private http: HttpClient) { }

 /**
   * Récupère le document dont l'id est renseigné en paramètre en envoyant une requête vers l'API Spring Boot.
   * @param id
   * @returns Un Observable contenant le document ou undefined si non trouvé.
   */

 
  getDocument(id: number): Observable<Document | undefined> {
    const url = `${this.baseUrl}/document`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${url}/${id}`, {headers}).pipe(
      map((doc) => {
        if (doc) {
          return new Document(
            doc.id,
            doc.room_id,
            doc.version,
            doc.original_id,
            doc.name,
            doc.description,
            doc.date_creation,
            doc.date_modif,
            doc.author,
            doc.content,
            doc.type,
          );
        } else {
          return undefined;
        }
      })
    );
  }


  /**
   * Récupère l'ensemble des documents dans la base de données en envoyant une requête vers l'API Spring Boot.
   * TODO: Charger seulement les documents dont l'utilisateur a accès.
   * @returns Un Observable contenant une liste de documents.
   */
  getDocuments(idGroupe: number): Observable<Document[]> {
    const url = `${this.baseUrl}/groupe/${idGroupe}/documents`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(url, {headers}).pipe(
      map((docs) => docs.map(doc => new Document(
        doc.id,
        doc.room_id,
        doc.version,
        doc.original_id,
        doc.name,
        doc.description,
        doc.date_creation,
        doc.date_modif,
        doc.author,
        doc.content,
        doc.type,
      )))
    );
  }

  getNotificationAssignements(userId: number): Observable<NotificationAssignement[]> {
    const url = `${this.baseUrl}/assignements/notifications/${userId}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(url, { headers }).pipe(
      map((notifications) =>
        notifications.map(notification => new NotificationAssignement(
          notification.assignmentId,
          notification.assignedUserName,
          notification.authorName,
          notification.documentName,
          notification.documentId,
          notification.groupName,
          notification.action,
          notification.date_limit,
          notification.created_at,
          notification.roomId
        ))
      )
    );
  }

  
  getCountNotificationAssignements(userId: number): Observable<number> {
    const url = `${this.baseUrl}/assignements/notifications/count/${userId}`;
    const token = localStorage.getItem('auth_token');
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get<number>(url, { headers });
  }

  getAssignements(idUser: number): Observable<Assignement[]> {
    const url = `${this.baseUrl}/assignements/${idUser}`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(url, { headers }).pipe(
      map((assignments) => assignments.map(assign => new Assignement(
        assign.id,
        assign.documentId,
        assign.recipientId,
        assign.status,
        assign.message,
        assign.action,
        assign.created_at,
        assign.date_limit
      )))
    );
  }


  getAllVersionDoc(id: number): Observable<Document[]> {
    const url = `${this.baseUrl}/documents`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(url+'/'+id, {headers}).pipe(
      map((docs) => docs.map(doc => new Document(
        doc.id,
        doc.room_id,
        doc.version,
        doc.original_id,
        doc.name,
        doc.description,
        doc.date_creation,
        doc.date_modif,
        doc.author,
        doc.content,
        doc.type,
      )))
    );
  }


  /**
   * Renomme le document dans la base de données dont l'id est renseigné en paramètre, avec le nouveau nom renseigné.
   * @param id
   * @param newName
   */
  renameDocument(id: number, newName: string): Observable<void> {
    const url = `${this.baseUrl}/document/rename`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<void>(`${url}/${id}`, { name: newName }, {headers});
  }

  /**
   * Supprime le document dans la base de données en envoyant une requête à l'API Spring Boot dont l'id est renseigné en paramètre.
   * @param id
   */
  deleteDocument(id: number): Observable<void> {
    console.log("delete"+id)
    const url = `${this.baseUrl}/document/delete`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete<void>(`${url}/${id}`, {headers});
  }


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private buildFormData(document: any, isNew: boolean, assignement?: Assignement): FormData {
    const formData = new FormData();

    // Création des métadonnées du document
    const metadata = {
      id: isNew ? null : document.getId(),
      room_id: document.getRoomId(),
      name: document.getName(),
      author: document.getAuthor(),
      date_creation: document.getDateCreation(),
      date_modif: isNew ? document.getDateCreation() : document.getDateModif(),
      description: document.getDescription(),
      type: document.getType(),
    };

    formData.append('metadata', JSON.stringify(metadata));

    // Création du fichier Blob
    const blob = document.getContent()
      ? new Blob([new Uint8Array(document.getContent())], { type: 'application/octet-stream' })
      : new Blob([], { type: 'application/octet-stream' });

    formData.append('content', blob, document.getName());

    // Ajout des métadonnées de l'assignement s'il est fourni
    if (assignement) {
      const assignementMetadata = {
        id: assignement.getId(),
        documentId: assignement.getDocId(),
        recipientId: assignement.getRecipientId(),
        status: assignement.getStatus(),
        message: assignement.getMessage(),
        action: assignement.getAction(),
        date_limit: assignement.getDateLimit(),
        created_at: assignement.getCreatedAt(),

      };

      formData.append('assignement', JSON.stringify(assignementMetadata));
    }

    return formData;
  }

  createDocument(document: CreateDocumentDTO, assignement?: Assignement): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, this.buildFormData(document, true, assignement), {
      headers: this.getAuthHeaders(),
    });
  }

  modifiedDocument(document: Document, assignement?: Assignement): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, this.buildFormData(document, false, assignement), {
      headers: this.getAuthHeaders(),
    });
  }

  accesDocument(users: User[], roles: Role[]){


  }

}
