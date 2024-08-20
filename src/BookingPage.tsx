import React, { useState } from 'react';

interface BookingPageProps {
  roomName: string;
  availableSlots: string[];
}

const BookingPage: React.FC<BookingPageProps> = ({ roomName, availableSlots }) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedSlot && email) {
      alert(`Room ${roomName} booked for ${selectedSlot} by ${email}`);
      // Here, you'd normally handle the form submission, e.g., send data to a server
    } else {
      alert('Please select a time slot and enter your email.');
    }
  };

  return (
    <div className="container">
      <h1>{roomName}</h1>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="slot">Select a Time Slot:</label>
          <select
            id="slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="form-control"
          >
            <option value="">--Select a time slot--</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">Enter Your Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Book Room
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
