import { PAGINATION } from '@/config/constants';
import {parseAsInteger, parseAsString} from 'nuqs/server';

// nuqs for type safety of the params.

export const workflowsParams = {
    page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({clearOnDefault: true}), // clear on default will prevent from unnecessary default statements ex: localhost/workflows?search= : has no meaning so it clears out to 
    // localhost/workflows 
    pageSize: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE).withOptions({clearOnDefault: true}),
    search: parseAsString.withDefault(''),
}