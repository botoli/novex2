// App.tsx
import React, { useEffect } from 'react';

import { Route, Routes } from 'react-router-dom';
import Header from './UI/Header/Header';
import Home from './UI/Home/Home';
function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      {/* <Routes>
        <Route path="*" element={<NotFound404 />} />
      </Routes> */}
    </div>
  );
}

export default App;
