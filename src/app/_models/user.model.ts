export interface IUser {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
}

export class ModelUser implements IUser {
  readonly id: number;
  readonly username: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly token: string;

  constructor({
    id = NaN,
    username = '',
    password = '',
    firstName = '',
    lastName = '',
    token = ''
  }: Partial<IUser> = {}) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.token = token;
  }

  serialize(): IUser {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      token: this.token
    };
  }

  clone(): ModelUser {
    return new ModelUser(this.serialize());
  }
}
