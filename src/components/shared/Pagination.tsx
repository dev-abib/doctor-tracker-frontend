"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  isLoading = false,
}) => {
  const { page, totalPages, total, limit } = meta;

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="text-xs sm:text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => onPageChange(1)}
          disabled={page <= 1 || isLoading}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <Button
                key={idx}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className="h-8 min-w-[32px] px-2 rounded-lg text-xs"
                onClick={() => onPageChange(p)}
                disabled={isLoading}
              >
                {p}
              </Button>
            ) : (
              <span key={idx} className="px-1 text-xs text-muted-foreground">
                {p}
              </span>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages || isLoading}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
