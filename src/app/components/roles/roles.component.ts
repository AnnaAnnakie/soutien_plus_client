import { Component } from '@angular/core';
  import {AsideBarComponent} from "../aside-bar/aside-bar.component";
  import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
  import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
  import {Role} from '../../model/role/role';
  import {RoleService} from '../../services/roles/role.service';
  import {ActivatedRoute, Router} from '@angular/router';
  import {first} from 'rxjs';
  import {GroupService} from '../../services/group/group.service';
  import {User} from '../../model/user/user';
  import {Permission} from '../../model/permission/permission';
  import {PermissionService} from '../../services/permissions/permission.service';
  import {PermissionInterface} from './model/permission';
  import {group} from '@angular/animations';

  @Component({
    selector: 'app-roles',
    standalone: true,
    imports: [
      AsideBarComponent,
      NgForOf,
      NgIf,
      FormsModule,
      ReactiveFormsModule,
      NgClass,
      TitleCasePipe
    ],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.scss'
  })
  export class RolesComponent {
    roles: Role[] = [];
    membres: User[] = []
    selectedRole: Role | null = null;

    selectedPermission = true;
    selectedPersonnes = false;

    visibleGroups: Set<string> = new Set();

    membresOfRoleSelected: User[] = [];
    isPopupVisible: boolean = false;
    isPopupSupprimerVisible : boolean = false;

    permissionsList: PermissionInterface[] = []

    usersAvailable: User[] = []

    isCreatingRole: boolean = false;
    newRole: Role = new Role(-1,'','',[],false)



    constructor(private _permissionService: PermissionService,private _groupeService: GroupService,private _roleService: RoleService, private _router: Router, private _route: ActivatedRoute) {
      this.groupeId = Number(this._route.snapshot.paramMap.get('id'));
    }

    ngOnInit() {
      this.getRoles();
      this.getMembres();
      this.getPermissions();
    }

    getUsersAvailable() {
      const groupeId = Number(this._route.snapshot.paramMap.get('id'));
      let usersAvailable: User[] = []
      if (this.selectedRole != null) {
        this._groupeService.getUtilisateursWithRolesInGroupe(groupeId, this.selectedRole?.id).pipe(first()).subscribe(users => {
          for (let membre of this.membres){
            let isAvailable = true
            for (let user of users){
              if (membre.id == user.id){
                isAvailable = false
              }
            }
            if (isAvailable){
              usersAvailable.push(membre);
            }
          }
        })
        this.usersAvailable = usersAvailable;
      }

    }

    initInput(): void {
      this.permissionsList = []
      this._permissionService.getAllPermission().pipe(first()).subscribe(permissions => {
        for (let perm of permissions) {
          this.permissionsList.push({id: perm.id , permission: perm.permission, description: perm.description, isChecked: this.isChecked(perm)});
        }
        this.moveWildcardPermissionToTop();
        const grouped = this.groupPermissionsByPrefix();

        console.log(grouped);
      });





    }

    isChecked(permission: Permission): boolean {
      if (this.selectedRole == null){
        return false;
      }
      for (let perm of this.selectedRole.permissions) {
        if (perm.id == permission.id) {
          return true;
        }
      }
      return false;
    }

    getMembres(): void {
      const groupeId = Number(this._route.snapshot.paramMap.get('id'));
      this._groupeService.getGroup(groupeId).pipe(first()).subscribe(group => {
        this.membres = group.getUsers();
      })
    }

    getRoles() {
      const groupeId = Number(this._route.snapshot.paramMap.get('id'));
      this._groupeService.getRolesOfGroupe(groupeId).pipe(first()).subscribe(roles => {
        this.roles = roles;
      });
    }


    selectRole(id_role: number): void {
      this.cancelCreateRole();
      this._roleService.getRole(id_role).pipe(first()).subscribe(role => {
        this.selectedRole = role;
        this.getPersonFromRole(id_role);
        this.initInput();

      });
    }

    disableSelectRole():void{
      this.selectedRole = null;
    }

    togglePopup(): void {
      this.getUsersAvailable();
      this.isPopupVisible = !this.isPopupVisible;

    }

    addRoleToPerson(idUser:number): void {
      if(this.hasPermission('role_set_person')){
        const groupeId = Number(this._route.snapshot.paramMap.get('id'));
        if (this.selectedRole != null){
          this._groupeService.setRoleToUserInGroup(groupeId,this.selectedRole.id, idUser).subscribe(a => {
            if (this.selectedRole != null) {
              this.getPersonFromRole(this.selectedRole.id);
            }
          });
        }
        this.togglePopup();
      }
    }


    getPersonFromRole(selectedRoleId: number): void {
      const groupeId = Number(this._route.snapshot.paramMap.get('id'));
      if (!this.selectedRole) {
        this.membresOfRoleSelected = [];
      } else {
        this._groupeService.getUtilisateursWithRolesInGroupe(groupeId, selectedRoleId).pipe(first())
          .subscribe(users => this.membresOfRoleSelected = users)
      }
    }

    trackByFn(index: number, item: any): number {
      return index;
    }

    onSubmit(form: NgForm): void {
      if(this.hasPermission('role_set_permissions')){
        const keysWithTrueValues = Object.keys(form.value).filter(key => form.value[key] === true);

        let numbers = []
        for (let key of keysWithTrueValues) {
          numbers.push(parseInt(key));
        }


        if (this.selectedRole != null) {
          const groupeId = Number(this._route.snapshot.paramMap.get('id'));
          this._roleService.setPermission(this.selectedRole.id, groupeId,numbers).subscribe(a => console.log(a));
        }
      }
    }


    toggleCreateRole(): void {
      if(this.hasPermission('role_create')){
        this.isCreatingRole = !this.isCreatingRole;
        this.selectedRole = null;
        this.newRole.name =  '';
        this.newRole.description =  '';
      }

    }

    createRole(): void {
      const groupeId = Number(this._route.snapshot.paramMap.get('id'));
      console.log(this.newRole.name)
      console.log(this.newRole.description)
      this._roleService.addRoleInGroupe(groupeId, this.newRole.name, this.newRole.description);
      this.toggleCreateRole();
    }

    cancelCreateRole(): void {
      this.isCreatingRole = false;
    }

    moveWildcardPermissionToTop(): void {
      const wildcardPermissionIndex = this.permissionsList.findIndex(
        perm => perm.permission === '*' && perm.description === 'toutes les permissions'
      );

      if (wildcardPermissionIndex !== -1) {
        const wildcardPermission = this.permissionsList.splice(wildcardPermissionIndex, 1)[0];
        this.permissionsList.unshift(wildcardPermission);
      }
    }

    hasWildcardPermissionEnabled(): boolean {
      const wildcardPermission = this.permissionsList.find(
        perm => perm.permission === '*' && perm.description === 'toutes les permissions'
      );
      return wildcardPermission ? wildcardPermission.isChecked : false;
    }

    onWildcardToggle(): void {
      if (this.hasWildcardPermissionEnabled()) {
        // Désactiver toutes les autres permissions
        this.permissionsList.forEach((perm, index) => {
          if (index > 0) perm.isChecked = false;
        });
      }
    }




    switchToPermission():void{
      this.selectedPermission = true;
      this.selectedPersonnes = false;
    }

    switchToPersonnes():void{
      this.selectedPermission = false;
      this.selectedPersonnes = true;
    }

    groupeId: number = 0;
    getPermissions() {
      this._permissionService.getPermissionOfUsers(this.groupeId).subscribe(permissions => {
        this.permissions = permissions;
        console.log(this.permissions);
      });
    }

    permissions: Permission[] = [];
    hasPermission(permission: string): boolean {
      const activePermission = this.permissions.some(p => p.permission === '*' || p.permission === permission);
      if (!activePermission) {
        alert('Vous n\'avez pas les permissions nécessaires pour effectuer cette action');
      }
      return activePermission;
    }

    groupPermissionsByPrefix(): { [key: string]: PermissionInterface[] } {
      const groupedPermissions: { [key: string]: PermissionInterface[] } = {};
      const prefixMap: { [key: string]: string } = {
        'member': 'membre',
        'messaging': 'messagerie',
        'calendar': 'calendrier',
        'task': 'tâche',
        'contact': 'contacte',
        'group': 'groupe'
      };

      this.permissionsList.forEach(permission => {
        const rawPrefix = permission.permission.includes('_')
          ? permission.permission.split('_')[0]
          : 'Toutes les permissions';
        const prefix = prefixMap[rawPrefix] || rawPrefix;

        if (!groupedPermissions[prefix]) {
          groupedPermissions[prefix] = [];
        }
        groupedPermissions[prefix].push(permission);
      });

      return groupedPermissions;
    }

    toggleGroup(group: string): void {
      if (this.visibleGroups.has(group)) {
        this.visibleGroups.delete(group);  // Masquer les permissions
      } else {
        this.visibleGroups.add(group);  // Afficher les permissions
      }
    }


    isGroupVisible(group: string): boolean {
      return this.visibleGroups.has(group);
    }

    supprimerGroup(): void {
      if(this.hasPermission('role_delete')){
        this.isPopupSupprimerVisible = !this.isPopupSupprimerVisible;
      }
    }

    togglePopupSupprimer(){
      this.isPopupSupprimerVisible = !this.isPopupSupprimerVisible;
    }



    protected readonly Object = Object;
    protected readonly group = group;
  }
