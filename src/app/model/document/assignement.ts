/**
 * Classe Assignement 
 */
export class Assignement {
  private id: number | null;
  private document_id: number |null;
  private recipient_id: number;
  private status: string;
  private message: string;
  private action: string;
  private created_at: string;
  private date_limit: string;

  constructor(
    id: number | null,
    document_id: number | null,
    recipient_id: number,
    status: string,
    message: string,
    action: string,
    created_at: string,
    date_limit: string
  ) {
    this.id = id;
    this.document_id = document_id;
    this.recipient_id = recipient_id;
    this.status = status;
    this.message = message;
    this.action = action;
    this.created_at = created_at;
    this.date_limit= date_limit;
  }
  getDateLimit(): string{
    return this.date_limit;
  }
  // Getters and setters
  getId(): number | null {
    return this.id;
  }

  setId(id: number | null): void {
    this.id = id;
  }

  getDocId(): number | null{
    return this.document_id;
  }

  setDocId(doc_id: number): void {
    this.document_id = doc_id;
  }

  getRecipientId(): number {
    return this.recipient_id;
  }

  setRecipientId(recipient_id: number): void {
    this.recipient_id = recipient_id;
  }

  getStatus(): string {
    return this.status;
  }

  setStatus(status: string): void {
    this.status = status;
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getAction(): string {
    return this.action;
  }

  setAction(action: string): void {
    this.action = action;
  }

  getCreatedAt(): string {
    return this.created_at;
  }

  setCreatedAt(created_at: string): void {
    this.created_at = created_at;
  }

}
