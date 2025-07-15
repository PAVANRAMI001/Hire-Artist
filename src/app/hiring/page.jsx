'use client';

import { useEffect, useState } from 'react';
import ProfileSidebar from './profileSidebar';
import './hiring.css';

export default function HiringPage() {
  const [users, setUsers]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [role, setRole]                 = useState('All');
  const [search, setSearch]             = useState('');
  const [showSidebar, setShowSidebar]   = useState(false);

  /* ───── protect route ───── */
  useEffect(() => {
    fetch('/api/auth-user', { credentials: 'include' })
      .then(r => { if (!r.ok) window.location.href = '/login'; });
  }, []);

  /* ───── fetch artists ───── */
  useEffect(() => {
    fetch('/api/get-users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setFiltered(data);
      });
  }, []);

  /* ───── helpers ───── */
  const filterUsers = (s, r) => {
    const out = users.filter(u => {
      const nameMatch = u.name.toLowerCase().includes(s);
      const roleMatch = r === 'All' || u.roal.toLowerCase() === r.toLowerCase();
      return nameMatch && roleMatch;
    });
    setFiltered(out);
  };

  /* ───── handlers ───── */
  const onSearch = e => {
    const v = e.target.value.toLowerCase();
    setSearch(v);
    filterUsers(v, role);
  };

  const onRole = e => {
    const v = e.target.value;
    setRole(v);
    filterUsers(search, v);
  };

  return (
    <div className="hiring-container">
      {/* ───────── Navbar ───────── */}
      <div className="navbar">
        <h2 className="logo">🎨 HireArtists</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search artists…"
          value={search}
          onChange={onSearch}
        />

        <select className="role-filter" value={role} onChange={onRole}>
          <option value="All">All Roles</option>
          <option value="Singer">🎤 Singer</option>
          <option value="Drum Star">🥁 Drum Star</option>
          <option value="Harmonium">🎼 Harmonium</option>
          <option value="Piano">🎹 Piano</option>
        </select>

        <div className="profile-icon" onClick={() => setShowSidebar(!showSidebar)}>
          👤
        </div>
      </div>

      {showSidebar && (
        <div className="profile-sidebar">
          <ProfileSidebar onClose={() => setShowSidebar(false)} />
        </div>
      )}

      {/* ───────── Main ───────── */}
      <h1 className="hiring-title">🔥 Talented Artists for Hire</h1>

      <div className="card-grid">
        {filtered.map(u => (
          <div key={u._id} className="card">
            <img src={u.url} alt={u.name} className="card-image" />

            {/* details go inside .card-body so your CSS icons work */}
            <div className="card-body">
              <h2 className="card-name">{u.name}</h2>
              <p><strong>Role:</strong> {u.roal}</p>
              <p><strong>Rate:</strong> ₹{u.rate}/hr</p>
              <p><strong>Description:</strong> {u.description}</p>
              <p><strong>Phone:</strong> {u.phone}</p>
            </div>

            <a href={`/hiring/${u._id}`} className="profile-link">
              View Profile →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
