import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

// Load config
const config = {
  rules: {
    tariffs: { memberDouble: 5250, yellowMultiplier: 1.1 },
    specialPeriods: [
      { start: "2025-10-17", end: "2025-11-02", type: "Diwali Season", color: "yellow" },
      { start: "2025-12-19", end: "2026-01-04", type: "Christmas Season", color: "yellow" }
    ]
  },
  rooms: [
    { Block: "A", "Room No": "A-1", Airconditioning: "No", "Wheel Chair Access": "Yes", "Pets Permitted": "No", "Group Booking Permitted": "Yes" },
    // Full list from previous; abbreviated
    { Block: "New E", "Room No": "E-7", Airconditioning: "Yes", "Wheel Chair Access": "Yes", "Pets Permitted": "No", "Group Booking Permitted": "No" }
  ],
  members: [
    { "Mem No": "001", Name: "John Doe", "Tel Mbl": "1234567890", Email: "john@example.com", "Due Amt": 0 },
    { "Mem No": "002", Name: "Jane Smith", "Tel Mbl": "0987654321", Email: "jane@example.com", "Due Amt": 500 },
    { "Mem No": "003", Name: "Demo User", "Tel Mbl": "1111111111", Email: "demo@example.com", "Due Amt": 0 }
  ],
  calendar: {
    start: "2025-10-25",
    specialPeriods: [
      { start: "2025-10-17", end: "2025-11-02", color: "yellow" }
    ],
    events: [
      { date: "2025-10-21", event: "Diwali", restricted: true, color: "red" },
      { date: "2025-10-25", event: "BBQ", restricted: false }
    ]
  }
};

const App = () => {
  const [date, setDate] = useState(new Date(2025, 9, 25));
  const [otpVerified, setOtpVerified] = useState(false);
  const [member, setMember] = useState(null);
  const [occupants, setOccupants] = useState({ members: 0, parents: 0, childrenUnder10: 0, childrenOver10: 0, tempBilling: 0, tempGeneral: 0, group: 0 });
  const [meals, setMeals] = useState({ veg: 0, nonVeg: 0 });
  const [totalOccupants, setTotalOccupants] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const total = Object.values(occupants).reduce((a, b) => a + b, 0);
    setTotalOccupants(total);
  }, [occupants]);

  const handleDuesCheck = (memNo) => {
    const m = config.members.find(m => m['Mem No'] === memNo);
    if (m && m['Due Amt'] > 0) alert(`Dues: ₹${m['Due Amt']}`);
    else {
      setOtpVerified(true);
      setMember(m ? m.Name : 'Demo');
    }
  };

  const handleConfirm = () => {
    if (meals.veg + meals.nonVeg !== totalOccupants) return alert('Fix meals!');
    alert('Email sent! Confirmed.');
  };

  return (
    <div className="app">
      <header style={{ textAlign: 'center', padding: '10px' }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: '150px' }} />
        <h1>The Club Mahabaleshwar Booking</h1>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];
              const isWeekend = date.getDay() === 5 || date.getDay() === 6;
              const isYellow = config.calendar.specialPeriods.some(p => {
                const start = new Date(p.start);
                const end = new Date(p.end);
                return date >= start && date <= end && p.color === 'yellow';
              });
              const isRed = config.calendar.events.some(e => e.date === dateStr && e.color === 'red');
              return <div style={{ background: isRed ? 'red' : isYellow ? 'yellow' : isWeekend ? 'orange' : 'white', height: '100%' }} />;
            }}
          />
        </div>
        <div>
          {!otpVerified ? (
            <div>
              <input placeholder="Membership No" onBlur={(e) => handleDuesCheck(e.target.value)} />
              <button onClick={() => handleDuesCheck('003')}>Demo</button>
            </div>
          ) : (
            <div>
              <h3>Welcome, {member}!</h3>
              {Object.keys(occupants).map(key => (
                <div key={key}>
                  <label>{key}: </label>
                  <select onChange={(e) => setOccupants({...occupants, [key]: +e.target.value})}>
                    {[0,1,2,3].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              ))}
              <div>
                Veg: <input type="number" value={meals.veg} onChange={(e) => setMeals({...meals, veg: +e.target.value})} />
                Non-Veg: <input type="number" value={meals.nonVeg} onChange={(e) => setMeals({...meals, nonVeg: +e.target.value})} />
              </div>
              <table>
                <tr><td>Total Occupants</td><td>{totalOccupants}</td></tr>
                <tr><td>Veg/Non-Veg</td><td>{meals.veg}/{meals.nonVeg}</td></tr>
                <tr><td>Total</td><td>₹{totalOccupants * config.rules.tariffs.memberDouble}</td></tr>
              </table>
              <button onClick={handleConfirm}>Confirm</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
