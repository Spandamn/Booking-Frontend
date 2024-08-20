import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TimeSlots.css';

type Slot = {
  time: string;
  booked: boolean;
};

const generateTimeSlots = (): Slot[] => {
  const slots: Slot[] = [];
  for (let hour = 8; hour <= 23; hour++) {
    const time = `${hour}:00 - ${hour + 1}:00`;
    slots.push({ time, booked: Math.random() > 0.5 }); // Randomly mark slots as booked or available
  }
  return slots;
};

const TimeSlots: React.FC = () => {
  const [slots] = useState<Slot[]>(generateTimeSlots());

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 col-12 order-md-1 order-2">
          <table className="table table-bordered table-hover table-sm">
            <thead className="thead-light">
              <tr>
                <th>Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, index) => (
                <tr key={index}>
                  <td className={slot.booked ? 'table-danger text-center' : 'table-success text-center'}>
                    {slot.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4 col-12 order-md-2 order-1 qr-code-container d-flex justify-content-center align-items-center">
          <img src="https://via.placeholder.com/150" alt="QR Code" />
        </div>
      </div>
      <div className="text-center mt-4">
        <Link to="/booking" className="btn btn-primary">
          Book this Room
        </Link>
      </div>
    </div>
  );
};

export default TimeSlots;
