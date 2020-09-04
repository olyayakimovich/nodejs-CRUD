export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
} | null;

export type CreateUser = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};
