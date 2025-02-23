import { useEffect, useMemo, useState } from "react";
import { getMovies } from "../../services/Movies";
import { IMovie } from "../../models/IMovie";
import "./MovieList.css";
import { useSearchParams } from "react-router";
import Loading from "../common/Loading/Loading";
import Pagination from "../common/Pagination/Pagination";
import { ErrorAlert } from "../common/ErrorAlert/errorAlert";

const MovieList = () => {
  // Local state for movie data, loading, errors and search key (default "american").
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filterKey, setFilterKey] = useState("american");

  // Use URL search params to store page and type filter; default page is 1 and type is empty (no filter).
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";

  // Fetch movies when component mounts or when video type filter (category) changes.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  // Filter movies based on the search key (Title) and selected video type.
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.Title.toUpperCase().includes(filterKey.toUpperCase());
      const matchesCategory = category ? movie.Type === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [movies, filterKey, category]);

  // Divide filtered results into pages of 10 rows.
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredMovies.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const pagedMovies = filteredMovies.slice(startIndex, startIndex + rowsPerPage);

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

  const disableNext = page * rowsPerPage >= filteredMovies.length;
  const disablePrevious = page === 1;

  // When a user types in the search key, update filterKey state and reset the page to 1.
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchKey = event.target.value;
    setFilterKey(newSearchKey);
    setSearchParams({ page: "1", category });
  };

  // When a video type button is clicked, update the category in URL search params and reset page to 1.
  const handleTypeChange = (newType: string) => {
    setSearchParams({ page: "1", category: newType });
  };

  // Calculate displayed result numbers.
  const startResultNumber = filteredMovies.length > 0 ? startIndex + 1 : 0;
  const endResultNumber = startIndex + pagedMovies.length;

  return (
    <div>
      <h1>Video Catalog</h1>
      {/* Flex container: Pagination, Search Input, and Video Type buttons side by side */}
      <div className="d-flex align-items-center gap-3 mb-3">
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
          <button type="button" className="btn btn-primary" onClick={() => handleTypeChange("")}>
            ANY
          </button>
          <button type="button" className="btn btn-danger" onClick={() => handleTypeChange("movie")}>
            Movies
          </button>
          <button type="button" className="btn btn-warning" onClick={() => handleTypeChange("series")}>
            Series
          </button>
          <button type="button" className="btn btn-success" onClick={() => handleTypeChange("episode")}>
            Episodes
          </button>
        </div>
      </div>
      {/* Results count and range */}
      <div className="mb-3">
        {filteredMovies.length > 0 ? (
          <span>
            Showing {startResultNumber} to {endResultNumber} of {filteredMovies.length} result
            {filteredMovies.length !== 1 ? "s" : ""}
          </span>
        ) : (
          <span>No results found.</span>
        )}
      </div>
      {loading && <Loading />}
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
        <tbody>
          {pagedMovies.map((movie, index) => (
            <tr key={index}>
              <td>
                <img src={movie.Poster} alt={movie.Title} className="table-poster" />
              </td>
              <td>{movie.Title}</td>
              <td>{movie.Year}</td>
              <td>
                <button type="button" className="btn btn-primary btn-sm tiny-btn my-1">
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
