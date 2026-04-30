'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ActionItem { action: string; action_hi: string; }
interface JourneyStep {
    step_id: number; title: string; title_hi: string;
    description: string; description_hi: string;
    actions: ActionItem[]; documents: string[];
    official_reference: string; official_url: string; icon: string;
}

const ICON_MAP: Record<string, string> = {
    'shield-check': '🛡️', 'file-text': '📋', 'search': '🔍',
    'map-pin': '📍', 'check-square': '✅',
};

const LOCAL_STEPS: JourneyStep[] = [
    {
        step_id: 1, icon: 'shield-check',
        title: 'Eligibility Check', title_hi: 'पात्रता जांच',
        description: 'You must be a citizen of India, at least 18 years old on the qualifying date (1st January of the year), and ordinarily resident in the constituency.',
        description_hi: 'आपको भारत का नागरिक, 1 जनवरी को 18+ वर्ष का होना चाहिए।',
        actions: [
            { action: 'Confirm you are 18+ as of January 1', action_hi: '1 जनवरी तक 18+ होने की पुष्टि करें' },
            { action: 'Confirm Indian citizenship', action_hi: 'भारतीय नागरिकता की पुष्टि करें' },
            { action: 'Confirm current address', action_hi: 'वर्तमान पता सत्यापित करें' },
        ],
        documents: ['Aadhaar Card / Passport (Age Proof)', 'Proof of Address', 'Citizenship Declaration'],
        official_reference: 'Representation of the People Act, 1950 — Section 19, 20',
        official_url: 'https://eci.gov.in/electoral-rolls/',
    },
    {
        step_id: 2, icon: 'file-text',
        title: 'Voter Registration (Form 6)', title_hi: 'मतदाता पंजीकरण (फॉर्म 6)',
        description: 'Apply online at voters.eci.gov.in using Form 6. You can also apply at your nearest ERO/BLO office or via the Voter Helpline App.',
        description_hi: 'voters.eci.gov.in पर Form 6 से ऑनलाइन आवेदन करें।',
        actions: [
            { action: "Visit voters.eci.gov.in → 'New Voter Registration'", action_hi: 'voters.eci.gov.in पर जाएं → नया मतदाता पंजीकरण' },
            { action: 'Fill Form 6 with personal details', action_hi: 'फॉर्म 6 भरें' },
            { action: 'Upload scanned documents', action_hi: 'दस्तावेज़ अपलोड करें' },
            { action: 'Submit and note your reference number', action_hi: 'संदर्भ नंबर नोट करें' },
        ],
        documents: ['Recent passport-size photo', 'Age proof (Aadhaar/Birth Certificate)', 'Address proof (Aadhaar/Utility Bill)'],
        official_reference: 'Form 6 — Registration of electors, ECI',
        official_url: 'https://voters.eci.gov.in/',
    },
    {
        step_id: 3, icon: 'search',
        title: 'Verification & Electoral Roll', title_hi: 'सत्यापन और मतदाता सूची',
        description: 'After submission, the ERO verifies your application within 30 days. Track status online. Once approved, your name appears in the Electoral Roll.',
        description_hi: 'ERO 30 दिनों में आवेदन सत्यापित करेगा। ऑनलाइन ट्रैक करें।',
        actions: [
            { action: 'Track at voters.eci.gov.in/track-application', action_hi: 'आवेदन ट्रैक करें' },
            { action: 'Search name in electoral roll at electoralsearch.eci.gov.in', action_hi: 'मतदाता सूची में नाम खोजें' },
            { action: 'Download e-EPIC (digital voter ID)', action_hi: 'e-EPIC डाउनलोड करें' },
        ],
        documents: ['Application Reference Number', 'Mobile number linked to application'],
        official_reference: 'Electoral Registration Officers Rules, 1960',
        official_url: 'https://electoralsearch.eci.gov.in/',
    },
    {
        step_id: 4, icon: 'map-pin',
        title: 'Polling Day Preparation', title_hi: 'मतदान दिवस की तैयारी',
        description: 'Locate your polling booth on ECI website. Carry required ID. Booths are open 7 AM – 6 PM. Do not carry mobile phones inside.',
        description_hi: 'मतदान केंद्र खोजें, पहचान पत्र लाएं। सुबह 7 से शाम 6 बजे तक।',
        actions: [
            { action: 'Find booth at electoralsearch.eci.gov.in', action_hi: 'मतदान केंद्र खोजें' },
            { action: 'Carry Voter ID or an approved alternate ID', action_hi: 'मतदाता पहचान पत्र लाएं' },
            { action: 'Arrive at booth between 7 AM – 6 PM', action_hi: 'सुबह 7 से शाम 6 के बीच पहुंचें' },
            { action: 'Do NOT carry mobile phone inside booth', action_hi: 'अंदर मोबाइल न ले जाएं' },
        ],
        documents: ['Voter ID (EPIC), OR Aadhaar, Passport, Driving Licence, PAN Card, MNREGA Job Card, Bank Passbook with photo'],
        official_reference: 'Conduct of Elections Rules, 1961 — Rule 49',
        official_url: 'https://eci.gov.in/faqs/elections/voter-faqs/',
    },
    {
        step_id: 5, icon: 'check-square',
        title: 'Cast Your Vote (EVM)', title_hi: 'अपना वोट डालें (EVM)',
        description: 'Verify identity, sign register, receive ink mark, press button on EVM, verify VVPAT slip for 7 seconds. Your vote is constitutional right under Article 326.',
        description_hi: 'पहचान सत्यापित करें, रजिस्टर पर हस्ताक्षर करें, EVM बटन दबाएं।',
        actions: [
            { action: "Verify name in presiding officer's register", action_hi: 'रजिस्टर में नाम सत्यापित करें' },
            { action: 'Get indelible ink mark on left index finger', action_hi: 'अमिट स्याही का निशान लगवाएं' },
            { action: 'Press EVM button for chosen candidate', action_hi: 'EVM बटन दबाएं' },
            { action: 'Verify VVPAT slip (7 seconds)', action_hi: 'VVPAT पर्ची देखें (7 सेकंड)' },
        ],
        documents: [],
        official_reference: 'EVM & VVPAT — Election Commission of India',
        official_url: 'https://eci.gov.in/evm/',
    },
];

