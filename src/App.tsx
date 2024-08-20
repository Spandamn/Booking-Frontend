import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoomDisplay from './TimeSlots';
import BookingPage from './BookingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomDisplay />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
