import { User } from './User';

type Props = {
  requester: User;
  receiver: User;
  replied: boolean;
};

export class FriendshipRequest {
  public readonly requester: User;
  public readonly receiver: User;
  public replied: boolean;

  constructor(props: Props) {
    this.requester = props.requester;
    this.receiver = props.receiver;
    this.replied = props.replied;
  }
}
