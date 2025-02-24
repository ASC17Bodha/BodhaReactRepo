import { useEffect, useState } from "react";
import { getMovies } from "../../services/Movies";
import { IMovie } from "../../models/IMovie";
import "./MovieList.css";
import { useSearchParams } from "react-router";
import Loading from "../common/Loading/Loading";
import Pagination from "../common/Pagination/Pagination";
import { ErrorAlert } from "../common/ErrorAlert/errorAlert";

const MovieList = () => {
  // State for movies data, loading, errors, and the search key (default "american").
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filterKey, setFilterKey] = useState("american");

  // Use URL search params to store page and type filter; default page is 1 and type is empty.
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";

  // Fetch movies when filterKey, page or category changes.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMovies(filterKey, page, category);
        // When API response is successful (Response === "True"), update states.
        if (data.Response === "True") {
          setMovies(data.Search);
          setTotalResults(parseInt(data.totalResults, 10));
        } else {
          // When no results are found, clear movies and totalResults.
          setMovies([]);
          setTotalResults(0);
        }
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterKey, page, category]);

  // Calculate total pages based on total results.
  const rowsPerPage = 10;
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  // Pagination callbacks update the URL search params (preserving category filter).
  const next = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), category });
  };

  const previous = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), category });
  };

  const selectPage = (selectedPage: number) => {
    setSearchParams({ page: selectedPage.toString(), category });
  };

  const disableNext = page * rowsPerPage >= totalResults;
  const disablePrevious = page === 1;

  // Update filter key when user types in the search input; reset page to 1.
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchKey = event.target.value;
    setFilterKey(newSearchKey);
    setSearchParams({ page: "1", category });
  };

  // Update the type filter from button clicks; reset page to 1.
  const handleTypeChange = (newType: string) => {
    setSearchParams({ page: "1", category: newType });
  };

  // Calculate displayed result numbers.
  const startResultNumber = totalResults > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const endResultNumber = (page - 1) * rowsPerPage + movies.length;

  return (
    <div className="container">
      <h1>Video Catalog</h1>
      {/* Flex container: Pagination, Search Input, and Video Type buttons side by side */}
      <div className="movie-controls">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrevious={previous}
          onNext={next}
          onPageSelect={selectPage}
          disablePrevious={disablePrevious}
          disableNext={disableNext}
        />
        <div className="flex-grow-1">
          <input
            type="search"
            className="form-control"
            placeholder="Type to search by Title"
            value={filterKey}
            onChange={handleSearchChange}
          />
        </div>
        <div className="btn-group" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleTypeChange("")}
          >
            ANY
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleTypeChange("movie")}
          >
            Movies
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => handleTypeChange("series")}
          >
            Series
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleTypeChange("episode")}
          >
            Episodes
          </button>
        </div>
      </div>
      {/* Results count and range */}
      <div className="mb-3">
        {totalResults > 0 ? (
          <span>
            Showing {startResultNumber} to {endResultNumber} of {totalResults}{" "}
            result
            {totalResults !== 1 ? "s" : ""}
          </span>
        ) : (
          <span>No results found.</span>
        )}
      </div>

      {!loading && error && <ErrorAlert error={error} />}
      <table className="movie-table">
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Year</th>
            <th>Type</th>
          </tr>
        </thead>
        {loading && <Loading />}
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <td>
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="table-poster"
                />
              </td>
              <td>{movie.Title}</td>
              <td>{movie.Year}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm tiny-btn my-1"
                >
                  {movie.Type}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;
