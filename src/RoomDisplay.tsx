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

  // Calculate available slots based on the current time
  const allSlots = Array.from({ length: 16 }, (_, i) => i + 1).filter(
    (slot) => {
      const slotStartHour = slot + 7; // Since Slot 1 corresponds to 8:00 AM
      return slotStartHour >= currentHour;
    }
  );

  // Fetch slots for the current date only
  useEffect(() => {
    document.title = `${roomName} Bookings`;
    const apiUrl = `${config.apiBaseUrl}/getSlots?roomName=${roomName}&date=${currentDate}`;
    console.log(`Fetching slots from API: ${apiUrl}`);
    
    fetch(apiUrl)
      .then((response) => {
        console.log('Received response from API:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received slot data:', data);
        setSlots(data);
      })
      .catch((error) => console.error('Error fetching slots:', error.message));
  }, [roomName, currentDate]);

  const isSlotBooked = (slot: number): boolean => {
    const booked = slots.some(s => s.Slot === slot);
    console.log(`Slot ${slot} is ${booked ? 'booked' : 'available'}`);
    return booked;
  };

  const bookingUrl = `${window.location.origin}/${roomName}/book`;

  return (
    <div className="room-display-container">
      <h1>{roomName} Availability</h1>
      <div className="qr-code">
        <h2>Book a Slot</h2>
        <QRCode value={bookingUrl} size={200}/>
        <p>Scan this QR code to book a slot.</p>
      </div>
      <div className="legend">
        <div>
          <div className="legend-box available"></div> Available
        </div>
        <div>
          <div className="legend-box booked"></div> Booked
        </div>
      </div>
      <div className="slots-container">
        {allSlots.map((slot) => (
          <div
            key={slot}
            className={`slot ${isSlotBooked(slot) ? 'booked' : 'available'}`}
          >
            {`${slot + 7}:00 - ${slot + 8}:00`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDisplay;
