import axios from "axios";
import { IMovie } from "../models/IMovie";


const getMovies = async () => {
    // We get a "Promise" object from axios.get()
    // Initially the Promise is in the "pending". Then the Promise is "resolved" / "rejected".
    // NOTE: Explore then(), catch() methods of Promise

    const response = await axios.get(`http://localhost:3004/movies`);
    // const response = await axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=36729ced`);

    //the api contains only one movie, so i have created own json server which is present in video-catalog\src\sample-server\movies.json

    return response.data as IMovie[];
    // return response.data as IMovie;

};
export {
    getMovies
};










