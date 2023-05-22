import { User } from './User';

type Props = {
  sender: User;
  receiver: User;
  text: string;
  date?: Date;
};
export class Message {
  public readonly sender: User;
  public readonly receiver: User;
  public readonly text: string;
  public readonly date: Date;

  constructor(props: Props) {
    if (!props.text || props.text.trim().length == 0) {
      throw new Error('text message is empty');
    }

    this.sender = props.sender;
    this.receiver = props.receiver;
    this.text = props.text;
    this.date = props.date || new Date();
  }
}
