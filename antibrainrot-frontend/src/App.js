import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadAuthFromStorage } from "./store/authSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignupLogin from "./pages/SignupLogin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import WorkMode from "./pages/WorkMode"
// import Chat from "./pages/Chat";
// import Matchmaking from "./pages/Matchmaking";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup-login" element={<SignupLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workmode" element={<WorkMode />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
        {/* <Route path="/matchmaking" element={<Matchmaking />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
