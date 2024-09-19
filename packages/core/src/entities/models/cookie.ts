interface CookieAttributes {
  secure?: boolean;
  path?: string;
  domain?: string;
  sameSite?: "lax" | "strict" | "none";
  httpOnly?: boolean;
  maxAge?: number;
  expires?: Date;
}

export interface Cookie {
  name: string;
  value: string;
  attributes: CookieAttributes;
}
