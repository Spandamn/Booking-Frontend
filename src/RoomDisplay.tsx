import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';  // Import QR code generator
import config from './config.json';  // Assuming your API URLs are in this config file
import './RoomDisplay.css';

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const apiUrl = `${config.apiBaseUrl}/getSlots?roomName=${roomName}`;

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

  // Define slots from 8:00 to 23:00
  const allSlots = Array.from({ length: 16 }, (_, i) => i + 8);

  // Dynamically grab the frontend URL from the browser's address bar
  const bookingUrl = `${window.location.origin}/${roomName}/book`;

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
      <div className="legend">
        <div><span className="legend-color available"></span> Available</div>
        <div><span className="legend-color booked"></span> Booked</div>
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
