/**
 * Pagination hook
 */

import { useState } from 'react';

export const usePagination = (initialPage = 1, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, page));
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));

  return {
    currentPage,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
  };
};
