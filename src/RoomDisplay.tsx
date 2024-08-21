import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import config from './config.json';
import './RoomDisplay.css';

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const todayDate = new Date().toISOString().split('T')[0];
  const apiUrl = `${config.apiBaseUrl}/getSlots?roomName=${roomName}&date=${todayDate}`;

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

  const bookingUrl = `${config.apiBaseUrl}/${roomName}/book`;

  return (
    <div className="room-display-container">
      <h1>{roomName} Availability</h1>
      <div className="legend">
        <div><span className="legend-box available"></span>Available</div>
        <div><span className="legend-box booked"></span>Booked</div>
      </div>
      <table className="slots-table">
        <tbody>
          {allSlots.map((slot, index) => (
            <tr key={index}>
              <td className={slots.some(s => s.Slot === slot) ? 'booked' : 'available'}>
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
