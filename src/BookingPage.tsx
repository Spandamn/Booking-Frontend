import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import config from './config.json'; // Assuming your API URLs are in this config file
import './BookingPage.css';

interface Slot {
  Slot: number;
  Email?: string;
  Date: string;
}

const BookingPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');

  const handleFetchSlots = () => {
    if (selectedDate) {
      const apiUrl = `${config.apiBaseUrl}/getAvailableSlots?roomName=${roomName}&date=${selectedDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setAvailableSlots(data))
        .catch((error) => console.error('Error fetching available slots:', error));
    }
  };

  const handleSlotClick = (slot: number) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = () => {
    if (selectedSlot === null || !email) {
      alert('Please select a slot and enter your email.');
      return;
    }

    const bookingData = {
      Slot: selectedSlot,
      Email: email,
      Date: selectedDate,
    };

    const apiUrl = `${config.apiBaseUrl}/bookSlot?roomName=${roomName}`;
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Booking successful!');
      })
      .catch((error) => console.error('Error booking slot:', error));
  };

  const allSlots = Array.from({ length: 24 }, (_, i) => i + 8); // Assuming slots from 8:00 to 23:00

  return (
    <div className="booking-page">
      <h1>Book a Slot in {roomName}</h1>
      <div className="date-picker">
        <label>Select a Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={handleFetchSlots}>Fetch Available Slots</button>
      </div>
      {selectedDate && availableSlots.length > 0 && (
        <div className="slots-container">
          <h2>Available Slots on {selectedDate}</h2>
          <div className="slots">
            {allSlots.map((slot) => (
              <div
                key={slot}
                className={`slot ${availableSlots.includes(slot) ? 'available' : 'booked'} ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => handleSlotClick(slot)}
              >
                {`${slot}:00 - ${slot + 1}:00`}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="email-input">
        <label>Enter your Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleBookingSubmit} className="submit-button">Book Slot</button>
    </div>
  );
};

export default BookingPage;
