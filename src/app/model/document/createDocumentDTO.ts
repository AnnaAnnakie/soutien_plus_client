import { DocumentEnumType } from "./document.type";
/**
 * Classe CreateDocumentDTO 
 */
export class CreateDocumentDTO {
  private name: string; 
  private room_id : number; 
  private author: number;
  private description: string;
  private content: ArrayBuffer;
  private date_creation: string; 
  private type: DocumentEnumType;
  private assignTo : number |undefined;

  constructor(room_id: number, name: string, description:string, date_creation: string, author: number, content: ArrayBuffer, type: DocumentEnumType) {
    this.room_id= room_id;
    this.name = name;
    this.description= description;
    this.date_creation = this.formatDate(date_creation);
    this.author = author;
    this.content = content;
    this.type = type;
  }


  getName(): string {
    return this.name;
  }
  setName(name: string){
    this.name = name;
  }

  getRoomId(): number{
    return this.room_id;
  }

  setRoomId(id: number){
    this.room_id = id;
  }

  setAssignTo(userId : number | undefined){
    this.assignTo= userId;
  }

  getAssignTo(): number | undefined{
    return this.assignTo;
  }

  getDescription(): string{
    return this.description;
  }

  setDescription(description : string){
    this.description= description;
  }




  getDateCreation(): string {
    return this.date_creation;
  }

  getAuthor(): number {
    return this.author;
  }

  setAuthor(name: number){
    this.author= name;
  }
  getContent(): ArrayBuffer {
    return this.content;
  }

  setContent(content : ArrayBuffer): void {
    this.content= content;
  }

  getType(): DocumentEnumType {
    return this.type;
  }

  setType(type: DocumentEnumType): void {
    this.type = type; 
  }

  generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomPart}`;
  }
  
  initDate(dateString: string): string {
    let resDate = this.formatDate(dateString)
    resDate = this.isTodayDate(resDate)
    return resDate;
  }

  formatDate(dateString: string): string {  
    // Vérification si la date est déjà au bon format
    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
    if (regex.test(dateString)) {
      return dateString;
    }
  
    // Si la date n'est pas au bon format
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  

 isTodayDate(dateString: string): string {
  const formattedDate = this.formatDate(dateString);
  const date = new Date(dateString);

  // Obtenir la date d'aujourd'hui
  const today = new Date();
  const isToday = 
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return formattedDate;
}
}
