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
  const apiUrl = `https://8k14rd0005.execute-api.eu-west-2.amazonaws.com/Prod/getSlots?roomName=${roomName}`; // Adjust the API URL

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => console.error('Error fetching slots:', error));
  }, [roomName]);

  return (
    <div>
      <h1>{roomName} Availability</h1> {/* Display Room Name */}
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
