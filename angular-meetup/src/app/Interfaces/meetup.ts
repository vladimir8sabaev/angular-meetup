import { User } from './user';

export interface Meetup {
  id: number;
  name: string;
  description: string;
  location: string;
  target_audience: string;
  need_to_know: string;
  will_happen: string;
  reason_to_come: string;
  time: string;
  duration: number;
  createdBy: 1;
  owner: {
    id: number;
    email: string;
    password: string;
    fio: string;
  };
  users: User[];
}
