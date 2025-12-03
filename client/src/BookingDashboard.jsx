import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, User, Clock, Calendar, ArrowLeft, MapPin, Cloud } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function BookingDashboard({ onBack }) {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API_URL}/bookings`);
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent triggering row click
        if (!window.confirm("Are you sure you want to delete this booking?")) return;

        try {
            await axios.delete(`${API_URL}/bookings/${id}`);
            setBookings(bookings.filter(b => b._id !== id));
            if (selectedBooking && selectedBooking._id === id) {
                setSelectedBooking(null);
            }
        } catch (err) {
            alert("Failed to delete booking");
        }
    };

    if (loading) return <div className="dashboard-loading">Loading bookings...</div>;

    if (selectedBooking) {
        return (
            <div className="booking-detail-view">
                <button className="btn-back" onClick={() => setSelectedBooking(null)}>
                    <ArrowLeft size={16} /> Back to List
                </button>

                <div className="detail-card">
                    <h2>{selectedBooking.customerName}</h2>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <Calendar size={20} />
                            <div>
                                <label>Date</label>
                                <p>{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <Clock size={20} />
                            <div>
                                <label>Time</label>
                                <p>{selectedBooking.bookingTime}</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <User size={20} />
                            <div>
                                <label>Guests</label>
                                <p>{selectedBooking.numberOfGuests} People</p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <MapPin size={20} />
                            <div>
                                <label>Table</label>
                                <p>Table #{selectedBooking.tableNumber} ({selectedBooking.seatingPreference})</p>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Preferences</h3>
                        <p><strong>Cuisine:</strong> {selectedBooking.cuisinePreference || 'None'}</p>
                        <p><strong>Special Requests:</strong> {selectedBooking.specialRequests || 'None'}</p>
                    </div>

                    {selectedBooking.weatherInfo && (
                        <div className="detail-section weather-section">
                            <h3><Cloud size={16} /> Weather Forecast</h3>
                            <p>Condition: {selectedBooking.weatherInfo.condition}</p>
                            <p>Temp: {selectedBooking.weatherInfo.temp}°C</p>
                        </div>
                    )}

                    <button className="btn-delete-large" onClick={(e) => handleDelete(e, selectedBooking._id)}>
                        Delete Booking
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Booking Management</h2>
                <button className="btn-back" onClick={onBack}>Back to Home</button>
            </div>

            {bookings.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking._id} className="booking-item" onClick={() => setSelectedBooking(booking)}>
                            <div className="booking-info">
                                <h3>{booking.customerName}</h3>
                                <p>{new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span className="badge">{booking.numberOfGuests} Guests</span>
                                    <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32' }}>Table #{booking.tableNumber}</span>
                                </div>
                            </div>
                            <button className="btn-icon-delete" onClick={(e) => handleDelete(e, booking._id)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookingDashboard;
