import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'qrcode.react';  // Import QR code generator
import './RoomDisplay.css';  // Import the CSS file

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const apiUrl = `https://08pob7kjhg.execute-api.eu-west-2.amazonaws.com/Prod/getSlots?roomName=${roomName}`;
  const bookingUrl = `/booking/${roomName}/book`; // Link to your booking page

  useEffect(() => {
    fetch(apiUrl, { mode: 'cors' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => console.error('Error fetching slots:', error.message));
  }, [roomName]);

  const allSlots = Array.from({ length: 16 }, (_, i) => i + 8); // Slots from 8:00 to 23:00
  const bookedSlots = slots.map(slot => slot.Slot);

  return (
    <div className="room-display-container">
      <h1>{roomName} Availability</h1>
      <div className="slots">
        {allSlots.map((slot) => (
          <div
            key={slot}
            className={`slot ${bookedSlots.includes(slot) ? 'booked' : 'available'}`}
          >
            {`${slot}:00 - ${slot + 1}:00`}
          </div>
        ))}
      </div>
      <div className="qr-code">
        <h2>Book a Slot</h2>
        <QRCode value={window.location.origin + bookingUrl} />
        <p>Scan the QR code or <Link to={bookingUrl}>click here</Link> to book a slot.</p>
      </div>
    </div>
  );
};

export default RoomDisplay;
