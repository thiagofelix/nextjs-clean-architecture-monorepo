import type { ITodosRepository } from "@acme/core/application/repositories/todos.repository.interface";
import { TodosRepository } from "@acme/core/infrastructure/repositories/todos.repository";
import { MockTodosRepository } from "@acme/core/infrastructure/repositories/todos.repository.mock";
import type { interfaces } from "inversify";
import { ContainerModule } from "inversify";

import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ITodosRepository>(DI_SYMBOLS.ITodosRepository).to(MockTodosRepository);
  } else {
    bind<ITodosRepository>(DI_SYMBOLS.ITodosRepository).to(TodosRepository);
  }
};

export const TodosModule = new ContainerModule(initializeModule);
