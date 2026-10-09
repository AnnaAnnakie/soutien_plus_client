import {id} from 'date-fns/locale';

export class Contact {

  private _id: number;
  private _id_groupe: number;
  private _nom: string;
  private _prenom: string;
  private _metier: string;
  private _email: string;
  private _telephone: string;

  constructor(
    id: number,
    id_groupe: number,
    nom: string,
    prenom: string,
    metier: string,
    email: string,
    telephone: string
  ) {
    this._id = id;
    this._id_groupe = id_groupe;
    this._nom = nom;
    this._prenom = prenom;
    this._metier = metier;
    this._email = email;
    this._telephone = telephone;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get id_groupe(): number {
    return this._id_groupe;
  }

  set id_groupe(value: number) {
    this._id_groupe = value;
  }

  get nom(): string {
    return this._nom;
  }

  set nom(value: string) {
    this._nom = value;
  }

  get prenom(): string {
    return this._prenom;
  }

  set prenom(value: string) {
    this._prenom = value;
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

  get telephone(): string {
    return this._telephone;
  }

  set telephone(value: string) {
    this._telephone = value;
  }

  toJSON(): any {
    return {
      id: this._id,
      id_groupe: this._id_groupe,
      nom: this._nom,
      prenom: this._prenom,
      metier: this._metier,
      email: this._email,
      telephone: this._telephone
    }
  }
}
