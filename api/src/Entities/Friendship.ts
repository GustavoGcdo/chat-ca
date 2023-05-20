import { User } from "./User"

type Props = {
  requestUser: User;
  receiveUser: User;
}

export class Friendship {
  public readonly requestUser: User;
  public readonly receiveUser: User;

  constructor(props: Props){
    this.requestUser = props.requestUser;
    this.receiveUser = props.receiveUser;
  }
}