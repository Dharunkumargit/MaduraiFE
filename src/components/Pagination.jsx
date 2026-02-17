import React, { useMemo } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const Pagination = ({
  totalItems = 0,
  itemsPerPage ,
  currentPage = 1,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;

    let start = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let end = start + maxPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-1">
      <p className="text-sm text-gray-500">
        Showing the Pages of {startItem}–{endItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2 mr-7">
        {/* First */}
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <GoArrowLeft />
        </button>

        {/* Prev */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {/* Pages */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={`px-3 py-1 rounded-md text-sm transition ${
              currentPage === page
                ? "bg-black text-white font-semibold"
                : "text-black hover:bg-grey-500"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>

        {/* Last */}
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <GoArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
