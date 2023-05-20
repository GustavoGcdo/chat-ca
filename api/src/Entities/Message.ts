import { User } from './User';

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
    if (!props.text || props.text.trim().length == 0) {
      throw new Error('text message is empty');
    }

    this.user = props.user;
    this.text = props.text;
    this.date = props.date || new Date();
  }
}
