import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookingPage.css';
import config from './config.json';
import '../bootstrap/dist/css/bootstrap.min.css';

interface Slot {
  Slot: number;
  Email?: string;
  Date: string;
}

const BookingPage: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [showSlots, setShowSlots] = useState<boolean>(false);

  const handleFetchSlots = () => {
    if (selectedDate) {
      const apiUrl = `${config.apiBaseUrl}/getSlots?roomName=${roomName}&date=${selectedDate}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const booked = data.map((slot: Slot) => slot.Slot);
          const allSlots = Array.from({ length: 16 }, (_, i) => i + 1);
          const freeSlots = allSlots.filter(slot => !booked.includes(slot));
          setAvailableSlots(freeSlots);
          setBookedSlots(booked);
          setShowSlots(true);
        })
        .catch((error) => console.error('Error fetching available slots:', error));
    }
  };

  const handleSlotClick = (slot: number) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
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

  const currentHour = new Date().getHours();

  return (
    <div className="booking-page container">
      <h1 className="text-center my-4">Book a Slot in {roomName}</h1>
      <div className="date-picker form-group text-center mb-4">
        <label htmlFor="date-input" className="mr-3">Select a Date:</label>
        <input
          id="date-input"
          className="form-control d-inline-block"
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setShowSlots(false);
          }}
          style={{ width: 'auto', display: 'inline-block' }}
        />
        <button onClick={handleFetchSlots} className="btn btn-primary ml-3">
          Fetch Available Slots
        </button>
      </div>
      {showSlots && selectedDate && (
        <div className="slots-container text-center">
          <h2>Available Slots on {selectedDate}</h2>
          <div className="d-flex justify-content-center">
            <div className="slots d-flex flex-wrap justify-content-center">
              {Array.from({ length: 16 }, (_, i) => i + 1)
                .filter(slot => selectedDate !== new Date().toISOString().split('T')[0] || slot + 7 >= currentHour)
                .map((slot) => (
                  <div
                    key={slot}
                    className={`slot btn ${bookedSlots.includes(slot) ? 'btn-danger' : selectedSlot === slot ? 'btn-warning' : 'btn-success'} m-2`}
                    onClick={() => !bookedSlots.includes(slot) && handleSlotClick(slot)}
                    style={{ width: 'auto', padding: '10px 15px', minWidth: '120px' }}
                  >
                    {`${slot + 7}:00 - ${slot + 8}:00`}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {showSlots && (
        <div className="email-input form-group text-center mt-4">
          <label htmlFor="email-input">Enter your Email:</label>
          <input
            id="email-input"
            className="form-control mx-auto"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <button onClick={handleBookingSubmit} className="btn btn-primary mt-3">Book Slot</button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
