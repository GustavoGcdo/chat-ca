import { User } from "./User";

type Props = {
  user: User;
  text: string;
};
export class Message {
  public readonly user: User;
  public readonly text: string;

  constructor(props: Props) {
    this.user = props.user;
    this.text = props.text;
  }
}
