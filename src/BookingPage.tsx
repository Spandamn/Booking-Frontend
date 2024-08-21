import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookingPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const apiUrl = `https://8cz9k1w6jb.execute-api.eu-west-2.amazonaws.com/Prod/bookSlot?roomName=${roomName}`; // Adjust the API URL

  useEffect(() => {
    fetch(`https://8cz9k1w6jb.execute-api.eu-west-2.amazonaws.com/Prod/getAvailableSlots?roomName=${roomName}`) // Fetch available slots
      .then((response) => response.json())
      .then((data) => setSlots(data))
      .catch((error) => console.error('Error fetching available slots:', error));
  }, [roomName]);

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
      <h1>Book {roomName}</h1> {/* Display Room Name */}
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
