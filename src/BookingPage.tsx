import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingPage.css';
import config from './config.json';

interface Slot {
  Slot: number;
  Email?: string;
  Date: string;
}

const BookingPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<number[]>(Array.from({ length: 16 }, (_, i) => i + 1)); // Default all slots as available
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');

  const handleFetchSlots = () => {
    if (selectedDate) {
      const apiUrl = `${config.apiBaseUrl}/getAvailableSlots?roomName=${roomName}&date=${selectedDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
            // If no slots are returned, assume all are available
            setAvailableSlots(Array.from({ length: 16 }, (_, i) => i + 1));
          } else {
            const bookedSlots = data.map((slot: Slot) => slot.Slot);
            const allSlots = Array.from({ length: 16 }, (_, i) => i + 1);
            const freeSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
            setAvailableSlots(freeSlots);
          }
        })
        .catch((error) => console.error('Error fetching available slots:', error));
    }
  };

  const handleSlotClick = (slot: number) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = () => {
    if (!selectedSlot || !email) {
      alert('Please select a slot and enter your email.');
      return;
    }

    const bookingData = {
      Slot: selectedSlot,
      Email: email,
      Date: selectedDate,
    };

    fetch(`${config.apiBaseUrl}/bookSlot?roomName=${roomName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Booking successful!');
        setSelectedSlot(null);
        setEmail('');
      })
      .catch((error) => console.error('Error booking slot:', error));
  };

  const currentDateString = new Date().toISOString().split('T')[0];

  return (
    <div className="container mt-4">
      <h1>Book a Slot in {roomName}</h1>
      <div className="form-group">
        <label>Select a Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={currentDateString} // Disallow past dates
          className="form-control"
        />
        <button onClick={handleFetchSlots} className="btn btn-primary mt-2">Fetch Available Slots</button>
      </div>
      {selectedDate && (
        <div className="slots-container mt-4">
          <h2>Available Slots on {selectedDate}</h2>
          <div className="row">
            {availableSlots.map((slot) => (
              <div
                key={slot}
                className={`col-12 col-md-3 slot ${selectedSlot === slot ? 'selected' : ''} ${selectedSlot && selectedSlot !== slot ? 'disabled' : ''}`}
                onClick={() => handleSlotClick(slot)}
              >
                {`${slot + 7}:00 - ${slot + 8}:00`}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="form-group mt-4">
        <label>Enter your Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <button onClick={handleBookingSubmit} className="btn btn-primary">Book Slot</button>
    </div>
  );
};

export default BookingPage;
