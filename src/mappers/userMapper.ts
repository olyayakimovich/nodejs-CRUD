import omit from 'lodash/omit';
import { User, GetUser } from '../types';
import { START_INDEX } from '../constants';

export const compareStrings = (searchLogin: string, login: string): boolean =>
  searchLogin.split('').every((value: string, index: number) => value === login[index]);

export const mapSuggestUsers = (users: User[], loginSubstring: string, limit: string) => {
  return users
    .filter((user: User) => {
      if (!user) return false;

      return compareStrings(loginSubstring, user.login);
    })
    .slice(START_INDEX, Number(limit))
    .map((value) => omit(value, 'password'));
};

export const mapUserToClient = (user: User): GetUser => omit(user, 'password');
