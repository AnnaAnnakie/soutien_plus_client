export class Calendar {
  id: number | null;
  title: string;
  start_date: string| null;
  end_date: string| null;
  type: string;
  groupId: number;

  constructor(
    id: number | null,
    title: string,
    startDate: string| null,
    endDate: string| null,
    type: string,
    groupId: number
  ) {
    this.id = id;
    this.title = title;
    this.start_date = startDate;
    this.end_date = endDate;
    this.type = type;
    this.groupId = groupId;
  }

  // Getters
  public getId(): number | null {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getStartDate(): string| null {
    return this.start_date;
  }

  public geteEndDate(): string| null {
    return this.end_date;
  }

  public getType(): string {
    return this.type;
  }

  public getGroupId(): number {
    return this.groupId;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public setType(type: string): void {
    this.type = type;
  }

}
