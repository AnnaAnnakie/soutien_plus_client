export class Permission {

  private _id: number;
  private _permission: string;
  private _description: string;

  constructor(id: number, permission: string, description: string) {
    this._id = id;
    this._permission = permission;
    this._description = description;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get permission(): string {
    return this._permission;
  }

  set permission(value: string) {
    this._permission = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
}
