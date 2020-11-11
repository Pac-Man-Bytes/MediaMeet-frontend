import {Profile} from './profile';

export class Message {
  public text: string = '';
  public date: Date;
  public username: string;
  public type: string;
  public color: string;
  public profile: Profile;
}
