export interface Message {
  _id: string;
  sender: string;
  timeSent: number;
  contents: string;
  room: string;
}

export interface User {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  timeZone: string;
  thumbnail: string;
  workingHours: any[];
  rooms: string[];
  unreadMessages: any[];
}