export default function JourneyPage() {
    const [steps, setSteps] = useState<JourneyStep[]>(LOCAL_STEPS);
    const [activeStep, setActiveStep] = useState(1);
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    useEffect(() => {
        const stored = localStorage.getItem('mv_user');
        if (stored) {
            const user = JSON.parse(stored);
            setLang(user.language || 'en');
        }
        // Try fetching from API
        fetch('/api/v1/journey/steps')
            .then(r => r.json())
            .then(d => { if (d.steps) setSteps(d.steps); })
            .catch(() => { });
    }, []);

    const current = steps.find(s => s.step_id === activeStep) || steps[0];

    const toggleDone = (id: number) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="min-h-screen" style={{ padding: '0 0 60px' }}>
            {/* Navbar */}
            <nav className="glass" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>← </span>
                    <span style={{ fontWeight: 700 }}>{lang === 'en' ? 'Guided Journey' : 'मार्गदर्शित यात्रा'}</span>
                </Link>
                <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                    {lang === 'en' ? '🇮🇳 हिंदी' : '🇮🇳 English'}
                </button>
            </nav>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px' }}>

                {/* Step List (sidebar) */}
                <div>
                    <h2 style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                        {lang === 'en' ? 'Steps' : 'चरण'}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {steps.map((s, idx) => {
                            const done = completedSteps.has(s.step_id);
                            const isActive = s.step_id === activeStep;
                            return (
                                <button
                                    key={s.step_id}
                                    onClick={() => setActiveStep(s.step_id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                        background: isActive ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
                                        borderLeft: isActive ? '3px solid #FF6B35' : '3px solid transparent',
                                        color: 'white', textAlign: 'left', width: '100%',
                                        transition: 'all 0.2s',
                                    }}
                                    id={`step-nav-${s.step_id}`}
                                >
                                    <div className={`step-indicator ${done ? 'completed' : isActive ? 'active' : 'pending'}`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                        {done ? '✓' : ICON_MAP[s.icon] || s.step_id}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{lang === 'hi' ? s.title_hi : s.title}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Step {s.step_id}/5</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                            className="btn-secondary"
                            style={{ flex: 1, padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                            disabled={activeStep === 1}
                        >← Prev</button>
                        <button
                            onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                            className="btn-primary"
                            style={{ flex: 1, padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                            disabled={activeStep === steps.length}
                        >Next →</button>
                    </div>
                </div>

                {/* Step Detail */}
                <div className="glass-card" style={{ padding: '36px' }} key={current.step_id}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '3rem' }}>{ICON_MAP[current.icon] || '📋'}</div>
                        <div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,107,53,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Step {current.step_id} of {steps.length}</div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px' }}>
                                {lang === 'hi' ? current.title_hi : current.title}
                            </h1>
                        </div>
                    </div>

                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: '28px', fontSize: '1rem' }}>
                        {lang === 'hi' ? current.description_hi : current.description}
                    </p>

                    {/* Action steps */}
                    <div style={{ marginBottom: '28px' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
                            {lang === 'en' ? '✅ Action Steps' : '✅ कार्य चरण'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {current.actions.map((a, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', borderLeft: '3px solid rgba(255,107,53,0.4)' }}>
                                    <span style={{ color: 'var(--color-saffron)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        {lang === 'hi' ? a.action_hi : a.action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Documents */}
                    {current.documents.length > 0 && (
                        <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
                                📎 {lang === 'en' ? 'Documents Required' : 'आवश्यक दस्तावेज़'}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {current.documents.map((d, i) => (
                                    <div key={i} className="glass" style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>
                                        {d}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Official Reference */}
                    <div style={{ padding: '16px', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: '12px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,107,53,0.8)', fontWeight: 600, marginBottom: '4px' }}>📌 Official Reference</div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>{current.official_reference}</div>
                        <a href={current.official_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-saffron)', fontSize: '0.82rem', textDecoration: 'none' }}>
                            🔗 {current.official_url}
                        </a>
                    </div>

                    {/* Mark done */}
                    <button
                        onClick={() => toggleDone(current.step_id)}
                        className={completedSteps.has(current.step_id) ? 'btn-secondary' : 'btn-green'}
                        style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                        id={`mark-done-step-${current.step_id}`}
                    >
                        {completedSteps.has(current.step_id)
                            ? (lang === 'en' ? '↩ Mark as Pending' : '↩ लंबित के रूप में चिह्नित करें')
                            : (lang === 'en' ? '✓ Mark as Done' : '✓ पूर्ण के रूप में चिह्नित करें')}
                    </button>
                </div>
            </main>
        </div>
    );
}
