import type { TypedResponse } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import camelcaseKeys from "camelcase-keys";
import type { SnakeToCamel } from "snake-camel-types";
import type { NoticeType } from "~/types/outline";
import {
  commitSession as commitAlertSession,
  getSession as getAlertSession,
} from "~/utils/sessions/alert.server";

const query = async <T extends object>(
  q: () => PostgrestFilterBuilder<T>,
  request?: Request
): Promise<
  | {
      err: TypedResponse<never> | NoticeType;
      data: undefined;
      count: null;
    }
  | {
      err: undefined;
      data: Array<SnakeToCamel<T>>;
      count: number | null;
    }
> => {
  try {
    const { data: record, count, error } = await q();

    if (error) {
      console.log(error);
      throw new Error(error.code, { cause: error });
    }

    if (!record) {
      return { err: undefined, data: [], count };
    }

    return {
      err: undefined,
      data: camelcaseKeys(record) as Array<SnakeToCamel<T>>,
      count,
    };
  } catch (error) {
    // show alert of database errors

    // If request is given, redirect will be returned.
    // (for action)
    if (request) {
      const alertSession = await getAlertSession(request.headers.get("cookie"));

      if (error instanceof Error) {
        alertSession.flash("alert", {
          key: `dbErrors_${Date.now()}`,
          options: { errorCode: error.message },
        });
      } else {
        alertSession.flash("alert", {
          key: `unknown_${Date.now()}`,
        });
      }

      const headers = new Headers();
      headers.append("Set-Cookie", await commitAlertSession(alertSession));

      return {
        err: redirect(request.url, { headers }),
        data: undefined,
        count: null,
      };
    }

    // If request is not given, NoticeType will be returned.
    // (for loader)
    if (error instanceof Error) {
      return {
        err: {
          key: `dbErrors_${Date.now()}`,
          options: { error: `common:${error.message}` },
        },
        data: undefined,
        count: null,
      };
    } else {
      return {
        err: {
          key: `unknown_${Date.now()}`,
        },
        data: undefined,
        count: null,
      };
    }
  }
};

export default query;
