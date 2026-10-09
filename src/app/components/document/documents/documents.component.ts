import { Component, inject, Input, input } from '@angular/core';
import { NgForOf, NgClass, NgIf } from '@angular/common';
import { Document } from '../../../model/document/document';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../../services/document/document.service';
import { DocumentOptionsComponent } from '../document-options/document-options.component';
import { catchError, first, forkJoin, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AsideBarComponent } from "../../aside-bar/aside-bar.component";
import { LoadingComponent } from "../../loading/loading.component";
import { GroupService } from '../../../services/group/group.service';
import { Groupe } from '../../../model/groupe/groupe';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../model/user/user';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf, DocumentOptionsComponent, AsyncPipe, AsideBarComponent, LoadingComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {

  documents?: Document[];
  selectedDoc?: Document; // Pour aller sur la page détail du document cliqué
  groupe?: Groupe;
  isPopupOpen = false;
  isLoading: boolean = false;
  isOpen: { [id: string]: boolean } = {}; // Savoir si le menu est ouvert
  selectedMenu?: Document; //Pour ouvrir le menu du document concerné
  menuPosition!: { top: number; left: number };
  authors: Map<number, User> = new Map();
  title = "Liste des documents du groupe "
  idDoc?: string |null;
  @Input() documentName!: string;

  // injection de service
  private documentService: DocumentService = inject(DocumentService)
  private groupeService: GroupService = inject(GroupService)
  private userService: UserService = inject(UserService)


  constructor(private _router: Router, private _route: ActivatedRoute) { }


  /**
   * Récupère les documents lors de l'initialisation de la page upload
   */
  ngOnInit(): void {
    this.idDoc = this._route.snapshot.paramMap.get('idDoc');
    const idGroupe = Number(this._route.snapshot.paramMap.get('id'));

    if (this.idDoc) { //Si l'on affiche la liste des versions d'un document
      this._route.queryParams.subscribe(params => {
        this.documentName = params['name'];
      });
      this.loadAllData(parseInt(this.idDoc), idGroupe, true);
    } else {
      this.loadAllData(null, idGroupe, false);
    }
  }

  /**
   * Charge les documents et le groupe en parallèle et attend la fin des appels avant d'exécuter la suite.
   */
  loadAllData(idDoc: number | null, idGroupe: number, isVersion: boolean): void {
    this.isLoading = true;
    let documentsRequest: Observable<Document[]> = isVersion && idDoc !== null
      ? this.documentService.getAllVersionDoc(idDoc).pipe(first())
      : this.documentService.getDocuments(idGroupe).pipe(first());

    let groupRequest: Observable<Groupe | null> = idGroupe !== null
      ? this.groupeService.getGroup(idGroupe).pipe(first())
      : new Observable<Groupe | null>((observer) => {
        observer.next(null);
        observer.complete();
      });

    forkJoin([documentsRequest, groupRequest]).subscribe({
      next: ([documents, group]) => {
        this.documents = documents;
        if (group) {
          this.groupe = group;
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des données :", err);
      },
      complete: () => {
        if (idDoc) {
          this.title = "Liste des versions du document " + this.documentName + " du groupe ";

        }
        this.loadAuthors(); // Charger les auteurs après que tous les appels API sont terminés
        this.isLoading = false;
      }
    });
  }

  /**
   * Charge les auteurs des documents en supprimant les doublons
   */
  loadAuthors() {
    if (this.documents) {
      const authorIds = this.documents.map(doc => doc.getAuthor());
      const uniqueAuthorIds = [...new Set(authorIds)];

      const authorRequests = uniqueAuthorIds.map(id =>
        this.userService.getUserById(id).pipe(first())
      );

      forkJoin(authorRequests).subscribe(users => {
        users.forEach((user, index) => {
          this.authors.set(uniqueAuthorIds[index], user);
        });
      });
    }
  }

  getUserById(id: number): User | undefined {
    return this.authors.get(id);
  }

  /**
   * Ouvre le menu en envoyant les informations à partir de l'html
   * vers <app-document-options>
   * @param event
   * @param doc
   */
  openMenu(event: MouseEvent, doc: Document): void {
    event.stopPropagation();
    this.selectedDoc = doc;
    if (this.selectedDoc?.getId()) {
      this.isOpen[this.selectedDoc?.getId()] = true; // Ferme le menu
    } // Ouvre le menu
    this.menuPosition = {
      top: event.clientY,
      left: event.clientX,
    };
  }

  /**
   * Ferme le menu actuellement ouvert
   */
  closeMenu(): void {
    if (this.selectedDoc?.getId()) {
      this.isOpen[this.selectedDoc?.getId()] = false; // Ferme le menu
    }
    this.selectedDoc = undefined;
  }

  reload(): void {
    this.ngOnInit();
  }

  /**
   * Redirige vers le contenu du documents séléctionné,
   * vers document-detail
   * @param doc => Document cliqué
   */
  onSelect(doc: Document): void {
    this.selectedDoc = doc;
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._router.navigate(['groupe/' + groupeId + '/document', doc.getId()]);
  }

  onClickAdd() {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._router.navigate(['groupe/' + groupeId + '/document/importer']);
  }


}
