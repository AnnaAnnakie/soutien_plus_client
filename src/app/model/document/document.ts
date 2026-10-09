import { DocumentEnumType } from "./document.type";
import { User } from "../user/user";
import { et } from "date-fns/locale";
/**
 * Classe Document 
 */
export class  Document {
  private id: number;
  private name: string; 
  private room_id : number; 
  private original_id: number; 
  private version: number; 
  private author: number;
  private description: string;
  private content: ArrayBuffer;
  private date_creation: string;
  private date_modif: string;
  private type: DocumentEnumType;

  constructor(id: number ,room_id: number, version: number, original_id : number, name: string, description:string, date_creation: string, date_modif: string, author: number, content: ArrayBuffer, type: DocumentEnumType) {
    this.id = id;
    this.room_id= room_id;
    this.original_id = original_id;
    this.version =version;
    this.name = name;
    this.description= description;
    this.date_creation = this.formatDate(date_creation);
    this.date_modif = this.formatDate(date_modif);
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


  getDescription(): string{
    return this.description;
  }

  setDescription(description : string){
    this.description= description;
  }



  getId(): number {
    return this.id;
  }

  getOriginalId(): number{
    return this.original_id;
  }

  setOriginalId(id: number){
    this.original_id = id;
  }

  getVersion(): number{
    return this.version;
  }

  setVersion(version : number){
    this.version= version;
  }

  getDateCreation(): string {
    return this.date_creation;
  }

  getDateModif(): string {
    return this.date_modif;
  }

  setDateModif(new_date : string): void {
    this.date_modif = this.formatDate(new_date);
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
