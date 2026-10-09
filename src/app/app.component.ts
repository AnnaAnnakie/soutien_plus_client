import { Component, inject } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import { DocumentService } from './services/document/document.service';
import { UserService } from './services/user/user.service';
import { first, interval, switchMap, tap } from 'rxjs';
import { User } from './model/user/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ RouterOutlet,
    MatDialogModule, FooterComponent, HeaderComponent],

})

export class AppComponent {
  title = 'soutien-plus-angular-client';
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
