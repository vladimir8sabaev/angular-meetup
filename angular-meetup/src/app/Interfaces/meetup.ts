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
    id: 1;
    email: 'pam@dundermifflin.com';
    password: 'password';
    fio: 'password';
  };
  users: User[];
}
