import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import MyWork from "./pages/MyWork";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-work" element={<MyWork />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;