"use client";
import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Heart,
  LayoutDashboard, 
  Users, 
  Mail, 
  Settings, 
  Bell,
  MoreVertical,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  MailWarning
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const API_URL = '/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [config, setConfig] = useState({ couple_names: '', wedding_date: '', theme: 'elegant' });
  const [rsvps, setRsvps] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Fake simple Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('admin_logged_in') === 'true');
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '' });

  // Fetch initial data
  useEffect(() => {
    fetchConfig();
    fetchRsvps();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/config`);
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch config', err);
    }
  };

  const fetchRsvps = async () => {
    try {
      const res = await fetch(`${API_URL}/rsvps`);
      const data = await res.json();
      setRsvps(data);
    } catch (err) {
      console.error('Failed to fetch RSVPs', err);
    }
  };

  const saveConfig = async (newConfig) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      if (res.ok) {
        setConfig(prev => ({ ...prev, ...newConfig }));
        // Cross-tab communication to seamlessly update Live Preview tabs automatically
        if (newConfig.theme) {
           localStorage.setItem('uleman_theme', newConfig.theme);
        }
        localStorage.setItem('uleman_config_sync', Date.now().toString());
        window.dispatchEvent(new Event('storage'));    
        
        // Show Success Toast
        setToast({ show: true, message: 'Berhasil! Data telah diperbarui dan di-sinkronisasi ke backend.' });
        setTimeout(() => setToast({ show: false, message: '' }), 4000);
      }
    } catch (err) {
      console.error('Error saving config', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Dynamic Statistics
  const totalAttending = rsvps.filter(r => r.status === 'yes').reduce((acc, curr) => acc + curr.guests, 0);
  const totalDeclined = rsvps.filter(r => r.status === 'no').length;
  const totalPending = rsvps.filter(r => r.status === 'maybe').length; // Fallback "maybe" for our stats, though landing form has 'yes'/'no'
  
  // Create pie chart data dynamically
  const rsvpStats = [
    { name: 'Attending', value: totalAttending || 1, color: '#10b981' }, // Ensure piece renders
    { name: 'Pending', value: totalPending || 0, color: '#f59e0b' },
    { name: 'Declined', value: totalDeclined || 0, color: '#ef4444' },
  ];

  // Auth Functions
  const handleLogin = (e) => {
    e.preventDefault();
    if (config && loginForm.user === (config.admin_username || 'admin') && loginForm.pass === (config.admin_password || 'admin')) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_logged_in', 'true');
      setShowUserMenu(false);
    } else {
      alert('Invalid credentials. (Hint: admin / admin)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    setShowUserMenu(false);
    setLoginForm({ user: '', pass: '' });
  };

  if (!isLoggedIn) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: 'rgba(30,41,59,0.5)', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <HeartHandshake size={32} color="white" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Login</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>Enter your admin credentials to access</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>Username (admin)</label>
              <input required type="text" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>Password (admin)</label>
              <input required type="password" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} />
            </div>
            <button type="submit" style={{ background: '#3b82f6', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 600, marginTop: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Activity data calculated dynamically from the last 7 days of RSVPs
  const calculateActivityData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const count = rsvps.filter(r => {
        const rDate = new Date(r.created_at);
        return rDate.getDate() === d.getDate() && 
               rDate.getMonth() === d.getMonth() && 
               rDate.getFullYear() === d.getFullYear();
      }).length;
      
      data.push({ day: dayName, rsvps: count });
    }
    return data;
  };
  const activityData = rsvps.length > 0 ? calculateActivityData() : [
    { day: 'Mon', rsvps: 0 }, { day: 'Tue', rsvps: 0 }, { day: 'Wed', rsvps: 0 },
    { day: 'Thu', rsvps: 0 }, { day: 'Fri', rsvps: 0 }, { day: 'Sat', rsvps: 0 }, { day: 'Sun', rsvps: 0 },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Heart size={20} />
          </div>
          <div className="logo-text">Uleman Digital</div>
        </div>
        
        <nav className="nav-links">
          <a className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dasbor
          </a>
          <a className={`nav-item ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => setActiveTab('guests')}>
            <Users size={20} /> Daftar Tamu
          </a>
          <a className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <Mail size={20} /> Pesan & Doa
          </a>
          <a className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Pengaturan
          </a>
          <a className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <Settings size={20} /> Profil Admin
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>{config.couple_names || 'Your Wedding'}</h1>
            <p>Welcome back! Here's the latest update for your invitation.</p>
          </div>
          <div className="user-profile" style={{ position: 'relative' }}>
            <button 
              className="action-btn" 
              style={{ position: 'relative' }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              {rsvps.length > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -2, background: '#ef4444', 
                  width: 10, height: 10, borderRadius: '50%', border: '2px solid #0f172a'
                }}></span>
              )}
            </button>
            <div 
              className="avatar" 
              style={{ cursor: 'pointer', transition: 'all 0.2s', border: showUserMenu ? '2px solid #3b82f6' : 'none' }}
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${config.admin_name || 'Admin'}`} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                width: '220px',
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                padding: '8px',
                zIndex: 100,
                animation: 'fadeInDown 0.2s ease forwards'
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '4px' }}>
                  <p style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', margin: 0 }}>{config.admin_name || 'Administrator'}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '2px 0 0 0' }}>{config.admin_email || 'admin@uleman.com'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button 
                    style={{ background: 'transparent', border: 'none', color: '#f8fafc', padding: '8px 12px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', width: '100%', fontSize: '0.9rem' }}
                    onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.target.style.background = 'transparent'}
                    onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                  >
                    Pengaturan Profil
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '8px 12px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', width: '100%', fontSize: '0.9rem' }}
                    onMouseOver={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseOut={e => e.target.style.background = 'transparent'}
                  >
                    Keluar (Log Out)
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                width: '320px',
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                padding: '16px',
                zIndex: 100,
                animation: 'fadeInDown 0.3s ease forwards'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                  <h4 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Latest Visitors</h4>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>{rsvps.length} Total</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                  {rsvps.slice(0, 5).map(guest => (
                    <div key={guest.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ background: guest.status === 'yes' ? 'rgba(16,185,129,0.2)' : guest.status === 'no' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)', color: guest.status === 'yes' ? '#10b981' : '#ef4444', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {guest.status === 'yes' ? <CheckCircle size={18} /> : guest.status === 'no' ? <XCircle size={18} /> : <HelpCircle size={18} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 500, margin: 0 }}>{guest.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                          {guest.status === 'yes' ? `Confirmed (${guest.guests} guests)` : guest.status === 'no' ? 'Declined' : 'Pending'} • {new Date(guest.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {rsvps.length === 0 && (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', margin: '20px 0' }}>No new RSVPs right now...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card" style={{ animationDelay: '0.1s' }}>
                <div className="stat-info">
                  <h3>Total Forms</h3>
                  <div className="value">{rsvps.length}</div>
                </div>
                <div className="stat-icon total"><Users size={24} /></div>
              </div>
              <div className="stat-card" style={{ animationDelay: '0.2s' }}>
                <div className="stat-info">
                  <h3>Going Guests</h3>
                  <div className="value">{totalAttending}</div>
                </div>
                <div className="stat-icon attending"><CheckCircle size={24} /></div>
              </div>
              <div className="stat-card" style={{ animationDelay: '0.3s' }}>
                <div className="stat-info">
                  <h3>Pending/Others</h3>
                  <div className="value">{totalPending}</div>
                </div>
                <div className="stat-icon pending"><HelpCircle size={24} /></div>
              </div>
              <div className="stat-card" style={{ animationDelay: '0.4s' }}>
                <div className="stat-info">
                  <h3>Declined</h3>
                  <div className="value">{totalDeclined}</div>
                </div>
                <div className="stat-icon declined"><XCircle size={24} /></div>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="dashboard-grid">
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ animationDelay: '0.5s' }}>
                  <div className="card-header">
                    <div className="card-title"><TrendingUp size={20} className="text-accent-primary" /> RSVP Activity</div>
                  </div>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#f8fafc' }} />
                        <Line type="monotone" dataKey="rsvps" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Guest Table */}
                <div className="card" style={{ animationDelay: '0.6s' }}>
                  <div className="card-header">
                    <div className="card-title"><Users size={20} /> Recent Visitors</div>
                    <button className="action-btn" style={{ fontSize: '0.85rem', color: '#3b82f6' }}>View All</button>
                  </div>
                  <div className="guest-table-wrapper">
                    <table className="guest-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Guests</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rsvps.slice(0, 5).map((guest) => (
                          <tr key={guest.id}>
                            <td style={{ fontWeight: 500, color: '#f8fafc' }}>{guest.name}</td>
                            <td>
                              <span className={`status-badge ${guest.status === 'yes' ? 'attending' : guest.status === 'no' ? 'declined' : 'pending'}`}>
                                {guest.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ color: '#94a3b8' }}>{guest.guests}</td>
                            <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                              {new Date(guest.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {rsvps.length === 0 && (
                          <tr><td colSpan="4" style={{ textAlign: 'center', opacity: 0.5 }}>No visitors yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card" style={{ animationDelay: '0.7s', flex: 1 }}>
                  <div className="card-header">
                    <div className="card-title"><LayoutDashboard size={20} /> RSVP Overview</div>
                  </div>
                  <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={rsvpStats} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                          {rsvpStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#f8fafc' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card" style={{ animationDelay: '0.8s', flex: 1 }}>
                  <div className="card-header">
                    <div className="card-title"><MailWarning size={20} /> Latest Greetings</div>
                  </div>
                  <div className="rsvp-list">
                    {rsvps.filter(g => g.message).slice(0, 4).map((guest) => (
                      <div className="rsvp-item" key={guest.id}>
                        <div className="rsvp-avatar">{guest.name.charAt(0)}</div>
                        <div className="rsvp-content">
                          <div className="rsvp-header">
                            <span className="rsvp-name">{guest.name}</span>
                          </div>
                          <div className="rsvp-message">"{guest.message}"</div>
                        </div>
                      </div>
                    ))}
                    {rsvps.filter(g => g.message).length === 0 && (
                      <p style={{ opacity: 0.5, textAlign: 'center', fontSize: '0.9rem' }}>No greetings yet</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Guest List Tab */}
        {activeTab === 'guests' && (
          <div className="card" style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div className="card-header">
              <div className="card-title">
                <Users size={20} className="text-accent-primary" /> Full Guest List Data
              </div>
            </div>
            
            <div className="guest-table-wrapper" style={{ marginTop: '20px' }}>
              <table className="guest-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Attendance Status</th>
                    <th>Guests Amount</th>
                    <th>Submission Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((guest, index) => (
                    <tr key={guest.id || index}>
                      <td style={{ color: '#94a3b8' }}>{index + 1}</td>
                      <td style={{ fontWeight: 500, color: '#f8fafc' }}>{guest.name}</td>
                      <td>
                        <span className={`status-badge ${guest.status === 'yes' ? 'attending' : guest.status === 'no' ? 'declined' : 'pending'}`}>
                          {guest.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8' }}>{guest.guests}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {new Date(guest.created_at).toLocaleString()}
                      </td>
                      <td>
                        <button className="action-btn"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', opacity: 0.5 }}>No data found in backend.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={24} className="text-accent-primary" /> All Guests Greetings & Prayers
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {rsvps.filter(g => g.message).map(guest => (
                <div key={guest.id} className="card" style={{ padding: '24px', animation: 'fadeInUp 0.6s ease backwards', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="avatar" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {guest.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{guest.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(guest.created_at).toLocaleDateString()} at {new Date(guest.created_at).toLocaleTimeString([], {timeStyle: 'short'})}</div>
                      </div>
                    </div>
                    <div>
                      <span className={`status-badge ${guest.status === 'yes' ? 'attending' : guest.status === 'no' ? 'declined' : 'pending'}`} style={{ fontSize: '0.7rem' }}>
                        {guest.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#cbd5e1', flex: 1, fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    "{guest.message}"
                  </div>
                </div>
              ))}
              {rsvps.filter(g => g.message).length === 0 && (
                 <p style={{ opacity: 0.5, gridColumn: '1 / -1', textAlign: 'center' }}>No messages available in database yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab / Theme Configurator */}
        {activeTab === 'settings' && (
          <div className="card" style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div className="card-header">
              <div className="card-title">
                <Settings size={20} className="text-accent-primary" /> Configuration & Themes
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ marginBottom: '16px', fontWeight: 500, color: '#f8fafc' }}>Website Theme</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>Choose a layout and design for your digital invitation.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div onClick={() => saveConfig({ theme: 'elegant' })}
                    style={{
                      border: config.theme === 'elegant' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                      padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s',
                      background: config.theme === 'elegant' ? 'rgba(59,130,246,0.1)' : 'transparent'
                    }}>
                    <div style={{ background: '#111', width: '60px', height: '60px', borderRadius: '8px', border: '2px solid #c5a880' }}></div>
                    <div>
                      <h4 style={{ fontWeight: 600, color: '#f8fafc' }}>Elegant Gold (Dark)</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Luxurious, dark aesthetic</p>
                    </div>
                  </div>

                  <div onClick={() => saveConfig({ theme: 'minimalist' })}
                    style={{
                      border: config.theme === 'minimalist' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                      padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s',
                      background: config.theme === 'minimalist' ? 'rgba(59,130,246,0.1)' : 'transparent'
                    }}>
                    <div style={{ background: '#fdfcfb', width: '60px', height: '60px', borderRadius: '8px', border: '2px solid #78866b' }}></div>
                    <div>
                      <h4 style={{ fontWeight: 600, color: '#f8fafc' }}>Sage Minimalist (Light)</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Clean, elegant white and green</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ marginBottom: '16px', fontWeight: 500, color: '#f8fafc' }}>Informasi Acara</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h4 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Pasangan & Tanggal</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Nama Pasangan</label>
                        <input type="text" value={config.couple_names || ''} onChange={(e) => setConfig({...config, couple_names: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Tanggal Pernikahan</label>
                        <input type="date" value={config.wedding_date || ''} onChange={(e) => setConfig({...config, wedding_date: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                      </div>
                    </div>
                  </div>

                  {/* Akad Info */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#f8fafc', marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Alamat Akad Nikah</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Detail Alamat</label>
                        <textarea rows="3" value={config.akad_address || ''} onChange={(e) => setConfig({...config, akad_address: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}></textarea>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Tautan Google Maps</label>
                        <input type="text" value={config.akad_maps || ''} onChange={(e) => setConfig({...config, akad_maps: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                      </div>
                    </div>
                  </div>

                  {/* Resepsi Info */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ color: '#f8fafc', marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Resepsi Pernikahan</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Detail Alamat</label>
                        <textarea rows="3" value={config.resepsi_address || ''} onChange={(e) => setConfig({...config, resepsi_address: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}></textarea>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Tautan Google Maps</label>
                        <input type="text" value={config.resepsi_maps || ''} onChange={(e) => setConfig({...config, resepsi_maps: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                      </div>
                    </div>
                  </div>

                  {/* Gifts Info */}
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Hadiah Pernikahan</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Nama Bank / Tujuan</label>
                          <input type="text" value={config.bank_name || ''} onChange={(e) => setConfig({...config, bank_name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Nomor Rekening</label>
                          <input type="text" value={config.bank_account || ''} onChange={(e) => setConfig({...config, bank_account: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Alamat Pengiriman Kado Balasan (Fisik)</label>
                        <textarea rows="3" value={config.gift_address || ''} onChange={(e) => setConfig({...config, gift_address: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}></textarea>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn-submit" 
                    onClick={() => saveConfig(config)}
                    disabled={isSaving}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
                    {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="card" style={{ animation: 'fadeInUp 0.5s ease', maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
              <div className="card-title">
                <Settings size={20} className="text-accent-primary" /> Admin Profile Settings
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${config.admin_name || 'Admin'}`} alt="Profile" style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                   <h3 style={{ margin: 0, color: '#f8fafc', fontWeight: 600, fontSize: '1.2rem' }}>{config.admin_name || 'Administrator'}</h3>
                   <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{config.admin_username || 'admin'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Full Name</label>
                    <input type="text" value={config.admin_name || ''} onChange={(e) => setConfig({...config, admin_name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Email Address</label>
                    <input type="email" value={config.admin_email || ''} onChange={(e) => setConfig({...config, admin_email: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Dashboard Username</label>
                  <input type="text" value={config.admin_username || ''} onChange={(e) => setConfig({...config, admin_username: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                </div>
                
                <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', marginTop: '8px' }}>
                  <h4 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '0.95rem', fontWeight: 600 }}>Security: Update Password</h4>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>New Password</label>
                  <input type="text" placeholder="Leave empty to keep current password" value={config.admin_password || ''} onChange={(e) => setConfig({...config, admin_password: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '8px' }}>*Warning: Changing this will require you to use this new password on your next login.</p>
                </div>

                <button 
                  className="btn-submit" 
                  onClick={() => saveConfig(config)}
                  disabled={isSaving}
                  style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '16px' }}>
                  {isSaving ? 'Updating Profile...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px', 
          background: 'rgba(16, 185, 129, 0.9)', backdropFilter: 'blur(10px)',
          color: 'white', padding: '16px 24px', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '12px',
          animation: 'fadeInUp 0.4s ease forwards', zIndex: 1000,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{toast.message}</span>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
