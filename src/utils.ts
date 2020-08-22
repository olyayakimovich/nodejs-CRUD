import omit from 'lodash/omit';
import { User } from './types';
import { START_INDEX } from './constants';

export const compareStrings = (searchLogin: string, login: string): boolean =>
  searchLogin.split('').every((value: string, index: number) => value === login[index]);

export const getAutoSuggestUsers = (users: User[], loginSubstring: string, limit: string) =>
  users
    .filter((user: User) => compareStrings(loginSubstring, user.login))
    .slice(START_INDEX, Number(limit))
    .map((value) => omit(value, 'password'));
