import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';  // Import QR code generator
import './RoomDisplay.css';

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const today = new Date().toISOString().split('T')[0]; // Get today's date
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
  }, [roomName]);

  const allSlots = Array.from({ length: 24 }, (_, i) => i + 8); // 8:00 - 23:00

  const bookingUrl = `https://yourdomain.com/${roomName}/book`; // Replace with your actual booking URL

  return (
    <div>
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
