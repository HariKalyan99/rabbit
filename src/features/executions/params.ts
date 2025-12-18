import { PAGINATION } from "@/config/constants";
import { parseAsInteger } from "nuqs/server";

// nuqs for type safety of the params.

export const executionParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }), // clear on default will prevent from unnecessary default statements ex: localhost/credential?search= : has no meaning so it clears out to
  // localhost/credential
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
};
