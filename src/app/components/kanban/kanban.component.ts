import { Component, OnInit, HostListener } from '@angular/core';
import { first } from 'rxjs/operators';
import { AsideBarComponent } from '../aside-bar/aside-bar.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
  CdkDrag,
  CdkDragHandle
} from '@angular/cdk/drag-drop';

import {CommonModule,NgForOf,NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PermissionService} from '../../services/permissions/permission.service';
import {Permission} from '../../model/permission/permission';
import {ActivatedRoute} from '@angular/router';
import { KanbanService } from '../../services/kanban/kanban.service';
import { GroupService } from '../../services/group/group.service';
import { Colonne } from '../../model/kanban/colonne';
import { Tache } from '../../model/kanban/tache';
import { DocumentService } from '../../services/document/document.service';
import { Document } from '../../model/document/document';


@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    AsideBarComponent,
    CdkDropList,
    NgForOf,
    CdkDrag,
    CdkDragHandle,
    NgIf,
    FormsModule,
    CommonModule
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit {

  id_task = 0;
  members = [];
  documents: Document[] = [];
  colonnes: Colonne[] = [];

  columnIds: string[] = [];
  activePopupId: number | null = null;
  currentColumn: Colonne | null = null;
  activeTask: Tache = new Tache(0, '', '', 0, 'tache', 0, '00-00-0000', false, 0, 0);
  originalTask: any = null;
  showTaskPopup = false;
  showTaskPopupCreate = false;
  taskForm = {title: '',description: '',responsible: '', type: 'medical',  dueDate: '',addToCalendar: false,document: null};
  
  titleError = false;

  hasInteractedWithPopup = false;
  editingColumnId: number | null = null;

  constructor(private readonly _route: ActivatedRoute, private readonly _permissionService: PermissionService, private _kanbanService: KanbanService, private _groupService: GroupService, private _documentService: DocumentService) {
    this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getMembers();
    this.getDocuments();
    this.getColumns();
    this.getPermissions();
  }

  getMembers(): void {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._groupService.getGroup(groupeId).pipe(first())
      .subscribe(group => {
        this.members = group.getUsers();
      });

  }

  getDocuments(): void {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._documentService.getDocuments(groupeId).pipe(first())
      .subscribe(document => {
        this.documents = document;
      });
  }

  getColumns(): void {
    const groupeId = Number(this._route.snapshot.paramMap.get('id'));
    this._kanbanService.getColonnes(groupeId).pipe(first())
      .subscribe(colonne => {
        this.colonnes = colonne;
        console.log(this.colonnes);
      });
  }

  addColumn(): void {
    if(this.hasPermission('kanban_add_column')){
      this._kanbanService.addColonne(this.groupeId, 'New Column', this.colonnes.length+1).pipe(first()).subscribe(
        {
          next: () => {
            this.getColumns();
          }
        }
      );
      this.getColumns();
    }
  }

  addTask(colonne: Colonne): void {
    if (this.hasPermission('task_add')) {
      if (!this.taskForm.title.trim()) {
        this.titleError = true;
        return;
      }
      if (this.taskForm.dueDate == ''){
        this.taskForm.dueDate = "00-00-0000"
      }
      this.activeTask = new Tache(this.id_task, this.taskForm.title, this.taskForm.description, 10, this.taskForm.type, null,this.taskForm.dueDate, this.taskForm.addToCalendar, null, null);
      this._kanbanService.addTache(this.groupeId, colonne.id, this.activeTask).pipe(first()).subscribe(
        {
          next: () => {
            this.getColumns();
          }
        }
      );
      this.taskForm = {title: '',description: '',responsible: '', type: 'medical',  dueDate: '',addToCalendar: false,document: null};
      this.showTaskPopupCreate = false;
      this.originalTask = null;
      this.getColumns();
    }
  }

  OuverturePopupCreate(colonne: Colonne): void {
    this.currentColumn = colonne;
    this.showTaskPopupCreate = true;
  }

  ClosePopupCreate(): void {
    this.showTaskPopupCreate = false;
    this.hasInteractedWithPopup=false;
  }

  modifyTask(tache: Tache): void {
    if(this.hasPermission('task_modify')){
      this._kanbanService.modifyTache(tache.id, tache).pipe(first()).subscribe(
        {
          next: () => {
            this.getColumns();
          }
        }
      );
    }
  }

    // Drag and drop for columns
    dropGrid(event: CdkDragDrop<Colonne[]>): void {
      moveItemInArray(this.colonnes, event.previousIndex, event.currentIndex);
    
      // Mise à jour locale des index
      this.colonnes.forEach((colonne, index) => {
        console.log(colonne.odre);
        colonne.odre = index; 
      });
    }
    

  modifyColumn(colonne: Colonne): void {
    if(this.hasPermission('task_modify')){
      this._kanbanService.modifyColonne(colonne.id, colonne.name, colonne.odre).pipe(first()).subscribe(
        {
          next: () => {
            this.getColumns();
          }
        }
      );
    }
  }

  deleteColumn(colonneId: number): void {
    if(this.hasPermission('kanban_delete_column')){
      this._kanbanService.deleteColonne(colonneId).pipe(first()).subscribe(
        {
          next: () => {
            this.getColumns();
          }
        }
      );
    }
  }

  public togglePopupDot(id: number): void {
    this.activePopupId = this.activePopupId === id ? null : id;
  }

  openTaskPopup(task: Tache) {
    if(this.hasPermission('task_modify')){
      if (this.showTaskPopup) {
        return;
      }
      this.activeTask = { ...task }; 
      this.originalTask = { ...task };
      this.showTaskPopup = true;
    }
  }

  public deleteTask(tacheId: number): void {
    if(this.currentColumn==null){
      if(this.hasPermission('task_delete')){
        this._kanbanService.deleteTache(tacheId).pipe(first()).subscribe(
          {
            next: () => {
              this.getColumns();
            }
          }
        );
      }
    }
    this.closeTaskPopup();
  }

  annulerTask() {
    if (this.originalTask) {
      const colonne = this.colonnes.find(col => col.taches.some(t => t.id === this.originalTask.uniqueId));
      if (colonne) {
        const index = colonne.taches.findIndex(t => t.id === this.originalTask.uniqueId);
        if (index !== -1) {
          console.log('Restauration de la tâche', this.originalTask);
          colonne.taches[index] = this.originalTask; // Restaure l'état initial
        }
      }
    }    
    this.closeTaskPopup();
  }

  saveTask() {
    this.modifyTask(this.activeTask);
    this.closeTaskPopup();
  }

  closeTaskPopup() {
    this.activeTask = new Tache(0, '', '', 0, 'tache', 0, '00-00-0000', false, 0, 0);
    this.showTaskPopup = false;
    this.hasInteractedWithPopup=false;
  }

  // Drag and drop for tasks
  drop(event: CdkDragDrop<Tache[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const isClickInsidePopup = (event.target as HTMLElement).closest('.task-popup');
    if (this.showTaskPopup){ 
      if (this.hasInteractedWithPopup){
        if (!isClickInsidePopup) {
          console.log('Click en dehors de la popup');
          this.closeTaskPopup();
        }
      }else{
        this.hasInteractedWithPopup=true;
      }
    }
    if (this.showTaskPopupCreate){ 
      if (this.hasInteractedWithPopup){
        if (!isClickInsidePopup) {
          this.ClosePopupCreate();
        }
      }else{
        this.hasInteractedWithPopup=true;
      }
    }
  }

  startEditing(columnId: number) {
    if(this.hasPermission('kanban_modify_column')){
      this.editingColumnId = columnId;
    }
  }

  stopEditing(column: any) {
    this.editingColumnId = null;
    this.modifyColumn(column);
  }

  updateColumnName(column: any) {
  }

  groupeId: number = 0;
  getPermissions() {
    this._permissionService.getPermissionOfUsers(this.groupeId).subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  permissions: Permission[] = [];
  hasPermission(permission: string): boolean {
    const activePermission = this.permissions.some(p => p.permission === '*' || p.permission === permission);
    if (!activePermission) {
      alert('Vous n\'avez pas les permissions nécessaires pour effectuer cette action');
    }
    return activePermission;
  }
  
}