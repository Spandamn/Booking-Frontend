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
  const apiUrl = `your-api-url-here/getSlots?roomName=${roomName}`;

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

  // Get the current time in BST
  const now = new Date();
  const bstOffset = now.getTimezoneOffset() - 60; // BST is UTC+1
  const currentHourBST = new Date(now.getTime() - bstOffset * 60 * 1000).getHours();

  // Only show slots from the current hour and onwards
  const allSlots = Array.from({ length: 16 }, (_, i) => i + 8).filter(slot => slot >= currentHourBST);

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
                className={slots.some(s => s.Slot === slot) ? 'booked' : 'available'}
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
