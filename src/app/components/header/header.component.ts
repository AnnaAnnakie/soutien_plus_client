import { Component, inject } from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgIf} from '@angular/common';
import { first, tap, switchMap, interval } from 'rxjs';
import { User } from '../../model/user/user';
import { DocumentService } from '../../services/document/document.service';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from "../notification/notification.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf,
    RouterLink, NotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser : User | undefined;
  countNotif : number =0;
  isNotifOpen : boolean = false;

  private documentService: DocumentService = inject(DocumentService)
  private userService: UserService = inject(UserService)

  ngOnInit(): void {
    //this.getUserAndStartPolling();
  }

  /**
   * Récupérer l'utilisateur courant et démarrer la récupération du nombre de notifications
   */
  getUserAndStartPolling() {
    this.userService.getUser()
      .pipe(
        first(), // On récupère l'utilisateur une seule fois
        tap(user => {
          this.currentUser = user;
          console.log("User récupéré :", user);
        }),
        switchMap(user => {
          return interval(2000).pipe(
            switchMap(() => this.documentService.getCountNotificationAssignements(user?.getId))
          );
        })
      )
      .subscribe(count => {
        this.countNotif = count;
      });
  }

  onClickNotif(){
    if(this.isNotifOpen){
      this.isNotifOpen = false
    }else{
      this.isNotifOpen = true;
    }
  }

  closeNotif(){
    this.isNotifOpen = false;
  }
  
}
