import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UploadDirective } from '../directives/upload.directive';
import { AsideBarComponent } from '../../aside-bar/aside-bar.component';
import { DocumentsComponent } from '../documents/documents.component';
import { Document } from '../../../model/document/document';
import { DocumentService } from '../../../services/document/document.service';
import { DocumentEnumType } from '../../../model/document/document.type';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf, Location, NgIf } from '@angular/common';
import { User } from '../../../model/user/user';
import { GroupService } from '../../../services/group/group.service';
import { ActivatedRoute } from '@angular/router';
import { first, tap } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { Role } from '../../../model/role/role';
import { Groupe } from '../../../model/groupe/groupe';
import { DisplayPDFComponent } from "../display-pdf/display-pdf.component";
import { LoadingComponent } from "../../loading/loading.component";
import { Assignement } from '../../../model/document/assignement';
import { CreateDocumentDTO } from '../../../model/document/createDocumentDTO';
import { AssignementFormComponent } from "../assignement-form/assignement-form.component";


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [AsideBarComponent, UploadDirective, ReactiveFormsModule, NgForOf, NgIf, DisplayPDFComponent, LoadingComponent, AssignementFormComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})


export class UploadComponent {
  isNewDoc = false;
  originalDoc: Document | undefined;
  currentDoc: Document | undefined;

  newAssignement : Assignement | undefined;
  userAssigned : User | undefined;

  displayedDocument: any = null;
  displayedTitle: string = '';

  newDoc: CreateDocumentDTO | undefined

  title = "Ajouter un document"
  instruction = "Déposer un fichier ici"
  buttonImport = "Sélectionner un fichier"
  buttonDisable = false;
  buttonSubmit = "";
  isLoading: boolean = false;
  file: any;

  //Récupération de données
  documentTypes = Object.values(DocumentEnumType)


  membersGroupe: User[] = [];
  rolesGroupe: Role[] = [];
  currentGroupe: Groupe | undefined;
  currentUser: User | undefined;

  selectedType: DocumentEnumType | null = null;
  selectedAssignation: number | null = null;
  selectedMembers: User[] = [];
  selectedRoles: Role[] = [];
  selectedAction: string = "";

  isAformOpen: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(DocumentsComponent) documentsComponent!: DocumentsComponent;

  //Injection de services
  private documentService: DocumentService = inject(DocumentService)
  private groupeService: GroupService = inject(GroupService)

  constructor(private _userService: UserService, private location: Location, private _route: ActivatedRoute) { }

  isEditDoc(){
    return this.isAformOpen;
  }
  /*****************Formulaire************************/
  nom: FormControl = new FormControl('', Validators.required);
  description: FormControl = new FormControl('', Validators.required);
  messageAssignation: FormControl = new FormControl(null);

  createDocumentForm = new FormGroup(
    {
      nom: this.nom,
      description: this.description,
      messageAssignation: this.messageAssignation
    }
  )

  /**
  * Met à jour le formulaire avec les informations du documents importé
  */
  updateValueForm() {
    if (!this.originalDoc) {
      this.createDocumentForm.patchValue({
        nom: this.newDoc?.getName(),
      });
    } else {
      this.createDocumentForm.patchValue({
        nom: this.originalDoc?.getName(),
        description: this.originalDoc?.getDescription()
      });
    }
  }



  /**
  * Initialisation :
  * -Récupération des membres du groupe
  * -Récupération du document existant (si c'est une modification)
  * -Récupération des rôles du groupe
  */
  ngOnInit(): void {
    this.getUser();
    this.createDocumentForm.disable();
    //Récupérer les roles du groupe
    const idGroupe = this._route.snapshot.paramMap.get('id');
    if (idGroupe) {
      this.getRolesOfGroupe();
    }
    //Récupérer les membres du groupe
    this.getMembersOfGroupe();

    //Récupérer le document existant (dans le cas d'une modification)
    const idParam = this._route.snapshot.paramMap.get('idDoc');
    if (idParam) {//Modification
      this.getDocument(parseInt(idParam));
      this.buttonSubmit = "Modifier"
      this.buttonImport = "Sélectionner un autre fichier"
    } else { //Création
      this.isNewDoc = true;
      this.buttonSubmit = "Créer"
    }
  }

