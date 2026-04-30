'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
    user_id: string;
    eligible: boolean;
    eligibility_reason: string;
    state: string;
    language: 'en' | 'hi';
    upcoming_election?: {
        name: string;
        date: string;
        type: string;
        phases?: number;
    };
}

interface Step {
    step_id: number;
    name: string;
    name_hi: string;
    description: string;
    completed: boolean;
}

const STEPS_META: Step[] = [
    { step_id: 1, name: 'Eligibility Check', name_hi: 'पात्रता जांच', description: 'Age & citizenship confirmed', completed: false },
    { step_id: 2, name: 'Voter Registration', name_hi: 'मतदाता पंजीकरण', description: 'Fill Form 6 on NVSP portal', completed: false },
    { step_id: 3, name: 'Verification', name_hi: 'सत्यापन', description: 'Track application & get EPIC', completed: false },
    { step_id: 4, name: 'Polling Day Prep', name_hi: 'मतदान दिवस की तैयारी', description: 'Find booth & carry ID', completed: false },
    { step_id: 5, name: 'Cast Your Vote', name_hi: 'मत डालें', description: 'Vote on EVM', completed: false },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]));
    const lang = user?.language || 'en';

    useEffect(() => {
        const stored = localStorage.getItem('mv_user');
        if (!stored) { router.push('/'); return; }
        setUser(JSON.parse(stored));
    }, [router]);

    const toggleStep = (id: number) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="skeleton" style={{ width: '400px', height: '300px' }} />
            </div>
        );
    }

    const completionPct = Math.round((completedSteps.size / STEPS_META.length) * 100);
    const election = user.upcoming_election;

    const labels = {
        en: {
            dashboard: 'Dashboard',
            welcome: 'Welcome back! 👋',
            eligible: '✅ Eligible to Vote',
            notEligible: '⏳ Not Yet Eligible',
            yourJourney: 'Your Journey Progress',
            upcomingElection: 'Upcoming Election',
            noElection: 'No upcoming elections scheduled',
            quickActions: 'Quick Actions',
            journeyBtn: '📋 Journey Steps',
            simulateBtn: '🗳️ Try Simulation',
            chatBtn: '🤖 Ask AI Assistant',
            quizBtn: '📚 Take Quiz',
            disclaimer: 'Toggle steps to track your journey manually.',
        },
        hi: {
            dashboard: 'डैशबोर्ड',
            welcome: 'वापसी का स्वागत है! 👋',
            eligible: '✅ मतदान के योग्य',
            notEligible: '⏳ अभी पात्र नहीं',
            yourJourney: 'आपकी यात्रा प्रगति',
            upcomingElection: 'आगामी चुनाव',
            noElection: 'कोई आगामी चुनाव निर्धारित नहीं',
            quickActions: 'त्वरित क्रियाएं',
            journeyBtn: '📋 यात्रा के चरण',
            simulateBtn: '🗳️ सिमुलेशन',
            chatBtn: '🤖 AI सहायक',
            quizBtn: '📚 प्रश्नोत्तरी',
            disclaimer: 'अपनी यात्रा को ट्रैक करने के लिए चरण टॉगल करें।',
        },
    }[lang];

    return (
        <div className="min-h-screen" style={{ padding: '0 0 60px' }}>
            {/* Navbar */}
            <nav className="glass" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <span style={{ fontSize: '1.5rem' }}>🗳️</span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        <span className="heading-gradient">MyVote</span>{' '}
                        <span style={{ color: 'rgba(255,255,255,0.85)' }}>Journey</span>
                    </span>
                </Link>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{user.state}</span>
                    <button onClick={() => { localStorage.removeItem('mv_user'); router.push('/'); }} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
                        {lang === 'en' ? 'Sign Out' : 'साइन आउट'}
                    </button>
                </div>
            </nav>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{labels.dashboard}</h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '40px' }}>{labels.welcome} <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{user.state}</strong></p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>

                    {/* Eligibility Card */}
                    <div className="glass-card" style={{ padding: '28px' }}>
                        <h2 style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.78rem' }}>Eligibility Status</h2>
                        <div style={{
                            padding: '20px',
                            borderRadius: '14px',
                            background: user.eligible ? 'rgba(19,136,8,0.15)' : 'rgba(220,38,38,0.12)',
                            border: `1px solid ${user.eligible ? 'rgba(19,136,8,0.3)' : 'rgba(220,38,38,0.3)'}`,
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
                                {user.eligible ? labels.eligible : labels.notEligible}
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                {user.eligibility_reason}
                            </p>
                        </div>
                    </div>

                    {/* Upcoming Election Card */}
                    <div className="glass-card" style={{ padding: '28px' }}>
                        <h2 style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{labels.upcomingElection}</h2>
                        {election ? (
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>{election.name}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {[
                                        { label: '📅 Date', value: election.date },
                                        { label: '🏛️ Type', value: election.type },
                                        election.phases && { label: '🗂️ Phases', value: String(election.phases) },
                                    ].filter(Boolean).map((item: any, i) => (
                                        <div key={i} className="glass" style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.82rem' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}: </span>
                                            <span style={{ fontWeight: 600 }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: 'rgba(255,255,255,0.4)' }}>{labels.noElection}</p>
                        )}
                    </div>
                </div>

                {/* Progress Tracker */}
                <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{labels.yourJourney}</h2>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800 }} className="heading-gradient">{completionPct}%</span>
                    </div>

                    <div className="progress-bar" style={{ marginBottom: '28px' }}>
                        <div className="progress-fill" style={{ width: `${completionPct}%` }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {STEPS_META.map((step, idx) => {
                            const done = completedSteps.has(step.step_id);
                            const active = !done && (idx === 0 || completedSteps.has(STEPS_META[idx - 1].step_id));
                            return (
                                <div
                                    key={step.step_id}
                                    onClick={() => toggleStep(step.step_id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
                                        padding: '14px 16px', borderRadius: '12px', transition: 'background 0.2s',
                                        background: done ? 'rgba(19,136,8,0.1)' : active ? 'rgba(255,107,53,0.08)' : 'transparent',
                                    }}
                                    role="checkbox"
                                    aria-checked={done}
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && toggleStep(step.step_id)}
                                >
                                    <div className={`step-indicator ${done ? 'completed' : active ? 'active' : 'pending'}`}>
                                        {done ? '✓' : step.step_id}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                            {lang === 'hi' ? step.name_hi : step.name}
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{step.description}</div>
                                    </div>
                                    {done && <span style={{ color: '#6EE7A6', fontSize: '0.85rem', fontWeight: 600 }}>Done ✓</span>}
                                </div>
                            );
                        })}
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{labels.disclaimer}</p>
                </div>

                {/* Quick Action Buttons */}
                <div>
                    <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.05rem' }}>{labels.quickActions}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {[
                            { href: '/journey', label: labels.journeyBtn, color: 'saffron', id: 'nav-journey' },
                            { href: '/simulate', label: labels.simulateBtn, color: 'navy', id: 'nav-simulate' },
                            { href: '/chat', label: labels.chatBtn, color: 'indigo', id: 'nav-chat' },
                            { href: '/quiz', label: labels.quizBtn, color: 'green', id: 'nav-quiz' },
                        ].map(action => (
                            <Link
                                key={action.href}
                                href={action.href}
                                id={action.id}
                                className="glass-card"
                                style={{
                                    display: 'block', padding: '20px', textDecoration: 'none',
                                    textAlign: 'center', fontWeight: 600, fontSize: '0.95rem',
                                    borderRadius: '16px',
                                }}
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
