export class Groupe {

  roomId: number;
  roomName: string;
  securityNumber: number;
  personName: string;
  personSecondName: string;
  description: string;
  codeInvitation: number;
  users: [];

  constructor(roomId: number, roomName: string ,personName: string, personSecondName: string, securityNumber: number, description: string, codeInvitation:number , users: []) {
    this.roomId = roomId;
    this.roomName = roomName;
    this.personName = personName;
    this.personSecondName = personSecondName;
    this.securityNumber = securityNumber;
    this.description = description;
    this.codeInvitation = codeInvitation;
    this.users = users;
    }
    
    getName(): string{
      return this.roomName;
    }

    getUsers(): [] {
      return this.users;

    }

    getid(): number {
      return this.roomId;
    }

    getCodeInvitation(): number {
    return this.codeInvitation;
    }
}
