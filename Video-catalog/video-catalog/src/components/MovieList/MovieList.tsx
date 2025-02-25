import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, setSearchQuery, setPage, setType } from "../../features/movie/movieslice";
import { RootState, AppDispatch } from "../../store";
import "./MovieList.css";
import { useSearchParams } from "react-router-dom";
import Loading from "../common/Loading/Loading";
import Pagination from "../common/Pagination/Pagination";
import { ErrorAlert } from "../common/ErrorAlert/errorAlert";

const MovieList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, totalResults, loading, error, searchQuery, page, type } = useSelector(
    (state: RootState) => state.movies
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = Number(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";

  useEffect(() => {
    if (urlPage !== page) dispatch(setPage(urlPage));
    if (category !== type) dispatch(setType(category));
    dispatch(fetchMovies({ searchQuery, page: urlPage, type: category }));
  }, [dispatch, searchQuery, urlPage, category, page, type]);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  const next = (newPage: number) => setSearchParams({ page: newPage.toString(), category });
  const previous = (newPage: number) => setSearchParams({ page: newPage.toString(), category });
  const selectPage = (selectedPage: number) =>
    setSearchParams({ page: selectedPage.toString(), category });

  const disableNext = page * rowsPerPage >= totalResults;
  const disablePrevious = page === 1;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchKey = event.target.value ;
    dispatch(setSearchQuery(newSearchKey));
    setSearchParams({ page: "1", category });
  };

  const handleTypeChange = (newType: string) => {
    dispatch(setType(newType));
    setSearchParams({ page: "1", category: newType });
  };

  const startResultNumber = totalResults > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const endResultNumber = (page - 1) * rowsPerPage + movies.length;

  return (
    <div className="container">
      <h1>Video Catalog</h1>
      <div className="movie-controls">
        <div className="pagination-wrapper">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrevious={previous}
            onNext={next}
            onPageSelect={selectPage}
            disablePrevious={disablePrevious}
            disableNext={disableNext}
          />
        </div>
        <div className="search-wrapper">
          <input
            type="search"
            className="form-control"
            placeholder="Type to search by Title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="btn-group-wrapper">
          <div className="btn-group" role="group" aria-label="Filter by category">
            <button className="btn btn-primary" onClick={() => handleTypeChange("")}>ANY</button>
            <button className="btn btn-danger" onClick={() => handleTypeChange("movie")}>Movies</button>
            <button className="btn btn-warning" onClick={() => handleTypeChange("series")}>Series</button>
            <button className="btn btn-success" onClick={() => handleTypeChange("episode")}>Episodes</button>
          </div>
        </div>
      </div>
      <div className="mb-3">
        {totalResults > 0 ? (
          <span>
            Showing {startResultNumber} to {endResultNumber} of {totalResults} result
            {totalResults !== 1 ? "s" : ""}
          </span>
        ) : (
          <span>No results found.</span>
        )}
      </div>
      {!loading && error && <ErrorAlert error={new Error(error)} />}
      {loading && <Loading />}
      <table className="movie-table">
        <thead>
          <tr><th>Poster</th><th>Title</th><th>Year</th><th>Type</th></tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <td><img src={movie.Poster} alt={movie.Title} className="table-poster" /></td>
              <td>{movie.Title}</td>
              <td>{movie.Year}</td>
              <td><button className="btn btn-primary btn-sm tiny-btn my-1">{movie.Type}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;