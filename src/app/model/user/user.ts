import {Groupe} from '../groupe/groupe';
import {id} from 'date-fns/locale';

export class User {

  id: number;
  name: string;
  second_name: string;
  private _email: string;
  private _telephone: string;
  private _metier: string;
  groupes: [];

  constructor(id: number, name: string, second_name: string, email: string, telephone:string,metier:string,groupes: []) {
    this.id = id;
    this.name = name;
    this.second_name = second_name;
    this._email = email;
    this.groupes = groupes;
    this._telephone = telephone;
    this._metier = metier;
  }


  get telephone(): string {
    return this._telephone;
  }

  set telephone(value: string) {
    this._telephone = value;
  }

  get metier(): string {
    return this._metier;
  }

  set metier(value: string) {
    this._metier = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get getId(): number{
    return this.id;
  }

  public getGroup(): [] {
    return this.groupes;
  }

  public getEmail(): string {
    return this._email;
  }

  public getName(): string {
    return this.name;
  }

  public getSecondName(): string {
    return this.second_name;
  }

  public getFullName(): string {
    return this.name+" "+this.second_name;
  }

}
