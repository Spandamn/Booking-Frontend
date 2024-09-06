// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoomDisplay from './RoomDisplay';
import BookingPage from './BookingPage';
import CancelBooking from './CancelBooking';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for room display with roomName parameter */}
        <Route path="/:roomName" element={<RoomDisplay />} />
        {/* Specific route for canceling booking */}
        <Route path="/cancelBooking" element={<CancelBooking />} />
        {/* Booking page route */}
        <Route path="/:roomName/book" element={<BookingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
