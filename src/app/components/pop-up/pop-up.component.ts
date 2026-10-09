import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [NgIf],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent {
  @Input() message?: string;
  @Input() buttonNeg?: string;
  @Input() buttonPos?: string;

  @Output() confirmDeletion: EventEmitter<boolean> = new EventEmitter();

  @Output() cancelPopUp: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  /**
   * Émet un événement confirmant la suppression
   */
  onConfirm(): void {
    this.confirmDeletion.emit();
  }
  
  /**
   * Émet un événement pour annuler la suppression
   */
  onCancel(): void {
    this.cancelPopUp.emit(); 
  }
}
