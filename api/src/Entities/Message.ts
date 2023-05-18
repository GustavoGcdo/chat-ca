type Props = {
  userEmail: string;
  text: string;
};
export class Message {
  public readonly userEmail: string;
  public readonly text: string;

  constructor(props: Props) {
    this.userEmail = props.userEmail;
    this.text = props.text;
  }
}
