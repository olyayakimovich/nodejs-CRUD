import { User } from './types';
import { START_INDEX } from './constants';

export const compareStrings = (searchLogin: string, login: string): boolean =>
  searchLogin.split('').every((value: string, index: number) => value === login[index]);

export const getAutoSuggestUsers = (users: User[], loginSubstring: string, limit: number) =>
  users.filter((user: User) => compareStrings(loginSubstring, user.login)).slice(START_INDEX, limit);
