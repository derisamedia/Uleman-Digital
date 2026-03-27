import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import { Leaf, MapPin, Calendar, Clock, ChevronDown, Music, VolumeX } from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';
import './ThemeMinimalist.css';
import bgm from "../assets/I'm always with you.mp3";

const ThemeMinimalist = ({ config, onRsvpSubmit, rsvps = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);
  
  // Extract guest name from URL
  const urlParams = new URLSearchParams(window.location.search);
  let initialGuestName = urlParams.get('to');
  if (!initialGuestName && window.location.pathname.startsWith('/to=')) {
    initialGuestName = window.location.pathname.replace('/to=', '');
  }
  const decodedGuestName = initialGuestName ? decodeURIComponent(initialGuestName).replace(/\+/g, ' ') : '';
  const [guestName] = useState(decodedGuestName);
  
  const [formData, setFormData] = useState({ name: decodedGuestName, status: '', guests: 1, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }, 1000);
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

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = "";
  if (config.wedding_date) {
    const parts = config.wedding_date.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      formattedDate = new Date(year, month, day).toLocaleDateString('id-ID', dateOptions);
    } else {
      formattedDate = config.wedding_date; // Fallback to raw string
    }
  }

  const coupleNamesArr = config.couple_names.split(/&|dan/i).map(n => n.trim());
  const groom = coupleNamesArr[0] || 'Mempelai Pria';
  const bride = coupleNamesArr[1] || 'Mempelai Wanita';

  return (
    <div className="theme-minimalist">
      <audio ref={audioRef} loop src={bgm} />

      {showContent && (
        <button className={`min-music-toggle ${!isPlaying ? 'paused' : ''}`} onClick={toggleMusic}>
          {isPlaying ? <Music size={20} /> : <VolumeX size={20} />}
        </button>
      )}

      <section className="min-hero" id="home">
        <div className="min-leaf-bg" style={{ backgroundImage: config.hero_bg ? `url(${config.hero_bg})` : `url(/assets/dummy-hero-bg.jpg)`, opacity: config.hero_bg ? 0.2 : 0.1 }}></div>
        <div className="min-hero-content">
          <div className="min-hero-circle">
            <img src={config.hero_photo || '/assets/dummy-hero-photo.jpg'} alt="Couple" />
          </div>
          <h1 className="min-title">{config.couple_names}</h1>
          
          {!isOpen ? (
            <>
              <div className="min-date-box">{config.wedding_date.split('-').reverse().join(' . ')}</div>
              {guestName && (
                <div style={{ margin: '15px 0 30px', textAlign: 'center', animation: 'fadeUp 1s ease forwards' }}>
                  <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: '8px', fontStyle: 'italic' }}>Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                  <h2 style={{ fontSize: '1.8rem', fontFamily: '"Cormorant Garamond", serif', color: 'var(--min-accent)', fontWeight: 'bold' }}>
                    {guestName}
                  </h2>
                </div>
              )}
              <button className="min-btn" onClick={handleOpen}>
                Buka Undangan
              </button>
            </>
          ) : (
            <div style={{ marginTop: '20px', animation: 'fadeIn 1s ease forwards' }}>
              <div className="min-date-box" style={{ animation: 'none', opacity: 1, border: 'none', fontSize: '1.2rem' }}>
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
          {/* Couple Wrapper */}
          <div id="couple">
            {/* Opening / Bismillah */}
            <section className="min-section min-islamic-opening" style={{ textAlign: 'center' }} data-aos="fade-up">
            <h2 className="min-arabic-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
            <h3 className="min-salam-text">Assalamualaikum Warahmatullahi Wabarakatuh</h3>
            <p className="min-opening-p">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:</p>
          </section>

          {/* Couples Section */}
          <section className="min-section" style={{ background: '#f9f8f4' }}>
            <div className="min-couples-section">
              <div className="min-couple-card" data-aos="fade-right">
                <img src={config.groom_photo || '/assets/dummy-groom.jpg'} alt={groom} className="min-couple-photo" />
                <h3 className="min-couple-name-title">{groom}</h3>
                <p className="min-couple-parents">Putra dari Keluarga {config.groom_parents || 'Bpk. ... & Ibu ...'}</p>
              </div>
              
              <div className="min-couple-divider" data-aos="zoom-in" data-aos-delay="200">&</div>
              
              <div className="min-couple-card" data-aos="fade-left">
                <img src={config.bride_photo || '/assets/dummy-bride.jpg'} alt={bride} className="min-couple-photo" />
                <h3 className="min-couple-name-title">{bride}</h3>
                <p className="min-couple-parents">Putri dari Keluarga {config.bride_parents || 'Bpk. ... & Ibu ...'}</p>
              </div>
            </div>
          </section>

          {/* Quran Verse */}
          <section className="min-section min-quote-section" style={{ textAlign: 'center' }} data-aos="fade-up">
            <Leaf size={32} color="var(--min-accent)" style={{ margin: '0 auto 20px', opacity: 0.8, display: 'block' }} />
            <p className="min-quote-text">
              "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."
            </p>
            <p className="min-quote-src">QS. Adh-Dhariyat: 49</p>
          </section>
          </div>

          {/* Events Wrapper */}
          <div id="events">
            {/* Countdown */}
            <section className="min-section" style={{ background: '#f9f8f4' }}>
            <h2 className="min-heading" data-aos="fade-up">Menuju Hari Bahagia</h2>
            <div className="min-countdown-grid">
              <div className="min-time-box" data-aos="zoom-in" data-aos-delay="100">
                <span className="min-time-num">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="min-time-text">Hari</span>
              </div>
              <div className="min-time-box" data-aos="zoom-in" data-aos-delay="200">
                <span className="min-time-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="min-time-text">Jam</span>
              </div>
              <div className="min-time-box" data-aos="zoom-in" data-aos-delay="300">
                <span className="min-time-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="min-time-text">Menit</span>
              </div>
              <div className="min-time-box" data-aos="zoom-in" data-aos-delay="400">
                <span className="min-time-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="min-time-text">Detik</span>
              </div>
            </div>
          </section>

          {/* Events */}
          <section className="min-section">
            <h2 className="min-heading" data-aos="fade-up">Waktu & Tempat</h2>
            <p className="min-opening-p" style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', textAlign: 'center' }} data-aos="fade-up">Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan menyelenggarakan acara:</p>
            <div className="min-grid">
              <div className="min-card" data-aos="fade-up" data-aos-delay="100">
                <div className="min-card-icon"><Calendar size={32} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontFamily: '"Cormorant Garamond", serif' }}>Akad Nikah</h3>
                <p style={{ color: 'var(--min-accent)', fontWeight: 500, marginBottom: '20px' }}>{config.akad_time || '08:00 WIB - Selesai'}</p>
                <p style={{ lineHeight: 1.6, color: '#666', whiteSpace: 'pre-wrap' }}>
                  {config.akad_address?.replace(/\\n/g, '\n')}
                </p>
                {config.akad_maps && (
                  <button className="min-btn-outline" onClick={() => window.open(config.akad_maps, '_blank')}><MapPin size={16} style={{ display: 'inline', marginRight: '6px' }}/> Lihat Peta</button>
                )}
              </div>

              <div className="min-card" data-aos="fade-up" data-aos-delay="200">
                <div className="min-card-icon"><Clock size={32} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontFamily: '"Cormorant Garamond", serif' }}>Resepsi</h3>
                <p style={{ color: 'var(--min-accent)', fontWeight: 500, marginBottom: '20px' }}>{config.resepsi_time || '11:00 WIB - Selesai'}</p>
                <p style={{ lineHeight: 1.6, color: '#666', whiteSpace: 'pre-wrap' }}>
                  {config.resepsi_address?.replace(/\\n/g, '\n')}
                </p>
                {config.resepsi_maps && (
                  <button className="min-btn-outline" onClick={() => window.open(config.resepsi_maps, '_blank')}><MapPin size={16} style={{ display: 'inline', marginRight: '6px' }}/> Lihat Peta</button>
                )}
              </div>
            </div>
          </section>

          {/* Love Gift */}
          <section className="min-section" style={{ background: '#f9f8f4' }}>
            <h2 className="min-heading" data-aos="fade-up">Love Gift</h2>
            <p className="min-opening-p" style={{ marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', textAlign: 'center' }} data-aos="fade-up">Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:</p>
            <div className="min-card" data-aos="zoom-in" style={{ maxWidth: '600px', margin: '0 auto', background: '#fdfcfb' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cormorant Garamond", serif', marginBottom: '8px', color: 'var(--min-accent)' }}>Transfer Bank</h3>
              <p style={{ fontWeight: 600, color: 'var(--min-text)' }}>{config.bank_name}</p>
              <p style={{ color: '#666', letterSpacing: '1px' }}>{config.bank_account}</p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--min-border)', margin: '24px 0' }} />
              
              <h3 style={{ fontSize: '1.2rem', fontFamily: '"Cormorant Garamond", serif', marginBottom: '8px', color: 'var(--min-accent)' }}>Kirim Kado Fisik</h3>
              <p style={{ color: '#666', whiteSpace: 'pre-wrap' }}>{config.gift_address?.replace(/\\n/g, '\n')}</p>
            </div>
          </section>
          </div>

          {/* RSVP Form */}
          <section className="min-rsvp min-section" id="rsvp">
            <h2 className="min-heading" data-aos="fade-up">Ucapan & Doa Restu</h2>
            <p className="min-opening-p" style={{ marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px', textAlign: 'center' }} data-aos="fade-up">Kehadiran dan doa restu Anda menjadi kebahagiaan serta kehormatan besar bagi kami.</p>
            <form className="min-form" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="200">
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
                <option value="3">3 Orang</option>
                <option value="4">4 Orang</option>
              </select>

              <textarea className="min-input" rows="4" placeholder="Tulis ucapan dan doa restu..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
              <button type="submit" disabled={isSubmitting} className="min-btn" style={{ width: '100%' }}>
                {isSubmitting ? 'Mengirim...' : 'Kirim RSVP'}
              </button>
            </form>

            {/* RSVP Messages Output */}
            {rsvps && rsvps.length > 0 && (
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '40px auto 0' }}>
                {rsvps.map((rsvp, idx) => (
                  <div key={idx} data-aos="fade-up" style={{
                    background: 'white', padding: '24px', borderRadius: '12px',
                    border: '1px solid var(--min-border)', textAlign: 'left',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: 'var(--min-text)', fontWeight: 600 }}>{rsvp.name}</h4>
                      <span style={{ fontSize: '0.8rem', background: 'var(--min-accent-light)', padding: '6px 12px', borderRadius: '20px', color: 'var(--min-accent)', fontWeight: 600 }}>
                        {rsvp.status === 'yes' ? 'Hadir ✔️' : rsvp.status === 'maybe' ? 'Ragu-ragu ❔' : 'Tidak Hadir ❌'}
                      </span>
                    </div>
                    {rsvp.message && (
                      <p style={{ color: '#555', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.6 }}>"{rsvp.message}"</p>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '16px', display: 'block', borderTop: '1px solid var(--min-border)', paddingTop: '12px' }}>
                      {new Date(rsvp.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer style={{ padding: '60px 20px 120px', textAlign: 'center', background: 'white' }}>
            <p className="min-opening-p" style={{ fontSize: '1.1rem', margin: '0 0 10px 0' }}>Wassalamualaikum Warahmatullahi Wabarakatuh</p>
            <h2 className="min-arabic-bismillah" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ</h2>
            <Leaf size={24} color="var(--min-accent)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: 'var(--min-accent)', fontWeight: 'bold' }}>
              {config.couple_names}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>Design Inspired by Uleman Digital Template</p>
          </footer>
          
          <BottomNavbar themeMode="minimalist" />
        </>
      )}
    </div>
  );
};

export default ThemeMinimalist;
