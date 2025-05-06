import './App.css';
import LandingPage from "./pages/landing-page/LandingPage";
import Register from "./pages/register/Register";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Favorites from "./pages/favorites/Favorites";
import TopRatedPopular from "./pages/main/TopRatedPopular";
import ForYouPage from "./pages/main/ForYouPage";
import SearchPage from "./pages/main/SearchPage";
import HomePage from "./pages/main/HomePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<Favorites />} />

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