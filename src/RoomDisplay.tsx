import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
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

  const currentHour = new Date().getHours();
  const allSlots = Array.from({ length: 16 }, (_, i) => i + 8).filter(slot => slot >= currentHour); // 8:00 - 23:00 (16 hours)

  const bookingUrl = `${window.location.origin}/${roomName}/book`; // Get the current URL base

  return (
    <div className="container mt-4">
      <div className="room-display-container">
        <h1>{roomName} Availability</h1>
        <div className="legend d-flex justify-content-start mb-3">
          <div className="d-flex align-items-center">
            <span className="legend-box available"></span> Available
          </div>
          <div className="d-flex align-items-center ml-4">
            <span className="legend-box booked"></span> Booked
          </div>
        </div>
        <table className="table table-bordered">
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
        <div className="qr-code text-center mt-4">
          <h2>Book a Slot</h2>
          <QRCode value={bookingUrl} />
          <p>Scan this QR code to book a slot.</p>
        </div>
      </div>
    </div>
  );
};

export default RoomDisplay;
