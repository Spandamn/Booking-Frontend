import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoomDisplay from './RoomDisplay';
import BookingPage from './BookingPage';
import CancelBooking from './CancelBooking';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:roomName" element={<RoomDisplay />} />
        <Route path="/:roomName/book" element={<BookingPage />} />
        <Route path="/cancelBooking/:token" element={<CancelBooking />} />
      </Routes>
    </Router>
  );
};

export default App;
