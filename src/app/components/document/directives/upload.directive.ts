import { Directive,Output, EventEmitter, HostBinding, HostListener, HostBindingDecorator } from '@angular/core';

@Directive({
  selector: '[appUpload]',
  standalone: true
})
/**
 * Directives lors du drag and drop du fichier
 */
export class UploadDirective {

  @Output() onFileDropped = new EventEmitter<any>();
  @HostBinding('style.background-color') public background = '#fff';
  @HostBinding('style.opacity') public opacity = '1';

  /**Lorsque le fichier est trainé au dessus de l'élément receveur,
   * l'élément receveur change de couleur
   * */
  @HostListener('dragover', ['$event']) onDragOver(evt :any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
  };

  /**Lorsque le fichier est trainé en dehors de l'élément receveur
   * l'élément receveur reviens à ça couleur initial
   * */
  @HostListener('dragleave', ['$event']) public onDragLeave(evt : any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#fff'
    this.opacity = '1'
  }
  
  /**
   * Lorsque le fichier est déposé dans l'élément receveur,
   * Si le fichier est non null, il est envoyé vers upload.components.ts afin de créer le fichier 
   * en tant que documents, sinon rien
   * TODO : Ajouter message d'erreur en cas de problème d'import du document
   * */
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    console.log("drop", evt);
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';

    let files = evt.dataTransfer.files;
  
    if (files) {
      this.onFileDropped.emit(files);
      console.log("Fichier déposé :", files[0]);
    } else {
      console.log("Aucun fichier trouvé lors du dépot.");
    }
  }
  
  constructor() { }

}