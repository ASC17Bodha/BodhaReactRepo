import { Button } from "react-bootstrap";
import "./Pagination.css";

interface Props {
  page: number,
  totalPages: number,
  onPrevious?: (newPage: number) => void,
  onNext?: (newPage: number) => void,
  onPageSelect?: (selectedPage: number) => void,
  disablePrevious?: boolean,
  disableNext?: boolean,
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
  return (
    <div className="pagination-container">
      <div className="pagination-buttons">
        <Button
          className="btn-prev"
          size="sm"
          disabled={disablePrevious || page === 1}
          onClick={() => onPrevious(page - 1)}
        />
        <div className="d-inline-flex pagination-group">
          {[1, 2, 3].map((p) => (
            <Button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              size="sm"
              disabled={p > totalPages}
              onClick={() => onPageSelect(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button
          className="btn-next"
          size="sm"
          disabled={disableNext}
          onClick={() => onNext(page + 1)}
        />
      </div>
      <div className="pagination-info">
        You are viewing page {page}
      </div>
    </div>
  );
};

export default Pagination;
