import {Routes} from '@angular/router';
import {ConnexionComponent} from "./components/connexion/connexion.component";
import {FooterComponent} from './components/footer/footer.component';
import {GroupeComponent} from './components/groupe/groupe.component';
import {GroupesComponent} from './components/groupes/groupes.component';
import {HeaderComponent} from './components/header/header.component';
import {InscriptionComponent} from './components/inscription/inscription.component';
import {ParametreComponent} from './components/parametre/parametre.component';
import {ProfilSeniorComponent} from './components/profil-senior/profil-senior.component';
import {VitrineComponent} from './components/vitrine/vitrine.component';
import {CalendrierComponent} from './components/calendrier/calendrier.component';
import {ContactsComponent} from './components/contacts/contacts.component';
import {KanbanComponent} from './components/kanban/kanban.component';
import {MembresComponent} from './components/membres/membres.component';
import {AsideBarComponent} from './components/aside-bar/aside-bar.component';
import {AuthGuardCanActivate} from './guards/AuthActivate/auth.guard';
import {NewGroupComponent} from './components/new-group/new-group.component';
import {DocumentDetailComponent} from './components/document/document-detail/document-detail.component';
import {UploadComponent} from './components/document/upload/upload.component';
import {AuthGuardDeactivate} from './guards/AuthDeactivate/auth.guard';
import {RolesComponent} from './components/roles/roles.component';
import {DocumentsComponent} from './components/document/documents/documents.component';
import {JoinGroupComponent} from './components/joinGroup/join-group/join-group.component';
import {MessagerieComponent} from './components/messagerie/messagerie.component';
import {NotificationComponent} from './components/notification/notification.component';
import {ErrorsComponent} from './components/errors/errors.component';
import {RgpdComponent} from './components/rgpd/rgpd.component';

export const routes: Routes = [
  {path: '', redirectTo: '/accueil', pathMatch: 'full'},
  {path: 'connexion', component: ConnexionComponent},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'dashboard', component: HeaderComponent},
  {path: 'footer', component: FooterComponent},
  {path: 'accueil', component: VitrineComponent},
  {path: 'groupes', component: GroupesComponent, canActivate: [AuthGuardCanActivate]},
  {path: 'groupe/:id', component: GroupeComponent},
  {path: 'parametre', component: ParametreComponent, canActivate: [AuthGuardCanActivate]},
  {path: 'groupe/:id/profil-s', component: ProfilSeniorComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'groupe/:id/calendrier', component: CalendrierComponent},
  {path: 'groupe/:id/contacts', component: ContactsComponent},
  {path: 'groupe/:id/kanban', component: KanbanComponent},
  {path: 'groupe/:id/membres', component: MembresComponent},
  {path: 'groupe/:id/messagerie', component: MessagerieComponent},
  {path: 'aside-bar', component: AsideBarComponent},
  {path: 'new-group', component: NewGroupComponent},
  {path: 'groupe/:id/documents', component: DocumentsComponent},
  {path: 'groupe/:id/document/importer', component: UploadComponent},
  {path: 'groupe/:id/document/:idDoc/modifier', component: UploadComponent},
  {path: 'groupe/:id/documents/:idDoc/version', component: DocumentsComponent},
  {path: 'groupe/:id/document/:idDoc', component: DocumentDetailComponent},
  {path: 'groupe/:id/roles', component: RolesComponent},
  {path: 'notification', component: NotificationComponent},
  {path: 'invitation', component: JoinGroupComponent},
  {path: 'rgpd', component: RgpdComponent},
  {path: 'errors/:id', component: ErrorsComponent},
];