  /**
   * currentDoc est initialisé avec le document déjà existant
   * pour la modification à l'aide de l'id en paramètre
   * @param idDoc
   */
  getDocument(idDoc: number) {
    this.isLoading = true;
    this.documentService.getDocument(idDoc).subscribe({
      next: (document) => {
        this.originalDoc = document;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du document :', err);
      },
      //Lorsque le document est récupérer: adapté l'affichage
      complete: () => {
        this.isLoading = false;
        this.createDocumentForm.enable();
        this.buttonSubmit = "Modifier"
        this.title = "Modifier le document " + this.newDoc?.getName() + " du groupe " + this.currentGroupe?.roomName;
        this.updateValueForm();
      }
    })
  }

  /**
  * Récupérer les roles du groupe
  * @returns
  */
  getRolesOfGroupe() {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this.groupeService.getRolesOfGroupe(groupeId).pipe(first()).subscribe(roles => {
      this.rolesGroupe = roles;
    });
  }


  /**
   * Récupérer l'utilisateur courrant
   * @returns
   */
  getUser() {
    this._userService.getUser()
      .pipe(
        first(),
        tap(user => console.log("User récupéré :", user))
      )
      .subscribe(user => {
        this.currentUser = user;
        console.log("User ID :", this.currentUser?.getId);
      });
  }

  getUserById(id: number){
    this._userService.getUserById(id).subscribe(user => {
      this.userAssigned = user;
      console.log("User ID :", this.currentUser?.getId);
    });
  }

  /**
   * Récupérer les membres du groupe
   */
  getMembersOfGroupe(): void {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this.groupeService.getGroup(groupeId).pipe(first())
      .subscribe(group => {
        this.currentGroupe = group;
        this.membersGroupe = group.getUsers();
      });
  }

  /**
   * Vérification de la validité des champs du formulaire
   * @returns
   */
  isFieldsValid(): boolean {
    return this.createDocumentForm.valid;
  }

