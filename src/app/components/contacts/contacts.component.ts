import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsideBarComponent } from '../aside-bar/aside-bar.component';
import { PermissionService } from '../../services/permissions/permission.service';
import { Permission } from '../../model/permission/permission';
import { ActivatedRoute } from '@angular/router';
import {ContactService} from '../../services/contact/contact.service';
import {Contact} from '../../model/contact/contact';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, AsideBarComponent, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  showPopup: boolean = false;
  newContact = { nom: '', prenom: '', metier: '', email: '', telephone: '' };

  constructor(private _route: ActivatedRoute, private _permissionService: PermissionService, private _contactService: ContactService) {
    this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.loadContacts();
    this.getPermissions();
  }

  loadContacts() {
    this._contactService.getContacts(this.groupeId).subscribe({
      next: (contacts) => (this.contacts = contacts),
      error: (err) => console.error('Erreur lors du chargement des contacts', err)
    });
  }

  saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
    if (!this.showPopup) {
      this.newContact = { nom: '', prenom: '', metier: '', email: '', telephone: ''}; // Reset des champs
    }
  }


  deleteContact(contact: Contact) {
    if (this.hasPermission('contact_delete')) {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?');
      if (confirmed) {
        this._contactService.deleteContact(this.groupeId, contact.id).subscribe({
          next: () => {
            this.contacts = this.contacts.filter(c => c.id !== contact.id);
          },
          error: (err) => console.error('Erreur lors de la suppression du contact', err)
        });
      }
    }
  }
  confirmAddContact() {
    if (this.hasPermission('contact_add')) {
      if (Object.values(this.newContact).every((val) => val.trim() !== '')) {
        const contactToAdd = new Contact(this.contacts.length + 1, this.groupeId, this.newContact.nom, this.newContact.prenom, this.newContact.metier, this.newContact.email, this.newContact.telephone);
        this._contactService.addContact(this.groupeId, contactToAdd).subscribe({
          next: (contact) => {
            this.contacts.push(contact);
            this.togglePopup();
          },
          error: (err) => console.error('Erreur lors de l\'ajout du contact', err)
        });
      } else {
        alert('Veuillez remplir tous les champs.');
      }
    }
  }

  groupeId: number = 0;
  permissions: Permission[] = [];

  getPermissions() {
    this._permissionService.getPermissionOfUsers(this.groupeId).subscribe(permissions => {
      this.permissions = permissions;
      console.log(this.permissions);
    });
  }

  hasPermission(permission: string): boolean {
    const activePermission = this.permissions.some(p => p.permission === '*' || p.permission === permission);
    if (!activePermission) {
      alert("Vous n'avez pas les permissions nécessaires pour effectuer cette action");
    }
    return activePermission;
  }
}
