import './App.css';
import LandingPage from "./pages/landing-page/LandingPage";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Favorites from "./pages/favorites/Favorites";
import AuthSelection from './pages/auth/AuthSelection';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProfileForm from './pages/profile/ProfileForm';
import TopRatedPopular from "./pages/main/TopRatedPopular";
import ForYouPage from "./pages/main/ForYouPage";
import SearchPage from "./pages/main/SearchPage";
import HomePage from "./pages/main/HomePage";
import Rating from "./pages/rating/Rating";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<AuthSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile-details" element={<ProfileForm />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/ratings" element={<Rating />} />

                {/* Ana Sayfa için parent layout ve alt yollar */}
                <Route path="/home" element={<HomePage />}>
                    <Route index element={<TopRatedPopular />} />
                    <Route path="for-you" element={<ForYouPage />} />
                    <Route path="search" element={<SearchPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;