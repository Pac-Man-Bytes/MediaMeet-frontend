import {Room} from './room';

export class Profile {
  id: string;
  nickname: string;
  photo: string;
  friends: Profile[];
  rooms: Room[];
}
