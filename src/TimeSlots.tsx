// src/TimeSlots.tsx

import React, { useEffect, useState } from 'react';

interface Slot {
  Slot: number;
  Email: string;
  Date: string;
}

const RoomDisplay: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const apiUrl = 'https://6hpzr0hu27.execute-api.eu-west-2.amazonaws.com/Prod'; // Replace with your API Gateway URL

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setSlots(data);
      })
      .catch((error) => console.error('Error fetching slots:', error));
  }, []);

  return (
    <div>
      <h1>Room 1 Availability</h1> {/* Change Room 1 as needed */}
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
