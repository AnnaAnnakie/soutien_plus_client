import {Tache} from './tache';

export class Colonne {
  private _id: number;
  private _name: string;
  private _odre: number;
  private _taches: Tache[]

  constructor(id: number, name: string, odre: number, taches: Tache[]) {
    this._id = id;
    this._name = name;
    this._odre = odre;
    this._taches = taches;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get odre(): number {
    return this._odre;
  }

  set odre(value: number) {
    this._odre = value;
  }

  get taches(): Tache[] {
    return this._taches;
  }

  set taches(value: Tache[]) {
    this._taches = value;
  }
}
