import React, { useState } from "react";
import Login from "./pages/Login";
import QuoteRequest from "./pages/QuoteRequest";

function App() {
  /*const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [pageTitle, setPageTitle] = useState("MainPage");

  const [isOpen, setIsOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };*/

  return (
    <div className="App min-h-screen bg-slate-50">
      {/*{!isLoggedIn ? (*/}
        <QuoteRequest
        // onLoginSuccess={handleLoginSuccess}
        />
      {/*}) : (
        <>
          
        </>
      )}*/}
    </div>
  );
}

export default App;