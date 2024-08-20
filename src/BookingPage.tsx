// src/BookingPage.tsx

import React, { useState, useEffect } from 'react';

const BookingPage: React.FC = () => {
  const [slots, setSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const apiUrl = 'https://your-api-gateway-url/Prod/bookSlot'; // Replace with your API Gateway URL

  useEffect(() => {
    fetch('https://your-api-gateway-url/Prod/getAvailableSlots') // Fetch available slots
      .then((response) => response.json())
      .then((data) => setSlots(data))
      .catch((error) => console.error('Error fetching available slots:', error));
  }, []);

  const handleBooking = () => {
    if (selectedSlot !== null) {
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Slot: selectedSlot,
          Email: email,
          Date: new Date().toISOString().split('T')[0], // Example date format
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Booking successful:', data);
        })
        .catch((error) => console.error('Error booking slot:', error));
    }
  };

  return (
    <div>
      <h1>Book Room</h1>
      <label htmlFor="slots">Select a time slot:</label>
      <select
        id="slots"
        value={selectedSlot || ''}
        onChange={(e) => setSelectedSlot(Number(e.target.value))}
      >
        <option value="" disabled>
          Select a slot
        </option>
        {slots.map((slot) => (
          <option key={slot} value={slot}>
            {`${slot}:00 - ${slot + 1}:00`}
          </option>
        ))}
      </select>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleBooking}>Book Slot</button>
    </div>
  );
};

export default BookingPage;
