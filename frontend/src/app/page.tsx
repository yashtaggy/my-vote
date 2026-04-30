'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'hero' | 'onboard'>('hero');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: '',
    state: 'Delhi',
    city: '',
    pincode: '',
    is_first_time_voter: true,
  });

  const t = {
    en: {
      tagline: 'Your complete guide to voting in India',
      headline1: 'Know Your',
      headline2: 'Vote.',
      subtitle: 'Step-by-step guidance from eligibility to the EVM. Verified by official ECI data.',
      start: 'Begin Your Journey',
      explore: 'Explore Features',
      onboardTitle: "Let's Get Started",
      onboardSub: 'Tell us a bit about you to personalize your journey.',
      ageLabel: 'Your Age',
      stateLabel: 'Your State',
      cityLabel: 'City / Town',
      pincodeLabel: 'Pincode',
      firstLabel: 'First-time voter?',
      submitBtn: 'Check My Eligibility →',
      features: [
        { icon: '🛡️', title: 'Eligibility Check', desc: 'Fast and accurate' },
        { icon: '📋', title: 'Step-by-Step Journey', desc: '5 structured steps' },
        { icon: '🗳️', title: 'Voting Simulation', desc: 'Realistic EVM demo' },
        { icon: '🤖', title: 'AI Assistant', desc: 'Gemini-powered RAG' },
        { icon: '📚', title: 'Quiz & Myth Busting', desc: '10 verified questions' },
        { icon: '🗺️', title: 'Location-Aware', desc: 'India state-specific' },
      ],
    },
    hi: {
      tagline: 'भारत में मतदान की आपकी संपूर्ण मार्गदर्शिका',
      headline1: 'अपना',
      headline2: 'वोट जानें।',
      subtitle: 'पात्रता से EVM तक चरण-दर-चरण मार्गदर्शन। ECI के आधिकारिक डेटा से सत्यापित।',
      start: 'अपनी यात्रा शुरू करें',
      explore: 'सुविधाएँ देखें',
      onboardTitle: 'शुरू करें',
      onboardSub: 'अपनी यात्रा को व्यक्तिगत बनाने के लिए कुछ जानकारी दें।',
      ageLabel: 'आपकी आयु',
      stateLabel: 'आपका राज्य',
      cityLabel: 'शहर / कस्बा',
      pincodeLabel: 'पिनकोड',
      firstLabel: 'पहली बार मतदाता?',
      submitBtn: 'पात्रता जांचें →',
      features: [
        { icon: '🛡️', title: 'पात्रता जांच', desc: 'तेज़ और सटीक' },
        { icon: '📋', title: 'चरण-दर-चरण यात्रा', desc: '5 संरचित चरण' },
        { icon: '🗳️', title: 'मतदान सिमुलेशन', desc: 'वास्तविक EVM डेमो' },
        { icon: '🤖', title: 'AI सहायक', desc: 'Gemini RAG आधारित' },
        { icon: '📚', title: 'प्रश्नोत्तरी', desc: '10 सत्यापित प्रश्न' },
        { icon: '🗺️', title: 'स्थान-जागरूक', desc: 'भारत राज्य-विशिष्ट' },
      ],
    },
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age), language: lang }),
      });
      const data = await res.json();
      if (data.user_id) {
        localStorage.setItem('mv_user', JSON.stringify({ ...data, state: form.state, language: lang }));
        router.push('/dashboard');
      }
    } catch {
      // Demo mode — proceed without API
      const mockUser = {
        user_id: 'demo-' + Date.now(),
        eligible: Number(form.age) >= 18,
        state: form.state,
        language: lang,
        eligibility_reason: Number(form.age) >= 18
          ? 'You are eligible to vote in India!'
          : `You must be 18+ to vote. You are ${form.age} years old.`,
      };
      localStorage.setItem('mv_user', JSON.stringify(mockUser));
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="ashoka-decoration" style={{ top: '10%', right: '-80px', opacity: 0.4 }} />
      <div className="ashoka-decoration" style={{ bottom: '5%', left: '-100px', width: '280px', height: '280px', opacity: 0.25 }} />

      {/* Gradient orbs */}
      <div style={{
        position: 'fixed', top: '15%', left: '5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '5%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(19,136,8,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="glass" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🗳️</span>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            <span className="heading-gradient">MyVote</span>{' '}
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Journey</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            aria-label="Toggle language"
          >
            {lang === 'en' ? '🇮🇳 हिंदी' : '🇮🇳 English'}
          </button>
          {step === 'hero' && (
            <button onClick={() => setStep('onboard')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
              {t.start}
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      {step === 'hero' && (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 60px' }}>
          {/* Hero heading */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }} className="animate-fade-up">
            <div className="glass" style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '100px', marginBottom: '24px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              🇮🇳 {t.tagline}
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '20px' }}>
              <span style={{ color: 'white' }}>{t.headline1} </span>
              <span className="heading-gradient">{t.headline2}</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.65)', maxWidth: '550px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              {t.subtitle}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setStep('onboard')} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }} id="start-journey-btn">
                {t.start}
              </button>
              <a href="#features" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                {t.explore}
              </a>
            </div>
          </div>

          {/* India flag stripe */}
          <div style={{ height: '4px', borderRadius: '2px', background: 'linear-gradient(to right, #FF6B35 33%, white 33%, white 66%, #138808 66%)', marginBottom: '64px', opacity: 0.6 }} />

          {/* Feature grid */}
          <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {t.features.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '28px 24px', animationDelay: `${i * 0.08}s` }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="glass" style={{ padding: '32px', borderRadius: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', textAlign: 'center' }}>
            {[
              { value: '970M+', label: lang === 'en' ? 'Registered Voters' : 'पंजीकृत मतदाता' },
              { value: '1.2M+', label: lang === 'en' ? 'Polling Booths' : 'मतदान केंद्र' },
              { value: '28+', label: lang === 'en' ? 'States Covered' : 'राज्य शामिल' },
              { value: '100%', label: lang === 'en' ? 'Free & Fair' : 'स्वतंत्र और निष्पक्ष' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', fontWeight: 900 }} className="heading-gradient">{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── Onboarding Form ────────────────────────────────────────── */}
      {step === 'onboard' && (
        <main style={{ maxWidth: '520px', margin: '60px auto', padding: '0 24px' }} className="animate-fade-up">
          <div className="glass-card" style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗳️</div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>{t.onboardTitle}</h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>{t.onboardSub}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Age */}
              <div>
                <label htmlFor="age" style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {t.ageLabel}
                </label>
                <input
                  id="age"
                  type="number"
                  min={1} max={120}
                  required
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                  placeholder="e.g. 22"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '1rem',
                  }}
                />
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {t.stateLabel}
                </label>
                <select
                  id="state"
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                  style={{
                    width: '100%', background: '#1A1F4B', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.95rem',
                  }}
                >
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {t.cityLabel}
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. New Delhi"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '1rem',
                  }}
                />
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {t.pincodeLabel}
                </label>
                <input
                  id="pincode"
                  type="text"
                  pattern="\d{6}"
                  required
                  value={form.pincode}
                  onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                  placeholder="e.g. 110001"
                  maxLength={6}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '1rem',
                  }}
                />
              </div>

              {/* First-time voter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  id="first-voter"
                  type="checkbox"
                  checked={form.is_first_time_voter}
                  onChange={e => setForm(f => ({ ...f, is_first_time_voter: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-saffron)', cursor: 'pointer' }}
                />
                <label htmlFor="first-voter" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}>
                  {t.firstLabel}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px', opacity: loading ? 0.7 : 1 }}
                id="submit-onboard-btn"
              >
                {loading ? '⏳ Processing...' : t.submitBtn}
              </button>
            </form>

            <button onClick={() => setStep('hero')} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.88rem', width: '100%', textAlign: 'center' }}>
              ← {lang === 'en' ? 'Back' : 'वापस'}
            </button>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
        <p>Source: Election Commission of India (eci.gov.in) · National Voter Services Portal (voters.eci.gov.in)</p>
        <p style={{ marginTop: '4px' }}>MyVote Journey · Civic Tech · 2024</p>
      </footer>
    </div>
  );
}
