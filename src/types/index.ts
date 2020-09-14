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

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
  id: string;
  name: string;
  permissions: Array<Permission>;
};

export type CreateGroup = {
  name: string;
  permissions: Array<Permission>;
};
