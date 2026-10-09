import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Assignement } from '../../model/document/assignement';
import { DocumentService } from '../../services/document/document.service';
import { User } from '../../model/user/user';
import { UserService } from '../../services/user/user.service';
import { catchError, concatMap, first, forkJoin, from, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { NotificationAssignement } from '../../model/document/notificationAssignement';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() menuPosition!: { top: number; left: number };
  @Output() closeNotif = new EventEmitter<void>(); // Événement pour fermer le menu
    
  notificationsAssignement: NotificationAssignement[] = [];
  currentUser: User | undefined;
  assignations: any[] = [];
  documents : Document[]= [];
  isLoading : boolean = true;

  private documentService: DocumentService = inject(DocumentService)
  private userService: UserService = inject(UserService)
    constructor(private _router: Router, private _route: ActivatedRoute) { }
  
    ngOnInit(): void {
      this.getUser(); // Appeler getUser() pour récupérer l'utilisateur
    }
    
    /**
     * Récupérer l'utilisateur courant
     * @returns 
     */
    getUser() {
      this.userService.getUser()
        .pipe(
          first(),
          tap(user => console.log("User récupéré :", user)) // Afficher l'utilisateur pour le débogage
        )
        .subscribe(user => {
          this.currentUser = user;
          const userId = user.getId; // Récupérer l'ID de l'utilisateur
          this.getNotification(userId);
        });
    }
    
    /**
     * Récupérer les notifications d'assignation
     * @param userId L'ID de l'utilisateur
     */
    getNotification(userId: number) {
      this.documentService.getNotificationAssignements(userId).subscribe(notifications => {
        this.notificationsAssignement = notifications;
        this.isLoading = false;
      });
    }

    onSelect(groupeId: number ,docId: number): void {
      this.closeNotif.emit();
      this._router.navigate(['groupe/' + groupeId + '/document', docId]);
    }
    onBackgroundClick(event: Event): void {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('background')) {
        this.onCloseMenu();
      }
    }
    
    onCloseMenu(): void {
      this.closeNotif.emit();
    }
}
