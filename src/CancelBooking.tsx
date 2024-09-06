// CancelBooking.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CancelBooking.css';
import config from './config.json';

const CancelBooking: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('Invalid token.');
      return;
    }

    // Call the backend API to cancel the booking using the token
    fetch(`${config.apiBaseUrl}/cancelBooking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStatus('Booking canceled successfully.');
        } else {
          setStatus('Failed to cancel the booking. ' + (data.message || ''));
        }
      })
      .catch((error) => {
        console.error('Error canceling booking:', error);
        setStatus('An error occurred while canceling the booking.');
      });
  }, [token]);

  return (
    <div className="cancel-booking-container">
      <h1>Cancel Booking</h1>
      {status ? <p>{status}</p> : <p>Processing your request...</p>}
    </div>
  );
};

export default CancelBooking;
