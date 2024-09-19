import type { IAuthenticationService } from "@acme/core/services/authentication.service.interface";
import { AuthenticationService } from "@acme/core/infrastructure/services/authentication.service";
import { MockAuthenticationService } from "@acme/core/infrastructure/services/authentication.service.mock";
import type { interfaces } from "inversify";
import { ContainerModule } from "inversify";

import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      MockAuthenticationService,
    );
  } else {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationService,
    );
  }
};

export const AuthenticationModule = new ContainerModule(initializeModule);
