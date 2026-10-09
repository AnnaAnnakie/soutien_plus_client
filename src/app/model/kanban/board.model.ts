import { Colonne } from './colonne';

export class Board {

  private _name: string;
  private _colonnes: Colonne[];

  constructor(name: string,columns: Colonne[]) {
    this._name = name;
    this._colonnes = columns;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get colonnes(): Colonne[] {
    return this._colonnes;
  }

  set colonnes(value: Colonne[]) {
    this._colonnes = value;
  }
}
