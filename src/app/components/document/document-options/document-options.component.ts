import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgForOf, NgClass, NgIf} from '@angular/common';
import {DocumentService} from '../../../services/document/document.service';
import {Document} from '../../../model/document/document';
import {FormsModule} from '@angular/forms'; // Importer FormsModule
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../services/group/group.service';
import {Groupe} from '../../../model/groupe/groupe';
import {first} from 'rxjs';
import {PopUpComponent} from '../../pop-up/pop-up.component';
import {LoadingComponent} from "../../loading/loading.component";

@Component({
  selector: 'app-document-options',
  standalone: true,
  imports: [FormsModule, NgIf, PopUpComponent, LoadingComponent],
  templateUrl: './document-options.component.html',
  styleUrl: './document-options.component.scss'
})
export class DocumentOptionsComponent {
  isLoading: boolean = false;

  @Input() selectedDoc!: Document; // Document reçu depuis le parent
  @Input() menuPosition!: { top: number; left: number };
  @Output() closeMenu = new EventEmitter<void>(); // Événement pour fermer le menu
  @Output() reload = new EventEmitter<void>(); // Événement pour recharger les documents

  modalPosition!: { top: number; left: number };
  isRenameModalOpen: boolean = false; // Contrôle l'affichage du modal de renommage
  newDocumentName: string = ''; // Nouveau nom à entrer

  //Pop-up gestion
  isPopupOpen = false;
  message: string = "";
  buttonPos?: string;
  buttonNeg?: string;
  groupe?: Groupe;

  //injection de service
  private documentService: DocumentService = inject(DocumentService)
  private groupeService: GroupService = inject(GroupService)

  constructor(private _router: Router, private _route: ActivatedRoute) {
  }

  ngOnInit() {
    const idGroupe = this._route.snapshot.paramMap.get('id');
    if (idGroupe) {
      this.getGroupe(parseInt(idGroupe));
    }
  }

  getGroupe(idGroupe: number) {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this.groupeService.getGroup(groupeId).pipe(first()).subscribe(groupe => {
      this.groupe = groupe;
    });
  }


  onClickModifier(): void {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._router.navigate(['groupe/' + groupeId + '/document/' + this.selectedDoc.getId() + '/modifier']);
  }


  onClickVersion() {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    const docId = this.selectedDoc.getOriginalId();

    this._router.navigate(
      ['groupe', groupeId, 'documents', docId, 'version'],
      {queryParams: {name: this.selectedDoc.getName()}}
    );
  }


  /**
   * Utilise documentService pour delete le document sélectionné
   */
  delete(): void {
    this.isLoading = true;
    this.documentService.deleteDocument(this.selectedDoc.getId())
      .subscribe({
        next: () => {
          this.closePopup();
          this.closeMenu.emit();
        },
        complete: () => {
          this.reload.emit();
        },
        error: (err) => {
          this.isLoading = false;
          alert('Erreur : impossible de supprimer le document.');
          console.error(err);
        }
      });
  }


  openPopup(message: string, buttonNeg: string, buttonPos: string): void {
    this.message = message;
    this.buttonNeg = buttonNeg;
    this.buttonPos = buttonPos;
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

}
