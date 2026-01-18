// App.tsx
import React, { useEffect } from 'react';

import { Route, Routes } from 'react-router-dom';
import Header from './UI/Header/Header';
import Home from './UI/Home/HomePage.tsx';
import './UI/Styles/app.scss';
import { ThemeProvider } from './context/Theme.tsx';

import ProjectsPage from './UI/Projects/ProjectsPage.tsx';
import TaskPage from './Tasks/TaskPage.tsx';
function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Tasks" element={<TaskPage />} />
          <Route path="/Projects" element={<ProjectsPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
