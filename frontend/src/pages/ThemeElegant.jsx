import React, { useState, useRef } from 'react';
import { Music, VolumeX, MapPin, Calendar, Clock, Heart, ChevronDown } from 'lucide-react';
import './ThemeElegant.css';

const ThemeElegant = ({ config, onRsvpSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', status: '', guests: 1, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const audioRef = useRef(null);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowContent(true);
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 1500);
    // Attempt auto play
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMusic = () => {
    if (isPlaying) { audioRef.current.pause(); } 
    else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.status) return alert('Please complete the required fields');
    setIsSubmitting(true);
    await onRsvpSubmit(formData);
    setFormData({ name: '', status: '', guests: 1, message: '' });
    setIsSubmitting(false);
  };

  const formattedDate = new Date(config.wedding_date).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="landing-page">
      <audio ref={audioRef} loop src="https://www.soundhelix.com/architecture/Audio-1.mp3" />

      {showContent && (
        <button className={`music-toggle ${!isPlaying ? 'paused' : ''}`} onClick={toggleMusic}>
          {isPlaying ? <Music size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="save-the-date">Pernikahan Dari</div>
        <h1 className="couple-names">{config.couple_names}</h1>
        {!isOpen ? (
          <>
            <div className="date-divider"></div>
            <button className="btn-open" onClick={handleOpen}>Buka Undangan</button>
          </>
        ) : (
          <div style={{ marginTop: '40px', animation: 'fadeIn 2s ease forwards', opacity: 0 }}>
            <p style={{ fontStyle: 'italic', color: 'var(--landing-gold-light)' }}>{formattedDate}</p>
            <ChevronDown size={32} color="var(--landing-gold)" style={{ marginTop: '20px', animation: 'fadeUp 1.5s infinite alternate' }} />
          </div>
        )}
      </section>

      {/* Content */}
      {showContent && (
        <>
          <section style={{ padding: '80px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.4)' }}>
            <Heart size={40} color="var(--landing-gold)" style={{ margin: '0 auto 24px', opacity: 0.8 }} />
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri..."
            </p>
          </section>

          <section className="details-section" id="events">
            <h2 className="section-heading">Rangkaian Acara</h2>
            <div className="events-grid">
              <div className="event-card">
                <div className="event-icon"><Calendar size={48} /></div>
                <h3 className="event-title">Akad Nikah</h3>
                <div className="event-time">08:00 WIB - Selesai</div>
                <p className="event-address" style={{ whiteSpace: 'pre-wrap' }}>
                  {config.akad_address}
                </p>
                {config.akad_maps && (
                  <button className="btn-map" onClick={() => window.open(config.akad_maps, '_blank')}><MapPin size={18} /> Google Maps</button>
                )}
              </div>

              <div className="event-card">
                <div className="event-icon"><Clock size={48} /></div>
                <h3 className="event-title">Resepsi</h3>
                <div className="event-time">11:00 WIB - 14:00 WIB</div>
                <p className="event-address" style={{ whiteSpace: 'pre-wrap' }}>
                  {config.resepsi_address}
                </p>
                {config.resepsi_maps && (
                  <button className="btn-map" onClick={() => window.open(config.resepsi_maps, '_blank')}><MapPin size={18} /> Google Maps</button>
                )}
              </div>
            </div>
          </section>

          {/* Gifts */}
          <section className="details-section" style={{ paddingTop: 0 }}>
            <h2 className="section-heading">Hadiah Pernikahan</h2>
            <div style={{ background: 'var(--landing-glass)', padding: '40px', borderRadius: '20px', border: '1px solid var(--landing-border)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cinzel", serif', marginBottom: '8px', color: 'var(--landing-gold)' }}>Transfer Bank</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{config.bank_name}</p>
                <p style={{ fontSize: '1.2rem', letterSpacing: '2px', margin: '4px 0' }}>{config.bank_account}</p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--landing-border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cinzel", serif', marginBottom: '8px', color: 'var(--landing-gold)' }}>Kirim Kado Secara Fisik</h3>
                <p style={{ fontSize: '1rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{config.gift_address}</p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="rsvp-section">
            <h2 className="section-heading">RSVP & Ucapan</h2>
            <form className="rsvp-form" onSubmit={handleSubmit}>
              <p style={{ marginBottom: '10px', color: 'var(--landing-gold-light)' }}>
                Kehadiran dan doa restu sangat kami nantikan.
              </p>
              
              <div className="form-group">
                <input required type="text" placeholder="Nama Lengkap" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="form-group">
                <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="" disabled>Status Kehadiran</option>
                  <option value="yes">Hadir</option>
                  <option value="no">Maaf, Tidak Bisa Hadir</option>
                  <option value="maybe">Masih Ragu-ragu</option>
                </select>
              </div>

              <div className="form-group">
                <select value={formData.guests} onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}>
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang</option>
                  <option value="3">3 Orang</option>
                </select>
              </div>

              <div className="form-group">
                <textarea rows="4" placeholder="Tulis ucapan dan doa..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-submit">
                {isSubmitting ? 'Mengirim...' : 'Kirim RSVP'}
              </button>
            </form>
          </section>

          {/* Footer */}
          <footer style={{ padding: '40px 20px', textAlign: 'center', background: '#0a0a0a', borderTop: '1px solid var(--landing-border)' }}>
            <Heart size={24} color="var(--landing-gold)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: '"Cinzel", serif', color: 'var(--landing-gold-light)' }}>{config.couple_names}</h3>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>Dibuat dengan ❤️ oleh Dasbor Uleman Digital</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default ThemeElegant;
