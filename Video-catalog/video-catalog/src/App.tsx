import { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Menu from "./components/common/Menu/Menu";
import MovieList from "./components/MovieList/MovieList";
import MovieListPage from "./pages/MovieList";
import { Navigate, Routes, Route } from "react-router-dom";

import "./App.scss";
import NotFoundPage from "./pages/Pagenotfound";

function App() {
    // variable that is NOT state
    // const title = "Workshops App";

    // variable that is state - changes to the variable (using setTitle) will trigger a re-render
    const [title, setTitle] = useState("Movie List");
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(true);

    const changeTitle = () => {
        // incorrect way to change the title - will not trigger a re-render
        // title = "My first React Application";

        // correct way to change the title - will trigger a re-render
        setTitle("My first React Application");

        // The function form of the setState updater is used when the new state is computed using the previous state
        setCount((c) => c + 1);
    };

    return (
        <>
            {/* {show && (
                <Alert
                    variant="warning"
                    onClose={() => setShow(false)}
                    dismissible
                >
                    <Alert.Heading>Note on React Version</Alert.Heading>
                    <p>
                        The current version of React is v19. This app is built
                        using React v18. The way an app was built using React
                        v16.7 or earlier was significantly different.
                    </p>
                </Alert>
            )} */}
            {/* <Menu/> */}

            <Container className="my-5">
              <Routes>
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/" element={<MovieListPage />} />
                <Route path="*" element={<NotFoundPage/>} />
              </Routes>
            </Container>
        </>
    );
}

export default App;