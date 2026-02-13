import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>Moto Taxi Admin</h1>
      <p>Login • Drivers list • Approvals • Trips list • Trip detail</p>
      <ul>
        <li>GET /api/admin/drivers</li>
        <li>POST /api/admin/drivers/:id/approve</li>
        <li>GET /api/admin/trips</li>
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
