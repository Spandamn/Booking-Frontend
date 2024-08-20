import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimeSlots from './TimeSlots';
import BookingPage from './BookingPage';

const App: React.FC = () => {
  const roomName = "Conference Room A";
  const availableSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ]; // Adjust these times according to availability

  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<BookingPage roomName={roomName} availableSlots={availableSlots} />} />
        <Route path="/" element={
          <>
            <h1 className="text-center mt-4">{roomName}</h1>
            <TimeSlots />
          </>
        } />
      </Routes>
    </Router>
  );
};

export default App;
