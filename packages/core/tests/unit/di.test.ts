import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from "@acme/core/di/container";
import { MockTodosRepository } from "@acme/core/infrastructure/repositories/todos.repository.mock";
import { MockUsersRepository } from "@acme/core/infrastructure/repositories/users.repository.mock";
import { MockAuthenticationService } from "@acme/core/infrastructure/services/authentication.service.mock";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("should use Mock versions of repos and services", () => {
  const authService = getInjection("IAuthenticationService");
  expect(authService).toBeInstanceOf(MockAuthenticationService);

  const usersRepository = getInjection("IUsersRepository");
  expect(usersRepository).toBeInstanceOf(MockUsersRepository);

  const todosRepository = getInjection("ITodosRepository");
  expect(todosRepository).toBeInstanceOf(MockTodosRepository);
});
