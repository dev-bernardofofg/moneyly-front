export type CookieOptions = {
  expires?: number | Date | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  expiresInMinutes?: number;
};

const isBrowser = typeof window !== "undefined";

export const getCookie = (name: string): string => {
  if (!isBrowser) return "";

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
};

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (!isBrowser) return;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expiresInMinutes) {
    const date = new Date();
    date.setTime(date.getTime() + options.expiresInMinutes * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  } else if (options.expires) {
    if (typeof options.expires === "number") {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else if (options.expires instanceof Date) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires}`;
    }
  }

  if (options.path) cookieString += `; path=${options.path}`;
  if (options.domain) cookieString += `; domain=${options.domain}`;
  if (options.secure) cookieString += "; secure";
  if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

  document.cookie = cookieString;
};

export const deleteCookie = (
  name: string,
  path?: string,
  domain?: string
): void => {
  if (!isBrowser) return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    path ? `; path=${path}` : ""
  }${domain ? `; domain=${domain}` : ""}`;
};

export const getCookiesByPrefix = (prefix: string): Record<string, string> => {
  if (!isBrowser) return {};

  const cookies = document.cookie.split("; ");
  const result: Record<string, string> = {};
  cookies.forEach((row) => {
    if (row.startsWith(prefix)) {
      const [name, value] = row.split("=");
      result[name] = decodeURIComponent(value || "");
    }
  });
  return result;
};
