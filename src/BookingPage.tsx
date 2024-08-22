import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [todaySlots, setTodaySlots] = useState<number[]>([]); // Slots available today after the current time

  useEffect(() => {
    if (selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      if (selectedDate === today) {
        const currentHour = new Date().getHours();
        const remainingSlots = Array.from({ length: 16 - (currentHour - 8) }, (_, i) => i + (currentHour - 7));
        setTodaySlots(remainingSlots);
      } else {
        setTodaySlots([]);
      }
    }
  }, [selectedDate]);

  const handleFetchSlots = () => {
    if (selectedDate) {
      const apiUrl = `${config.apiBaseUrl}/getAvailableSlots?roomName=${roomName}&date=${selectedDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
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
    if (availableSlots.includes(slot)) {
      setSelectedSlot(slot);
    }
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

  const isSlotAvailable = (slot: number) => {
    return todaySlots.length === 0 || todaySlots.includes(slot);
  };

  return (
    <div className="booking-page">
      <h1>Book a Slot in {roomName}</h1>
      <div className="date-picker">
        <label>Select a Date:</label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]} // Prevent past dates
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setAvailableSlots([]); // Reset available slots when date changes
          }}
        />
        <button onClick={handleFetchSlots}>Fetch Available Slots</button>
      </div>
      {selectedDate && (
        <div className="slots-container">
          <h2>Available Slots on {selectedDate}</h2>
          <div className="slots">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((slot) => (
              <div
                key={slot}
                className={`slot ${
                  !isSlotAvailable(slot) ? 'booked' : selectedSlot === slot ? 'selected' : availableSlots.includes(slot) ? 'available' : 'booked'
                }`}
                onClick={() => handleSlotClick(slot)}
              >
                {`${slot + 7}:00 - ${slot + 8}:00`} {/* Display 8:00-9:00 as Slot 1, etc. */}
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
