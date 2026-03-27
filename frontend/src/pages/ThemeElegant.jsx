import React, { useState, useRef, useEffect } from 'react';
import AOS from 'aos';
import { Music, VolumeX, MapPin, Calendar, Clock, Heart, ChevronDown } from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';
import './ThemeElegant.css';
import bgm from "../assets/I'm always with you.mp3";

const ThemeElegant = ({ config, onRsvpSubmit, rsvps = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Extract guest name from URL
  const urlParams = new URLSearchParams(window.location.search);
  let initialGuestName = urlParams.get('to');
  if (!initialGuestName && window.location.pathname.startsWith('/to=')) {
    initialGuestName = window.location.pathname.replace('/to=', '');
  }
  const decodedGuestName = initialGuestName ? decodeURIComponent(initialGuestName).replace(/\+/g, ' ') : '';
  const [guestName] = useState(decodedGuestName);
  
  // Form State
  const [formData, setFormData] = useState({ name: decodedGuestName, status: '', guests: 1, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (!config.wedding_date) return;
    const targetDate = new Date(`${config.wedding_date}T08:00:00`).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [config.wedding_date]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        AOS.refresh();
        if (window.lenis) window.lenis.resize();
        window.dispatchEvent(new Event('resize'));
      }, 100);
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 1500);
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

  // Prevent UTC Timezone shifting bug by forcing local Date creation
  let formattedDate = "";
  if (config.wedding_date) {
    const parts = config.wedding_date.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      formattedDate = new Date(year, month, day).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } else {
      formattedDate = config.wedding_date; // Fallback to raw string
    }
  }

  const coupleNamesArr = config.couple_names.split(/&|dan/i).map(n => n.trim());
  const groom = coupleNamesArr[0] || 'Mempelai Pria';
  const bride = coupleNamesArr[1] || 'Mempelai Wanita';

  return (
    <div className="landing-page">
      <audio ref={audioRef} loop src={config.music || bgm} />

      {showContent && (
        <button className={`music-toggle ${!isPlaying ? 'paused' : ''}`} onClick={toggleMusic}>
          {isPlaying ? <Music size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      {/* Hero Cover */}
      <section className="hero-section" id="home">
        <div className="hero-bg" style={{ backgroundImage: config.hero_bg ? `url(${config.hero_bg})` : `url(/assets/dummy-hero-bg.jpg)` }}></div>
        <div className="hero-circle">
          <img src={config.hero_photo || '/assets/dummy-hero-photo.jpg'} alt="Couple" />
        </div>
        <div className="save-the-date">The Wedding Of</div>
        <h1 className="couple-names">{config.couple_names}</h1>
        
        {!isOpen ? (
          <>
            <div className="date-divider"></div>
            <p className="hero-date">{formattedDate}</p>
            
            {guestName && (
              <div style={{ margin: '5px 0 15px', textAlign: 'center', animation: 'fadeUp 1s ease forwards' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--landing-gold-light)', marginBottom: '8px', fontStyle: 'italic' }}>Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                <h2 style={{ fontSize: '1.8rem', fontFamily: '"Cinzel", serif', color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {guestName}
                </h2>
              </div>
            )}
            
            <button className="btn-open" onClick={handleOpen}>Buka Undangan</button>
          </>
        ) : (
          <div style={{ marginTop: '40px', animation: 'fadeIn 2s ease forwards', opacity: 0 }}>
            <p className="hero-date">{formattedDate}</p>
            <ChevronDown size={32} color="var(--landing-gold)" style={{ marginTop: '20px', animation: 'fadeUp 1.5s infinite alternate' }} />
          </div>
        )}
      </section>

      {/* Main Content */}
      {showContent && (
        <>
          {/* Couple Wrapper */}
          <div id="couple">
            {/* Opening / Bismillah */}
            <section className="islamic-opening content-section" data-aos="fade-up">
            <h2 className="arabic-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
            <h3 className="salam-text">Assalamualaikum Warahmatullahi Wabarakatuh</h3>
            <p className="opening-p">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:</p>
          </section>

          {/* Couples Section */}
          <section className="couples-section content-section">
            <div className="couple-card" data-aos="fade-up" data-aos-delay="100">
              <img src={config.groom_photo || '/assets/dummy-groom.jpg'} alt={groom} className="couple-photo" />
              <h3 className="couple-name-title">{groom}</h3>
              <p className="couple-parents">Putra dari Keluarga {config.groom_parents || 'Bpk. ... & Ibu ...'}</p>
            </div>
            
            <div className="couple-divider" data-aos="zoom-in" data-aos-delay="200">&</div>
            
            <div className="couple-card" data-aos="fade-up" data-aos-delay="300">
              <img src={config.bride_photo || '/assets/dummy-bride.jpg'} alt={bride} className="couple-photo" />
              <h3 className="couple-name-title">{bride}</h3>
              <p className="couple-parents">Putri dari Keluarga {config.bride_parents || 'Bpk. ... & Ibu ...'}</p>
            </div>
          </section>

          {/* Quran Verse */}
          <section className="quote-section content-section" data-aos="fade-up">
            <Heart size={32} color="var(--landing-gold)" style={{ margin: '0 auto 20px', opacity: 0.8 }} />
            <p className="quote-text">
              "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."
            </p>
            <p className="quote-src">QS. Adh-Dhariyat: 49</p>
          </section>
          </div>

          {/* Events Wrapper */}
          <div id="events">
            {/* Countdown */}
            <section className="countdown-section content-section">
            <h2 className="section-heading" data-aos="fade-up">Menuju Hari Bahagia</h2>
            <div className="countdown-grid">
              <div className="time-box" data-aos="zoom-in" data-aos-delay="100">
                <span className="time-num">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="time-text">Hari</span>
              </div>
              <div className="time-box" data-aos="zoom-in" data-aos-delay="200">
                <span className="time-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-text">Jam</span>
              </div>
              <div className="time-box" data-aos="zoom-in" data-aos-delay="300">
                <span className="time-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-text">Menit</span>
              </div>
              <div className="time-box" data-aos="zoom-in" data-aos-delay="400">
                <span className="time-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-text">Detik</span>
              </div>
            </div>
          </section>

          {/* Events */}
          <section className="details-section">
            <h2 className="section-heading" data-aos="fade-up">Rangkaian Acara</h2>
            <p className="opening-p" style={{ marginBottom: '40px' }} data-aos="fade-up">Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:</p>
            <div className="events-grid">
              <div className="event-card" data-aos="fade-right">
                <div className="event-icon"><Calendar size={48} /></div>
                <h3 className="event-title">Akad Nikah</h3>
                <div className="event-time">{config.akad_time || '08:00 WIB - Selesai'}</div>
                <p className="event-address" style={{ whiteSpace: 'pre-wrap' }}>
                  {config.akad_address?.replace(/\\n/g, '\n')}
                </p>
                {config.akad_maps && (
                  <button className="btn-map" onClick={() => window.open(config.akad_maps, '_blank')}><MapPin size={18} /> Google Maps</button>
                )}
              </div>

              <div className="event-card" data-aos="fade-left">
                <div className="event-icon"><Clock size={48} /></div>
                <h3 className="event-title">Resepsi</h3>
                <div className="event-time">{config.resepsi_time || '11:00 WIB - Selesai'}</div>
                <p className="event-address" style={{ whiteSpace: 'pre-wrap' }}>
                  {config.resepsi_address?.replace(/\\n/g, '\n')}
                </p>
                {config.resepsi_maps && (
                  <button className="btn-map" onClick={() => window.open(config.resepsi_maps, '_blank')}><MapPin size={18} /> Google Maps</button>
                )}
              </div>
            </div>
          </section>

          {/* Love Gift */}
          <section className="details-section" style={{ paddingTop: 0 }}>
            <h2 className="section-heading" data-aos="fade-up">Love Gift</h2>
            <p className="opening-p" style={{ marginBottom: '30px' }} data-aos="fade-up">Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:</p>
            
            <div data-aos="zoom-in-up" style={{ background: 'var(--landing-glass)', padding: '40px', borderRadius: '20px', border: '1px solid var(--landing-border)', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cinzel", serif', marginBottom: '8px', color: 'var(--landing-gold)' }}>Transfer Bank</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{config.bank_name}</p>
                <p style={{ fontSize: '1.2rem', letterSpacing: '2px', margin: '8px 0', fontFamily: 'monospace' }}>{config.bank_account}</p>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--landing-border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cinzel", serif', marginBottom: '8px', color: 'var(--landing-gold)' }}>Kirim Kado Secara Fisik</h3>
                <p style={{ fontSize: '1rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{config.gift_address?.replace(/\\n/g, '\n')}</p>
              </div>
            </div>
          </section>
          </div>

          {/* RSVP Form */}
          <section className="rsvp-section" id="rsvp">
            <h2 className="section-heading" data-aos="fade-up">Ucapan & Doa Restu</h2>
            <form className="rsvp-form" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="200">
              <p style={{ marginBottom: '20px', color: 'var(--landing-gold-light)' }}>
                Kehadiran dan doa restu Anda menjadi kebahagiaan serta kehormatan besar bagi kami.
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
                  <option value="4">4 Orang</option>
                </select>
              </div>

              <div className="form-group">
                <textarea rows="4" placeholder="Tulis ucapan dan doa restu..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-submit">
                {isSubmitting ? 'Mengirim...' : 'Kirim RSVP'}
              </button>
            </form>

            {/* RSVP Messages Output */}
            {rsvps && rsvps.length > 0 && (
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px', margin: '40px auto 0' }}>
                {rsvps.map((rsvp, idx) => (
                  <div key={idx} data-aos="fade-up" style={{
                    background: 'var(--landing-glass)', padding: '24px', borderRadius: '16px',
                    border: '1px solid var(--landing-border)', textAlign: 'left',
                    backdropFilter: 'blur(16px)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: '1.2rem', color: 'var(--landing-gold)' }}>{rsvp.name}</h4>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(197, 168, 128, 0.15)', padding: '6px 12px', borderRadius: '20px', color: 'var(--landing-gold-light)', fontWeight: 600 }}>
                        {rsvp.status === 'yes' ? 'Hadir ✔️' : rsvp.status === 'maybe' ? 'Ragu-ragu ❔' : 'Tidak Hadir ❌'}
                      </span>
                    </div>
                    {rsvp.message && (
                      <p style={{ color: '#ccc', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.6 }}>"{rsvp.message}"</p>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#666', marginTop: '16px', display: 'block', borderTop: '1px solid rgba(197, 168, 128, 0.2)', paddingTop: '12px' }}>
                      {new Date(rsvp.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer style={{ padding: '60px 20px 120px', textAlign: 'center', background: '#0a0a0a', borderTop: '1px solid var(--landing-border)' }}>
            <p className="salam-text" style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>Wassalamualaikum Warahmatullahi Wabarakatuh</p>
            <h2 className="arabic-bismillah" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ</h2>
            <Heart size={24} color="var(--landing-gold)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: '"Cinzel", serif', color: 'var(--landing-gold-light)' }}>{config.couple_names}</h3>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>Design Inspired by Uleman Digital Template</p>
          </footer>
          
          <BottomNavbar themeMode="elegant" />
        </>
      )}
    </div>
  );
};

export default ThemeElegant;
