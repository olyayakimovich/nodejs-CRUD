export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
};

export type CreateUser = {
  login: string;
  password: string;
  age: number;
};

export type GetUser = {
  id: string;
  login: string;
  age: number;
};
