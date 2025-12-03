import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, MicOff, Calendar, Users, Utensils, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useVoice } from './useVoice';
import './index.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const { isListening, transcript, lastTranscript, isSpeaking, speak, startListening, setTranscript } = useVoice();

  const [step, setStep] = useState('GREETING'); // GREETING, GUESTS, DATE, TIME, CUISINE, SPECIAL, CONFIRM, FINISHED
  const [booking, setBooking] = useState({
    numberOfGuests: '',
    bookingDate: '',
    bookingTime: '',
    cuisinePreference: '',
    specialRequests: '',
    seatingPreference: 'any'
  });
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [textInput, setTextInput] = useState(''); // New state for text input

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  // Refactored processing to handle both voice and text
  const processUserInput = async (input) => {
    addMessage(input, 'user');
    const lowerInput = input.toLowerCase();

    switch (step) {
      // Step 0: Initial Greeting and Intent Recognition
      case 'GREETING':
        if (lowerInput.includes('book') || lowerInput.includes('reservation') || lowerInput.includes('table')) {
          setStep('GUESTS');
          const msg = "Great! How many guests will be dining?";
          addMessage(msg, 'agent');
          speak(msg);
        } else {
          const msg = "I can help you book a table. Just say 'I want to book a table'.";
          addMessage(msg, 'agent');
          speak(msg);
        }
        break;

      case 'GUESTS':
        const guests = lowerInput.match(/\d+/);
        if (guests) {
          setBooking(prev => ({ ...prev, numberOfGuests: parseInt(guests[0]) }));
          setStep('DATE');
          const msg = `Table for ${guests[0]}. What date would you like to book for? (e.g., tomorrow, next Friday)`;
          addMessage(msg, 'agent');
          speak(msg);
        } else {
          const msg = "I didn't catch the number. How many people?";
          addMessage(msg, 'agent');
          speak(msg);
        }
        break;

      case 'DATE':
        setBooking(prev => ({ ...prev, bookingDate: input }));

        try {
          const weatherRes = await axios.get(`${API_URL}/weather?date=${input}`);
          setWeather(weatherRes.data);

          let weatherMsg = "";
          if (weatherRes.data.condition === 'sunny') {
            weatherMsg = "The weather looks sunny! Would you prefer outdoor seating?";
          } else {
            weatherMsg = "It might rain. I recommend indoor seating. Is that okay?";
          }

          setStep('SEATING');
          addMessage(weatherMsg, 'agent');
          speak(weatherMsg);
        } catch (err) {
          console.error(err);
          setStep('TIME');
          const msg = "Got it. What time would you like?";
          addMessage(msg, 'agent');
          speak(msg);
        }
        break;

      case 'SEATING':
        if (lowerInput.includes('outdoor') || lowerInput.includes('outside')) {
          setBooking(prev => ({ ...prev, seatingPreference: 'outdoor' }));
        } else if (lowerInput.includes('indoor') || lowerInput.includes('inside')) {
          setBooking(prev => ({ ...prev, seatingPreference: 'indoor' }));
        }
        setStep('TIME');
        const timeMsg = "Noted. What time should I book the table for?";
        addMessage(timeMsg, 'agent');
        speak(timeMsg);
        break;

      case 'TIME':
        setBooking(prev => ({ ...prev, bookingTime: input }));
        setStep('CUISINE');
        const cuisineMsg = "Do you have a cuisine preference? (Italian, Chinese, Indian, etc.)";
        addMessage(cuisineMsg, 'agent');
        speak(cuisineMsg);
        break;

      case 'CUISINE':
        setBooking(prev => ({ ...prev, cuisinePreference: input }));
        setStep('SPECIAL');
        const specialMsg = "Any special requests? (Birthday, Anniversary, Dietary restrictions, or say None)";
        addMessage(specialMsg, 'agent');
        speak(specialMsg);
        break;

      case 'SPECIAL':
        setBooking(prev => ({ ...prev, specialRequests: input }));
        setStep('CONFIRM');
        const confirmMsg = "Please confirm your booking details shown on screen. Say 'Confirm' to finalize or 'Cancel' to start over.";
        addMessage(confirmMsg, 'agent');
        speak(confirmMsg);
        break;

      case 'CONFIRM':
        if (lowerInput.includes('confirm') || lowerInput.includes('yes')) {
          handleBookingSubmit();
        } else if (lowerInput.includes('cancel') || lowerInput.includes('no')) {
          setStep('GREETING');
          setBooking({});
          const cancelMsg = "Booking cancelled. How can I help you?";
          addMessage(cancelMsg, 'agent');
          speak(cancelMsg);
        }
        break;

      default:
        break;
    }
  };

  // Effect for Voice Input
  useEffect(() => {
    if (lastTranscript && !isSpeaking) {
      processUserInput(lastTranscript);
      setTranscript('');
    }
  }, [lastTranscript, isSpeaking, step, speak, setTranscript]); // Added step, speak, setTranscript to dependencies

  const onTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    processUserInput(textInput);
    setTextInput('');
  };

  const handleBookingSubmit = async () => {
    try {
      const finalBooking = { ...booking, weatherInfo: weather };
      await axios.post(`${API_URL}/bookings`, finalBooking);
      setStep('FINISHED');
      const finishMsg = "Booking confirmed! We look forward to seeing you.";
      addMessage(finishMsg, 'agent');
      speak(finishMsg);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      const errorMsg = "Sorry, there was an error creating your booking.";
      addMessage(errorMsg, 'agent');
      speak(errorMsg);
    }
  };

  const startFlow = () => {
    setStep('GREETING');
    const msg = "Hello! I'm your restaurant booking assistant. How can I help you today?";
    addMessage(msg, 'agent');
    speak(msg);
  };

  return (
    <div className="container">
      <h1>🍽️ Restaurant Voice Agent</h1>

      <div className="card">
        {step === 'FINISHED' ? (
          <div className="success-view">
            <CheckCircle size={64} color="#4ecdc4" />
            <h2>Booking Confirmed!</h2>
            <p>See you on {booking.bookingDate} at {booking.bookingTime}</p>
            <button className="btn" onClick={() => window.location.reload()}>Book Another</button>
          </div>
        ) : (
          <>
            <div className="status">
              {isListening ? 'Listening...' : 'Click microphone to speak'}
            </div>

            <button
              className={`btn ${isListening ? 'listening' : ''}`}
              onClick={startListening}
              disabled={isSpeaking}
            >
              {isListening ? <MicOff /> : <Mic />}
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>

            {step === 'CONFIRM' && (
              <div className="confirmation-box" style={{ textAlign: 'left', marginTop: '2rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h3>Confirm Details:</h3>
                <p><Users size={16} /> Guests: {booking.numberOfGuests}</p>
                <p><Calendar size={16} /> Date: {booking.bookingDate}</p>
                <p><Clock size={16} /> Time: {booking.bookingTime}</p>
                <p><Utensils size={16} /> Cuisine: {booking.cuisinePreference}</p>
                <p>✨ Special: {booking.specialRequests}</p>
                <p>🌤️ Seating: {booking.seatingPreference}</p>
              </div>
            )}

            <div className="chat-box">
              {messages.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>Start conversation by clicking the button...</p>}
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 0 && (
              <button className="btn" style={{ marginTop: '1rem', background: '#2d3436' }} onClick={startFlow}>
                Start Conversation
              </button>
            )}

            <form onSubmit={onTextSubmit} className="input-area">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your response..."
                disabled={isListening}
              />
              <button type="submit" disabled={!textInput.trim() || isListening}>Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
