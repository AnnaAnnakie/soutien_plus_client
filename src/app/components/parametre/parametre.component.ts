import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss'],
  standalone : true,
  imports: [CommonModule, FormsModule],  // Ajoute FormsModule dans la propriété 'imports' ici

})
export class ParametreComponent implements OnInit {
  // Attributs locaux pour afficher les infos utilisateur
  nom: string = ''; // Valeur par défaut
  prenom: string = ''; // Valeur par défaut
  email: string = ''; // Valeur par défaut
  numtel: string = ''; // Valeur par défaut
  imgpp: string = ''; // Image par défaut
  role: string = '';

  // Propriété pour savoir si les champs sont en mode édition
  isEditable: boolean = false;

  constructor(private _userService: UserService,private _router: Router) {}

  ngOnInit(): void {
    this.getUser();
  }

  // Méthode pour récupérer les informations utilisateur
  getUser(): void {
    this._userService.getUser().subscribe(user => {
      this.nom = user.name;
      this.prenom = user.second_name;
      this.email = user.email;
      this.numtel = user.telephone;
      console.log(user)
    })
  }

  // Méthode pour déconnecter l'utilisateur
  disconnection(): void {
    localStorage.removeItem("auth_token"); // Suppression du token d'authentification
    this._router.navigate(['/connexion']); // Redirection vers la page de connexion
  }

  togglePopUp (): void {

    this.isEditable = !this.isEditable; // Bascule entre mode édition et mode lecture
  }

  saveSettings(): void {
    this.togglePopUp();

  }

  cancelSaveSettings(): void{

  }


}
