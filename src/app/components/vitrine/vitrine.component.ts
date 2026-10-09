import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgIf, ViewportScroller} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './vitrine.component.html',
  styleUrl: './vitrine.component.scss'
})
export class VitrineComponent {

  isConnected:boolean = false;
  constructor(private _router: Router, private _route: ActivatedRoute, private viewportScroller: ViewportScroller, private authService: AuthService) {}

  scrollToSection(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  verifyConnection():Observable<boolean>{
    return this.authService.isConnected();
  }

  ngOnInit(){
    this.verifyConnection().subscribe(b => {
      this.isConnected = b;
    })
  }
}
