// App.js
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'; // Importing BrowserRouter for Link usage
import { Routes } from 'react-router-dom'; // Importing Routes and Route from the new version
import { AppContextProvider } from './AppContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Chat from './pages/Chat';



function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
        <Route
           exact path="/"
            element={
              // <NavBarLayout>
                <Login />
              // </NavBarLayout>
            }
          />
                  <Route
           exact path="/home"
            element={
              // <NavBarLayout>
                <Home />
              // </NavBarLayout>
            }
          />
                <Route
           exact path="/classes"
            element={
              // <NavBarLayout>
                <Classes />
              // </NavBarLayout>
            }
          />
                <Route
           exact path="/chat"
            element={
              // <NavBarLayout>
                <Chat />
              // </NavBarLayout>
            }
          />
        </Routes>
      </Router>
   </AppContextProvider>
  
  );
 
}

export default App;
