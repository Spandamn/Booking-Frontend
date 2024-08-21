import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookingPage.css'; // Add relevant styles

interface Slot {
  Slot: number;
  Email?: string;
  Date: string;
}

const BookingPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');

  const apiUrl = `https://08pob7kjhg.execute-api.eu-west-2.amazonaws.com/Prod/getAvailableSlots?roomName=${roomName}&date=${selectedDate}`;

  useEffect(() => {
    if (selectedDate) {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => setAvailableSlots(data))
        .catch((error) => console.error('Error fetching available slots:', error));
    }
  }, [selectedDate]);

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

    fetch(`https://08pob7kjhg.execute-api.eu-west-2.amazonaws.com/Prod/bookSlot?roomName=${roomName}`, {
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
      </div>
      
      {selectedDate && (
        <div className="slots-container">
          <h2>Available Slots on {selectedDate}</h2>
          <div className="slots">
            {availableSlots.map((slot) => (
              <div
                key={slot.Slot}
                className={`slot ${selectedSlot === slot.Slot ? 'selected' : ''}`}
                onClick={() => handleSlotClick(slot.Slot)}
              >
                {`${slot.Slot}:00 - ${slot.Slot + 1}:00`}
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
