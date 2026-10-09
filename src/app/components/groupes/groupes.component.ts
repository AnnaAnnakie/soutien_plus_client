import { Component } from '@angular/core';
import { NgFor,NgIf } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {PopUpInscriptionComponent} from '../pop-up-inscription/pop-up.component';
import {UserService} from '../../services/user/user.service';
import {User} from '../../model/user/user'
import {catchError, first, map, Observable, of} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {GroupService} from '../../services/group/group.service';
import {group} from '@angular/animations';

@Component({
  selector: 'app-groupes',
  standalone: true,
  imports: [NgFor,NgIf,HttpClientModule,FormsModule],
  providers: [UserService],
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.scss']
})
export class GroupesComponent {


  user: User = new User(-1, "","","","","" ,[]);
  showPopup = false;
  code = '';
  activePopupId: number | null = null;
  searchQuery = '';
  filteredGroupes: any[] = [];


  constructor(private _userService: UserService, private dialog: MatDialog, private _router: Router,private _groupService: GroupService) {}

  ngOnInit(): void {
    const pendingGroupCode = Number(localStorage.getItem('pendingGroupCode'));
    if(pendingGroupCode) {
      this._groupService.joinGroup(pendingGroupCode).subscribe(group => {});
      localStorage.removeItem('pendingGroupCode');
    }
    this.getUser();
  }

  getUser(): void {
    this._userService.getUser().subscribe(user => {
      this.user = user;
      this.filteredGroupes = this.user.getGroup();
    });
  }



  isDropdownOpen = false;
  selectedOption = 'Date de création';
  options = ['Nom', 'Date de création', 'Nombre de membres'];

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
    this.sortGroupes(); // Trie les groupes après sélection
  }

  sortGroupes(): void {
    if (this.selectedOption === 'Nom') {
      this.filteredGroupes.sort((a, b) => a.roomName.localeCompare(b.roomName));
      console.log(this.filteredGroupes);
    } else if (this.selectedOption === 'Date de création') {
      this.filteredGroupes.sort((a, b) => a.id - b.id);
      console.log(this.filteredGroupes);
    } else if (this.selectedOption === 'Nombre de membres') {
      this.filteredGroupes.sort((a, b) => b.nbUtilisateurs - a.nbUtilisateurs);
    }
  }

 openDialog(): void {
    this.dialog.open(PopUpInscriptionComponent, {
      data: {
        isGroupes: true
      },
    });
  }

  goToGroupe(id: number): void {
    this._router.navigate(['/groupe/'+id]);
  }

  goToNewGroupe(): void {
    this._router.navigate(['/new-group']);
  }

  onSubmit(): void {
    //this.openDialog();
    this._groupService.joinGroup(Number(this.code)).subscribe(group => {});
    this.togglePopup();

    }


  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  filterGroupes(): void {
    if (this.searchQuery.length < 1) {
      this.filteredGroupes = this.user.getGroup(); // Réinitialise tous les groupes
      return;
    }
    this.filteredGroupes = this.user.getGroup().filter(groupe => {
      const nom = (groupe as any).roomName; // Contourne un éventuel problème de prototype
      return nom?.toLowerCase().includes(this.searchQuery.toLowerCase());
    });

  }
}
