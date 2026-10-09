import {Permission} from '../permission/permission';

export class Role {

  private _id: number;
  private _name: string;
  private _description: string;
  private _permissions: Permission[];
  private _base: boolean;

  constructor(id: number, name: string, description: string, permissions: Permission[], base: boolean) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._base = base;
    this._permissions = permissions;
  }


  get id(): number {
    return this._id;
  }

  get base(): boolean {
    return this._base;
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

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }

  set permissions(value: []) {
    this._permissions = value;
  }
}
