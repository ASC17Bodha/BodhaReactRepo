import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IMovie } from "../../models/IMovie";
import { getMovies } from "../../services/Movies";

interface MoviesState {
  movies: IMovie[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  page: number;
  type: string;
}

const initialState: MoviesState = {
  movies: [],
  totalResults: 0,
  loading: false,
  error: null,
  searchQuery: "american",
  page: 1,
  type: ""
};

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (
    { searchQuery, page, type }: { searchQuery: string; page: number; type: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getMovies(searchQuery, page, type);
      if (response.Response === "True") {
        return {
          movies: response.Search,
          totalResults: parseInt(response.totalResults, 10)
        };
      } else {
        return rejectWithValue("No movies found");
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setType(state, action) {
      state.type = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.loading = false;
      state.movies = action.payload.movies;
      state.totalResults = action.payload.totalResults;
    });
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.movies = [];
      state.totalResults = 0;
    });
  }
});

export const { setSearchQuery, setPage, setType } = moviesSlice.actions;
export default moviesSlice.reducer;
