import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Document } from '../../../model/document/document';
import { NgIf } from '@angular/common';
import { DocumentService } from '../../../services/document/document.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { first, tap } from 'rxjs';
import { User } from '../../../model/user/user';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-display-pdf',
  standalone: true,
  imports: [NgIf],
  templateUrl: './display-pdf.component.html',
  styleUrl: './display-pdf.component.scss'
})
export class DisplayPDFComponent implements OnInit {
  currentUser: User | undefined;
  pdfUrl?: SafeResourceUrl;
  @Input() document?: Document;
  @Input() displayIn?: boolean = false;
  @Input() title?: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer, private _userService: UserService) { }

  /**
   * Lors de l'initialisation récupérer le document courant
   */
  ngOnInit(): void {
    if (this.document) {
      this.createPdfUrlFromContent(this.document.getContent());
      this.getUser(this.document.getAuthor())
    } else {
      console.error('Erreur lors du chargement du document');
    }
  }

  /**
   * Récupérer l'utilisateur courrant
   * @returns 
   */
  getUser(id: number) {
    this._userService.getUserById(id)
      .pipe(
        first())
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  /**
   * Transforme le "content" d'un objet document d'ArrayBuffer à un blob
   * afin de pouvoir lire le pdf
   * @param content 
   */
  createPdfUrlFromContent(content: any): void {
    if (content instanceof ArrayBuffer) {
      this.createPdf(content);
    } else if (content instanceof Blob) {
      this.blobToArrayBuffer(content).then((arrayBuffer) => {
        this.createPdf(arrayBuffer);
      });
    } else if (typeof content === 'string') {
      const arrayBuffer = this.base64ToArrayBuffer(content);
      this.createPdf(arrayBuffer);
    } else {
      console.error('Type de contenu non pris en charge');
    }
  }

  private createPdf(arrayBuffer: ArrayBuffer): void {
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private async blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }


  /**
 * Émet un événement pour fermer la fenêtre pop-up
 */
  onCancel(): void {
    this.close.emit(false);
  }
}
