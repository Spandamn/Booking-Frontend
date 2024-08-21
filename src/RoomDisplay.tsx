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
  const apiUrl = `https://08pob7kjhg.execute-api.eu-west-2.amazonaws.com/Prod/getSlots?roomName=${roomName}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchData();
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
