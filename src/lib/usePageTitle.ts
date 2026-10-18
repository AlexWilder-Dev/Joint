import { useEffect } from 'react';

export const SITE_TITLE = 'The Joint | Brunch, BBQ & Bar in London';

/** One title pattern for every page: "<page> | The Joint". Pass nothing for the home page. */
export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} | The Joint` : SITE_TITLE;
  }, [page]);
}
