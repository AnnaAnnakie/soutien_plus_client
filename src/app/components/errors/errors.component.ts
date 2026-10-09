import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss'
})
export class ErrorsComponent {
  constructor(private route: ActivatedRoute) {
  }

  getTypeError(){
    return (this.route.snapshot.paramMap.get('id'));
  }
}
