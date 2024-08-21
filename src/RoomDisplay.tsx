import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RoomDisplay.css';  // Import the CSS file

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const apiUrl = `https://6hpzr0hu27.execute-api.eu-west-2.amazonaws.com/Prod/getSlots?roomName=${roomName}`;

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setSlots(JSON.parse(xhr.responseText));
      } else if (xhr.readyState === 4) {
        console.error('Error fetching slots:', xhr.statusText);
      }
    };
    xhr.send();
  }, [roomName]);

  return (
    <div>
      <h1>{roomName} Availability</h1>
      <div className="slots">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`slot ${slot.Email ? 'booked' : 'available'}`}
          >
            {`${slot.Slot}:00 - ${slot.Slot + 1}:00`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDisplay;