  /**
 * Gestion de la selection du type de document à partir du selecteur
 * @param event
 */
  onSelectType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'default') {
      this.selectedType = null;
    } else {
      const type = selectedValue as DocumentEnumType;
      this.selectedType = type;

      if (this.newDoc) {
        this.newDoc.setType(type);
      } else {
        this.originalDoc?.setType(type);
      }
    }
  }

  handleAssignmentCreated(newAssignment: Assignement) {
    console.log('Nouvelle assignation créée :', newAssignment);
    this.newAssignement = newAssignment;
    this.getUserById(this.newAssignement.getRecipientId());
  }


  /**
   * Ajouter ou enlever les éléments sélectionner avec les checkboxes
   * @param type
   * @param event
   */
  onCheckboxChange(type: Role | User, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (type instanceof Role) {
        this.selectedRoles.push(type);
      } else {
        this.selectedMembers.push(type);
      }
    } else {
      if (type instanceof Role) {
        this.selectedRoles = this.selectedRoles.filter(t => t !== type);
      } else if (type instanceof User) {
        this.selectedMembers = this.selectedMembers.filter(t => t !== type);
      }
    }
  }

  /************************ Fenêtre assignement **************************************/
  openAssignementForm(){
    console.log(this.isAformOpen)
    if(!this.isAformOpen){
      this.isAformOpen = true
      console.log(this.isAformOpen)

    }
  }

  closeAssignementForm(){
    this.isAformOpen = false
  }

  /************************ Gestion de l'import du document **************************/

  /**
   * Ouvrir le répertoir afin que l'utilisateur puisse importer un fichier
   */
  openFileSelector() {
    this.fileInput.nativeElement.click();
  }



  /**
   * Importer le document qui a été sélectionner dans le sélecteur
   * @param event
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        console.error('Seuls les fichiers PDF sont autorisés.');
        input.value = '';
        return;
      }

      this.file = input.files;
      if (this.originalDoc == undefined) {
        this.createDocumentObject();
      } else {
        this.modifiedDocumentObject();
      }
    } else {
      console.error('Erreur lors du dépôt du document');
    }
  }

  deleteCurrentFile(){
    if (this.isNewDoc) {
      this.newDoc= undefined
    }else{
      this.currentDoc = undefined
    }
  }


  onFileDropped(files: FileList) {
    this.file = files;
    if (this.isNewDoc) {
      this.createDocumentObject();
    } else {
      this.modifiedDocumentObject();
    }
  }

  modifiedDocumentObject() {
    if (this.file.length > 0) {
      let room_id = this.currentGroupe ? this.currentGroupe.getid() : 0;
      const file = this.file[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.isLoading = true;
        const content = event.target.result;
        this.currentDoc = new Document(
          this.originalDoc ? this.originalDoc.getId() : 1,
          this.originalDoc ? this.originalDoc.getRoomId() : room_id,
          this.originalDoc ? this.originalDoc.getVersion() : 1,
          this.originalDoc ? this.originalDoc.getOriginalId() : 0,
          file.name,
          "",
          new Date().toISOString(),// Pas de changement de date création
          new Date().toISOString(),
          this.currentUser ? this.currentUser.getId : 0,
          content,
          this.originalDoc ? this.originalDoc.getType() : DocumentEnumType.DEFAULT,
        );
        //Ne pas modifier les valeurs du formulaire si c'est une modification de document
        if (!this.originalDoc) {
          this.updateValueForm();
        }
        this.buttonImport= "Sélectionner un autre fichier"
        this.isLoading = false;
        this.createDocumentForm.enable();
      };
      reader.readAsArrayBuffer(file); //Lire le fichier en tant qu'ArrayBuffer
    }
  }


  createDocumentObject() {
    if (this.file.length > 0) {
      let room_id = this.currentGroupe ? this.currentGroupe.getid() : 0;
      const file = this.file[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.isLoading = true;
        const content = event.target.result;
        this.newDoc = new CreateDocumentDTO(
          this.newDoc ? this.newDoc.getRoomId() : room_id,
          file.name,
          "",
          new Date().toISOString(),
          this.currentUser ? this.currentUser.getId : 0,
          content,
          DocumentEnumType.DEFAULT
                );
        //Ne pas modifier les valeurs du formulaire si c'est une modification de document
        if (!this.originalDoc) {
          this.updateValueForm();
        }
        this.buttonImport= "Sélectionner un autre fichier"
        this.isLoading = false;
        this.createDocumentForm.enable();
      };
      reader.readAsArrayBuffer(file); //Lire le fichier en tant qu'ArrayBuffer
    }
  }


  /**
   * Lors du clic sur le bouton submit 'créer'/'modifier'
   * TODO: Gérer quand c'est une modification ou un ajout
   */
  onSubmit(): void {
    const doc = this.isNewDoc ? this.newDoc : this.currentDoc ?? this.originalDoc;

    if (doc) {
      doc.setName(this.createDocumentForm.get('nom')?.value);
      doc.setDescription(this.createDocumentForm.get('description')?.value);

      if (!this.isNewDoc && (this.currentDoc || this.originalDoc)) {
        (this.currentDoc ?? this.originalDoc)?.setDateModif(new Date().toISOString());
      }

      this.uploadFile(doc);
    }
  }



  /**
   * Utiliser documentService pour envoyer le document vers SpringBoot
   */
  uploadFile(document: Document | CreateDocumentDTO) {
    document.setAuthor(this.currentUser ? this.currentUser.getId : 0)
    let assignement = undefined;

    if (this.newAssignement) {
       assignement = this.newAssignement
    }
    this.isLoading = true;
    if (document instanceof CreateDocumentDTO) {
      this.documentService.createDocument(document, assignement).subscribe({

        error: (error) => {
          this.isLoading = false;
          console.error('Erreur :', error);
        },
        complete: () => {
          this.isLoading = false;
          console.log("Document enregistré avec succès")
          this.location.back()
        }
      });
    } else {
      if(!this.currentDoc){
        document.setContent(this.base64ToArrayBuffer(document.getContent().toString()))
      }
      this.documentService.modifiedDocument(document, assignement).subscribe({

        error: (error) => {
          this.isLoading = false;
          console.error('Erreur :', error);
        },
        complete: () => {
          this.isLoading = false;
          console.log("Document enregistré avec succès")
          this.location.back()
        }
      });
    }
  }



  /**
   * Lorsqu'on modifie un document, le content est en base64
   * et non pas un Arraybuffer
   * @param base64
   * @returns
   */
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }


  /*****************************Gestion de la pop-up*************************** */
  /**
 * Ouvre la fenêtre pop-up du document en paramètre
 * @param arme
 */
  openDisplay(document: any, title: string): void {
    this.displayedDocument = document;
    this.displayedTitle = title;
  }

  /**
 * Ferme la fenêtre pop-up
 */
  closeDisplay(): void {
    this.displayedDocument = null;
    this.displayedTitle = '';
  }
}
