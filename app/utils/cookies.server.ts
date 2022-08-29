import { createCookie } from "@remix-run/node";

export const contactCookie = createCookie("contact-cookie", {
  path: "/",
  sameSite: "lax",
  maxAge: 3_600, // one hour
});
