import { User } from "./User";

type Props = {
  user: User;
  text: string;
  date?: Date;
};
export class Message {
  public readonly user: User;
  public readonly text: string;
  public readonly date: Date;

  constructor(props: Props) {
    this.user = props.user;
    this.text = props.text;
    this.date = new Date();
  }
}
