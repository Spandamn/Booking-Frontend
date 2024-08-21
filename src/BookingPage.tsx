import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookingPage.css';  // Create and import a CSS file for styling

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const BookingPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const apiUrl = `https://6hpzr0hu27.execute-api.eu-west-2.amazonaws.com/Prod/getAvailableSlots?roomName=${roomName}`;
  const bookSlotUrl = `https://6hpzr0hu27.execute-api.eu-west-2.amazonaws.com/Prod/bookSlot?roomName=${roomName}`;

  useEffect(() => {
    fetch(apiUrl, { mode: 'cors' })
      .then((response) => response.json())
      .then((data) => setAvailableSlots(data))
      .catch((error) => console.error('Error fetching available slots:', error));
  }, [roomName]);

  const handleBooking = () => {
    if (!selectedSlot || !email) {
      alert('Please select a slot and enter your email.');
      return;
    }

    const bookingData = {
      Slot: selectedSlot,
      Email: email,
      Date: new Date().toISOString().split('T')[0], // Today's date
    };

    fetch(bookSlotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to book slot.');
        }
        return response.json();
      })
      .then(() => {
        alert('Slot booked successfully!');
        setSelectedSlot(null);
        setEmail('');
      })
      .catch((error) => console.error('Error booking slot:', error));
  };

  return (
    <div className="booking-page-container">
      <h1>Book a Slot in {roomName}</h1>
      <div className="booking-form">
        <label htmlFor="slot">Select a time slot:</label>
        <select
          id="slot"
          value={selectedSlot || ''}
          onChange={(e) => setSelectedSlot(Number(e.target.value))}
        >
          <option value="" disabled>Select a slot</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot}>
              {`${slot}:00 - ${slot + 1}:00`}
            </option>
          ))}
        </select>

        <label htmlFor="email">Enter your email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleBooking}>Book Slot</button>
      </div>
    </div>
  );
};

export default BookingPage;
