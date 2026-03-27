import React, { useState } from 'react';
import { Leaf, MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';
import './ThemeMinimalist.css';

const ThemeMinimalist = ({ config, onRsvpSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', status: '', guests: 1, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowContent(true);
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.status) return alert('Please complete the required fields');
    setIsSubmitting(true);
    await onRsvpSubmit(formData);
    setFormData({ name: '', status: '', guests: 1, message: '' });
    setIsSubmitting(false);
  };

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(config.wedding_date).toLocaleDateString('id-ID', dateOptions);

  return (
    <div className="theme-minimalist">
      <section className="min-hero">
        <div className="min-leaf-bg"></div>
        <div className="min-hero-content">
          <Leaf size={40} color="var(--min-accent)" style={{ margin: '0 auto 20px' }} />
          <h1 className="min-title">{config.couple_names}</h1>
          
          {!isOpen ? (
            <>
              <div className="min-date-box">{config.wedding_date.split('-').reverse().join(' . ')}</div>
              <button className="min-btn" onClick={handleOpen}>
                Buka Undangan
              </button>
            </>
          ) : (
            <div style={{ marginTop: '20px', animation: 'fadeIn 1s ease forwards' }}>
              <div className="min-date-box" style={{ animation: 'none', opacity: 1, border: 'none', fontSize: '1rem' }}>
                {formattedDate}
              </div>
              <ChevronDown 
                size={32} 
                color="var(--min-accent)" 
                style={{ marginTop: '10px', animation: 'fadeUp 1.5s infinite alternate' }} 
              />
            </div>
          )}
        </div>
      </section>

      {showContent && (
        <>
          <section className="min-section">
            <h2 className="min-heading" style={{ fontSize: '2rem' }}>Dengan Suka Cita Kami Mengundang Anda</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', lineHeight: 1.8 }}>
              Untuk berbagi kebahagiaan dan merayakan pernikahan kami dalam memulai babak baru kehidupan kami bersama.
            </p>
          </section>

          <section className="min-section" style={{ background: '#f9f8f4' }}>
            <h2 className="min-heading">Waktu & Tempat</h2>
            
            <div className="min-grid">
              <div className="min-card">
                <div className="min-card-icon"><Calendar size={32} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontFamily: '"Cormorant Garamond", serif' }}>Akad Nikah</h3>
                <p style={{ color: 'var(--min-accent)', fontWeight: 500, marginBottom: '20px' }}>08:00 WIB</p>
                <p style={{ lineHeight: 1.6, color: '#666', whiteSpace: 'pre-wrap' }}>
                  {config.akad_address}
                </p>
                {config.akad_maps && (
                  <button className="min-btn-outline" onClick={() => window.open(config.akad_maps, '_blank')}><MapPin size={16} style={{ display: 'inline', marginRight: '6px' }}/> Lihat Peta</button>
                )}
              </div>

              <div className="min-card">
                <div className="min-card-icon"><Clock size={32} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontFamily: '"Cormorant Garamond", serif' }}>Resepsi</h3>
                <p style={{ color: 'var(--min-accent)', fontWeight: 500, marginBottom: '20px' }}>11:00 WIB</p>
                <p style={{ lineHeight: 1.6, color: '#666', whiteSpace: 'pre-wrap' }}>
                  {config.resepsi_address}
                </p>
                {config.resepsi_maps && (
                  <button className="min-btn-outline" onClick={() => window.open(config.resepsi_maps, '_blank')}><MapPin size={16} style={{ display: 'inline', marginRight: '6px' }}/> Lihat Peta</button>
                )}
              </div>
            </div>
          </section>

          <section className="min-section">
            <h2 className="min-heading">Hadiah Pernikahan</h2>
            <div className="min-card" style={{ maxWidth: '600px', margin: '0 auto', background: '#fdfcfb' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cormorant Garamond", serif', marginBottom: '8px', color: 'var(--min-accent)' }}>Transfer Bank</h3>
              <p style={{ fontWeight: 600, color: 'var(--min-text)' }}>{config.bank_name}</p>
              <p style={{ color: '#666', letterSpacing: '1px' }}>{config.bank_account}</p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--min-border)', margin: '24px 0' }} />
              
              <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cormorant Garamond", serif', marginBottom: '8px', color: 'var(--min-accent)' }}>Kirim Kado Fisik</h3>
              <p style={{ color: '#666', whiteSpace: 'pre-wrap' }}>{config.gift_address}</p>
            </div>
          </section>

          <section className="min-rsvp min-section">
            <h2 className="min-heading">Buku Tamu / RSVP</h2>
            <form className="min-form" onSubmit={handleSubmit}>
              <input required type="text" className="min-input" placeholder="Nama Lengkap" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              
              <select required className="min-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="" disabled>Status Kehadiran?</option>
                <option value="yes">Hadir</option>
                <option value="no">Maaf, Tidak Bisa Hadir</option>
                <option value="maybe">Masih Ragu-ragu</option>
              </select>

              <select className="min-input" value={formData.guests} onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}>
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
              </select>

              <textarea className="min-input" rows="4" placeholder="Tulis ucapan dan doa restu..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              <button type="submit" disabled={isSubmitting} className="min-btn" style={{ width: '100%' }}>
                {isSubmitting ? 'Mengirim...' : 'Kirim RSVP'}
              </button>
            </form>
          </section>

          <footer style={{ padding: '40px 20px', textAlign: 'center', background: 'white' }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: 'var(--min-accent)' }}>
              {config.couple_names.split('&').map(n => n.trim().charAt(0)).join(' & ')}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>Design by Uleman Digital Dashboard</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default ThemeMinimalist;
