import { IUsersRepository } from "@acme/core/application/repositories/users.repository.interface";
import { User } from "@acme/core/entities/models/user";
import { hashSync } from "@node-rs/argon2";
import { injectable } from "inversify";

@injectable()
export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
    const hashOptions = {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    };

    this._users = [
      {
        id: "1",
        username: "one",
        password_hash: hashSync("password-one", hashOptions),
      },
      {
        id: "2",
        username: "two",
        password_hash: hashSync("password-two", hashOptions),
      },
      {
        id: "3",
        username: "three",
        password_hash: hashSync("password-three", hashOptions),
      },
    ];
  }

  getUser(id: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.id === id);
    return Promise.resolve(user);
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.username === username);
    return Promise.resolve(user);
  }
  createUser(input: User): Promise<User> {
    this._users.push(input);
    return Promise.resolve(input);
  }
}
