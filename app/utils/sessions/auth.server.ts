import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStrage = createCookieSessionStorage({
  cookie: {
    name: "auth",
    secrets: [process.env.COOKIE_SECRET || "r3m1xr0ck5"],
    sameSite: "lax",
  },
});

export const { getSession, commitSession, destroySession } = sessionStrage;
