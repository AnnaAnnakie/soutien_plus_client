import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../../services/group/group.service';

@Component({
  selector: 'app-join-group',
  standalone: true,
  imports: [],
  templateUrl: './join-group.component.html',
  styleUrl: './join-group.component.scss'
})
export class JoinGroupComponent {


  constructor(private _router: Router, private _route: ActivatedRoute, private _groupService: GroupService) {
  }



  ngOnInit() {
    const token = localStorage.getItem('auth_token');
    const groupCode = this._route.snapshot.queryParams['groupCode'];
    if(!token && groupCode) {
      localStorage.setItem('pendingGroupCode', groupCode);
      this._router.navigate(['/connexion']);
    }else{
      this._groupService.joinGroup(Number(groupCode));
      this._router.navigate(['/groupes']);
    }
  }
}
