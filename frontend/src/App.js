import React, {useState, useEffect} from 'react';
import './App.css';
import {useRoutes} from "./routes"
import {BrowserRouter as Router} from "react-router-dom";
import {AuthContext} from "./pages/auth/AuthContext";

function App() {
    const routes = useRoutes(false);

    return (
        <AuthContext.Provider>
            <Router>
                {routes}
            </Router>
        </AuthContext.Provider>
    );
}

export default App;