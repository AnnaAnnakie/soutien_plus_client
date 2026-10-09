import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class NotificationAssignement {
    constructor(
      private assignmentId: number,
      private assignedUserName: string,
      private authorName: string,
      private documentName: string,
      private documentId: number,
      private groupName: string,
      private action: string,
      private date_limit: string,
      private create_at: string,
      private room_id: number
    ) {}

    getRoomId(): number {
      return this.room_id;
    }
  
    // Getters
    getCreateAt(): string{
      return this.create_at;
    }

    getDateLimit(): string {
      return this.formatDate(this.date_limit);
    }
    
    // Convertir une date de format "YYYY-MM-DD HH:MM:SS.ssssss" en "DD/MM/YYYY à HH:MM"
    formatDate(date: string): string {
      if (!date) return '';
    
      const dateObj = new Date(date);
      const jour = dateObj.getDate().toString().padStart(2, '0');
      const mois = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
      const annee = dateObj.getFullYear();
      const heures = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
      return `${jour}/${mois}/${annee} à ${heures}:${minutes}`;
    }

    getAssignmentId(): number {
      return this.assignmentId;
    }
  
    getAssignedUserName(): string {
      return this.assignedUserName;
    }
  
    getAuthorName(): string {
      return this.authorName;
    }
  
    getDocumentName(): string {
      return this.documentName;
    }
  
    getDocumentId(): number {
      return this.documentId;
    }
  
    getGroupName(): string {
      return this.groupName;
    }
  
    getAction(): string {
      return this.action;
    }
  }
  