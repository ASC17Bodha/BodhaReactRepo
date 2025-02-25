import { Button } from "react-bootstrap";
import "./Pagination.css";

interface Props {
  page: number;
  totalPages: number;
  onPrevious?: (newPage: number) => void;
  onNext?: (newPage: number) => void;
  onPageSelect?: (selectedPage: number) => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
}

const Pagination = ({
  page,
  totalPages,
  onPrevious = () => {},
  onNext = () => {},
  onPageSelect = () => {},
  disablePrevious = false,
  disableNext = false,
}: Props) => {
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1); // First page
    if (page > 3) pages.push("...");
    if (page > 2) pages.push(page - 1); // Previous page
    if (page !== 1 && page !== totalPages) pages.push(page); // Current page
    if (page < totalPages - 1) pages.push(page + 1); // Next page
    if (page < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages); // Last page
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <Button
        className="btn-prev"
        size="sm"
        disabled={disablePrevious || page === 1}
        onClick={() => onPrevious(page - 1)}
      />
      <div className="pagination-group">
        {pageNumbers.map((p, index) =>
          p === "..." ? (
            <span key={index} className="ellipsis">
              ...
            </span>
          ) : (
            <Button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              size="sm"
              disabled={p > totalPages}
              onClick={() => onPageSelect(p as number)}
            >
              {p}
            </Button>
          )
        )}
      </div>
      <Button
        className="btn-next"
        size="sm"
        disabled={disableNext || page === totalPages}
        onClick={() => onNext(page + 1)}
      />
    </div>
  );
};

export default Pagination;