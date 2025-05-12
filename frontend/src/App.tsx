import React, { Children } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MemoryPage from "./pages/MemoryPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/memory/:id"
          element={
            <PrivateRoute>
              <MemoryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
