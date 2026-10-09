export class Tache {
  constructor(
    public id: number,
    public titre: string,
    public description: string,
    public responsableId: number,
    public type: string,
    public idDocument: number | null,
    public date: string,
    public isInCalendrier: boolean,
    public idPersonneAssignee: number | null,
    public idRoleAssignee: number | null
  ) {}
}
