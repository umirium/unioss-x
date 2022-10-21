import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "cart",
      secrets: [process.env.COOKIE_SECRET || "r3m1xr0ck5"],
      sameSite: "lax",
    },
  });

export { getSession, commitSession, destroySession };
