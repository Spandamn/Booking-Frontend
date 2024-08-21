import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './RoomDisplay.css';

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);

  const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
  const apiUrl = `https://08pob7kjhg.execute-api.eu-west-2.amazonaws.com/Prod/getSlots?roomName=${roomName}&date=${today}`;

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSlots(data))
      .catch((error) => console.error('Error fetching slots:', error.message));
  }, [roomName, today]);

  const allSlots = Array.from({ length: 24 }, (_, i) => i + 1);  // Slots from 1 to 24 representing hours

  const bookingUrl = `https://yourdomain.com/${roomName}/book`;

  return (
    <div className="room-display-container">
      <h1>{roomName} Availability</h1>
      <div className="slots">
        {allSlots.map((slot, index) => (
          <div
            key={index}
            className={`slot ${slots.some(s => s.Slot === slot) ? 'booked' : 'available'}`}
          >
            {`${slot}:00 - ${slot + 1}:00`}
          </div>
        ))}
      </div>
      <div className="qr-code">
        <h2>Book a Slot</h2>
        <QRCode value={bookingUrl} />
        <p>Scan this QR code to book a slot.</p>
      </div>
    </div>
  );
};

export default RoomDisplay;
