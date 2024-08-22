import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './RoomDisplay.css';
import config from './config.json';

interface Slot {
  Slot: number;
  Email: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);

  // Get current hour and today's date
  const currentHour = new Date().getHours();
  const currentDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  // Slots from 8:00 AM (slot 1) to 11:00 PM (slot 16)
  const allSlots = Array.from({ length: 16 }, (_, i) => i + 8).filter(
    (slot) => slot > currentHour
  );

  // Fetch slots for the current date only
  useEffect(() => {
    const apiUrl = `${config.apiBaseUrl}/getSlots?roomName=${roomName}&date=${currentDate}`;
    
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setSlots(data))
      .catch((error) => console.error('Error fetching slots:', error.message));
  }, [roomName, currentDate]);

  const isSlotBooked = (slot: number): boolean => {
    // Check if the slot is booked
    return slots.some(s => s.Slot === slot);
  };

  const bookingUrl = `${window.location.origin}/${roomName}/book`;

  return (
    <div className="room-display-container">
      <h1>{roomName} Availability</h1>
      <div className="legend">
        <div>
          <div className="legend-box available"></div> Available
        </div>
        <div>
          <div className="legend-box booked"></div> Booked
        </div>
      </div>
      <table className="slots-table">
        <tbody>
          {allSlots.map((slot) => (
            <tr key={slot}>
              <td
                className={isSlotBooked(slot) ? 'booked' : 'available'}
              >
                {`${slot}:00 - ${slot + 1}:00`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="qr-code">
        <h2>Book a Slot</h2>
        <QRCode value={bookingUrl} />
        <p>Scan this QR code to book a slot.</p>
      </div>
    </div>
  );
};

export default RoomDisplay;
