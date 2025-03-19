import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Advance from "./pages/Advance.jsx";
import AddPlace from "./pages/AddPlace.jsx";
import DaySummary from './pages/DaySummary.jsx'
function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/advance" element={<Advance />} />
                <Route path="/addplace" element={<AddPlace />} />
                <Route path="/daysummary/:key" element={<DaySummary />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;