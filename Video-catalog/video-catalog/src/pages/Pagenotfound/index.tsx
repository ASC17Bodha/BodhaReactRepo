import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div>
            <h1>Page Not Found!</h1>
            <p className="display-6">
                The page you are looking for does not exist. You can try going <Link to="">Home</Link>, or check the <Link to="/workshops">list of workshops</Link>
            </p>
        </div>
    );
};

export default NotFoundPage;