import type { ITodosRepository } from "@acme/core/application/repositories/todos.repository.interface";
import type { IUsersRepository } from "@acme/core/application/repositories/users.repository.interface";
import type { IAuthenticationService } from "@acme/core/application/services/authentication.service.interface";

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),

  // Repositories
  ITodosRepository: Symbol.for("ITodosRepository"),
  IUsersRepository: Symbol.for("IUsersRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;

  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;
}
