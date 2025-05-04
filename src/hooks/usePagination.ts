// /src/hooks/usePagination.ts
import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], pageSize: number) {
  const [pageIndex, setPageIndex] = useState(0); // MaterialReactTable uses 0-based index

  const total = data.length;
  const pageCount = Math.ceil(total / pageSize);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageIndex, pageSize]);

  return {
    pageIndex,
    setPageIndex,
    pageSize,
    pageCount,
    paginatedData,
    total,
  };
}
