import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Document} from '../../../model/document/document';
import {NgIf} from '@angular/common';
import {DocumentService} from '../../../services/document/document.service';
import {Location} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DisplayPDFComponent} from '../display-pdf/display-pdf.component';
import {UserService} from '../../../services/user/user.service';
import {first} from 'rxjs';
import {User} from '../../../model/user/user';
import { AsideBarComponent } from "../../aside-bar/aside-bar.component";

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [NgIf, DisplayPDFComponent, AsideBarComponent],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss'
})
export class DocumentDetailComponent implements OnInit {
  pdfUrl?: SafeResourceUrl;
  document: Document | undefined;
  currentUser: User | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private location: Location,
     private _userService: UserService
  ) { }

  /**
   * Lors de l'initialisation récupérer le document courant
   */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idDoc');
    if (idParam) {
      const id = Number(idParam); // Convertir idParam en nombre
      if (!isNaN(id)) {
        this.getDocument(id);
      } else {
        console.error('Paramètre id invalide :', idParam);
      }
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
   * Utilise document service pour retrouver le document à partir d'un ID
   * @param id
   */
  getDocument(id: number): void {
    this.documentService.getDocument(id).subscribe((doc) => {
      this.document = doc;
      if (this.document) {
        this.createPdfUrlFromContent(this.document.getContent());
        this.getUser(this.document.getAuthor())
      } else {
        console.log("Document introuvable");
      }
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
    const blob = new Blob([new Uint8Array(arrayBuffer)], {type: 'application/pdf'});
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


  //Retourner à la page précédente
  goBack(): void {
    this.location.back();
  }
}
