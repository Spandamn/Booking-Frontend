import React, { useState, useEffect } from 'react';
import './CancelBooking.css'; // Importing the CSS file for styling
import config from './config.json'; // Config file with API URL

const CancelBooking: React.FC = () => {
  const [bookingToken, setBookingToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    setBookingToken(token);
  }, []);

  const handleCancelBooking = async () => {
    if (!bookingToken) {
      setStatus('Invalid booking token.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/cancelBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: bookingToken }),
      });

      if (response.ok) {
        setStatus('Booking successfully cancelled.');
      } else {
        const data = await response.json();
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setStatus('An error occurred while cancelling the booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-booking-container">
      <h1>Cancel Booking</h1>
      {status ? (
        <p className="status-message">{status}</p>
      ) : (
        <button className="cancel-button" onClick={handleCancelBooking} disabled={loading}>
          {loading ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}
    </div>
  );
};

export default CancelBooking;
