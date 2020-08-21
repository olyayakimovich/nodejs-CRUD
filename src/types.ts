import { Request } from 'express';

export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

export interface ExtendedRequest extends Request {
  user?: User;
}
