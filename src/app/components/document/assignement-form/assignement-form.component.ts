import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentEnumType } from '../../../model/document/document.type';
import { User } from '../../../model/user/user';
import { DocumentEnumEtats } from '../../../model/document/document.etats';
import { NgFor } from '@angular/common';
import { Document } from '../../../model/document/document';
import { Assignement } from '../../../model/document/assignement';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-assignement-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  templateUrl: './assignement-form.component.html',
  styleUrl: './assignement-form.component.scss'
})
export class AssignementFormComponent {
  @Input() originalDoc: Document | undefined;
  @Input() membersGroupe : User [] = []
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() assignmentCreated = new EventEmitter<Assignement>();

  typeAssignement : string | null = null;
  actionAssignement : string = "";
  assignement : Assignement | undefined;
  userAssignement : number | null = null;
  dateAssignement : string | null= null;
  datePart: string = '';
timePart: string = '';
  //Récupération de données
  documentEtats = Object.values(DocumentEnumEtats)

 /*****************Formulaire************************/

  messageAssignation: FormControl = new FormControl(null);

  AssignementForm = new FormGroup(
    {
      messageAssignation: this.messageAssignation
    }
  )


   /**
   * Gestion de la selection du type de document à partir du selecteur
   * @param event 
   */
    onSelectType(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      const selectedValue = selectElement.value;
  
      if (selectedValue === 'default') {
        this.typeAssignement =  null;
      } else {
        const type = selectedValue as DocumentEnumType;  
        this.typeAssignement = type;
      }
    }
  
      /**
   * Gestion de la selection de l'état de document à partir du selecteur
   * @param event 
   */
      onSelectEtat(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const selectedValue = selectElement.value;
    
        if (selectedValue === 'default') {
          this.actionAssignement = "";
        } else {
          const action = selectedValue as DocumentEnumType;
          this.actionAssignement = action
        }
      }


  /**
   * Gestion de la selection de l'utilisateur assigné à partir du selecteur
   * @param event 
   */
  onSelectUser(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    console.log(selectedValue)
      if (selectedValue !== 'personne') {
        const userId = parseInt(selectedValue);
        this.userAssignement = userId;
      }
    }

    onSelectDate(event: any): void {
      this.datePart = event.target.value; // Format "YYYY-MM-DD"
      this.updateDateAssignement();
    }
    
    onSelectTime(event: any): void {
      this.timePart = event.target.value; // Format "HH:mm"
      this.updateDateAssignement();
    }
    
    updateDateAssignement(): void {
      if (this.datePart && this.timePart) {
        const [year, month, day] = this.datePart.split('-'); // Séparation YYYY-MM-DD
        this.dateAssignement = `${day}/${month}/${year} ${this.timePart}`;
      }
    }
    
 /**
 * Émet un événement pour fermer la fenêtre pop-up
 */
  onCancel(): void {
    this.close.emit(false);
  }

  onSave(): void {
    if(this.userAssignement){
          this.assignement = new Assignement(null,this.originalDoc? this.originalDoc.getId() : null, this.userAssignement, "non vu",
      this.messageAssignation.value, this.actionAssignement, new Date().toISOString(), this.dateAssignement? this.dateAssignement : new Date().toISOString());
      this.assignmentCreated.emit(this.assignement);
      this.close.emit(false);
    }
  }

}
