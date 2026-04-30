'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
    role: 'user' | 'ai';
    text: string;
    steps?: string[];
    docs?: string[];
    timeline?: string;
    sources?: { title: string; source: string; url: string }[];
    loading?: boolean;
}

const SUGGESTED = [
    'How do I apply for a voter ID?',
    'I moved to another city. What should I do?',
    'I lost my voter ID. How to get a new one?',
    'What ID can I carry on election day?',
    'What is NOTA?',
    'How does the EVM machine work?',
];
const SUGGESTED_HI = [
    'मतदाता पहचान पत्र के लिए कैसे आवेदन करें?',
    'मैं दूसरे शहर में शिफ्ट हो गया। क्या करूं?',
    'मेरा वोटर ID खो गया। नया कैसे मिलेगा?',
    'चुनाव के दिन कौन सा ID लाएं?',
    'NOTA क्या है?',
    'EVM मशीन कैसे काम करती है?',
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            text: "Hello! I'm your MyVote Journey AI assistant powered by verified ECI data. Ask me anything about voter registration, elections, or polling day. 🗳️",
        }
    ]);
    const [input, setInput] = useState('');
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [state, setState] = useState('Delhi');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('mv_user');
        if (stored) {
            const user = JSON.parse(stored);
            if (user.language) setLang(user.language);
            if (user.state) setState(user.state);
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (text?: string) => {
        const msg = (text || input).trim();
        if (!msg) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setIsTyping(true);

        try {
            const res = await fetch('/api/v1/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, language: lang, state }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.answer,
                steps: data.steps,
                docs: data.documents_required,
                timeline: data.timeline,
                sources: data.sources,
            }]);
        } catch {
            // Fallback offline response
            const fallbacks: Record<string, string> = {
                'voter id': 'To apply for a Voter ID: Visit voters.eci.gov.in → Fill Form 6 → Upload age & address proof → Submit. You will receive your EPIC card within 30 days.',
                'moved': 'If you moved to a new constituency, fill a fresh Form 6 at voters.eci.gov.in for the new address. Your old registration will be cancelled automatically.',
                'lost': 'If you lost your Voter ID, you can (1) Download e-EPIC at voters.eci.gov.in with your EPIC number, or (2) Fill Form 8 for a duplicate card.',
                'nota': 'NOTA stands for None Of The Above. It was introduced in 2013 to allow voters to reject all candidates. The NOTA symbol appears at the bottom of the EVM ballot.',
                'evm': 'EVM (Electronic Voting Machine) has a Ballot Unit with candidate buttons and a Control Unit. Press the button next to your candidate. VVPAT shows a paper slip for 7 seconds confirming your vote.',
            };
            const key = Object.keys(fallbacks).find(k => msg.toLowerCase().includes(k));
            setMessages(prev => [...prev, {
                role: 'ai',
                text: key ? fallbacks[key] : 'For this query, please visit eci.gov.in or voters.eci.gov.in for official information. (API unavailable in offline mode)',
                sources: [{ title: 'ECI Official Website', source: 'Election Commission of India', url: 'https://eci.gov.in' }],
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggested = lang === 'hi' ? SUGGESTED_HI : SUGGESTED;

    return (
        <main className="min-h-screen" style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
            {/* Navbar */}
            <header className="glass" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', flexShrink: 0 }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>←</span>
                    <span style={{ fontWeight: 700 }}>
                        {lang === 'en' ? '🤖 AI Election Assistant' : '🤖 AI चुनाव सहायक'}
                    </span>
                </Link>
                <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                    {lang === 'en' ? '🇮🇳 हिंदी' : '🇮🇳 English'}
                </button>
            </header>

            {/* Chat area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '820px', width: '100%', margin: '0 auto' }}>

                {/* Suggested prompts */}
                {messages.length <= 1 && (
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textAlign: 'center' }}>
                            {lang === 'en' ? '💡 Suggested questions' : '💡 सुझाए गए प्रश्न'}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                            {suggested.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => send(s)}
                                    className="glass"
                                    style={{ padding: '8px 14px', borderRadius: '100px', fontSize: '0.82rem', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', transition: 'all 0.2s' }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                            <p style={{ margin: 0, lineHeight: 1.65, fontSize: '0.95rem' }}>{m.text}</p>

                            {m.steps && m.steps.length > 0 && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Steps:</p>
                                    {m.steps.map((s, j) => (
                                        <p key={j} style={{ fontSize: '0.85rem', margin: '4px 0', color: 'rgba(255,255,255,0.75)' }}>• {s}</p>
                                    ))}
                                </div>
                            )}

                            {m.docs && m.docs.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Documents:</p>
                                    {m.docs.map((d, j) => (
                                        <span key={j} className="glass" style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem', marginRight: '6px', marginBottom: '4px' }}>
                                            📎 {d}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {m.sources && m.sources.length > 0 && (
                                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    {m.sources.map((s, j) => (
                                        <a key={j} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,107,53,0.8)', textDecoration: 'none', marginBottom: '2px' }}>
                                            🔗 {s.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="chat-bubble-ai" style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '14px 18px' }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,107,53,0.6)', animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ flexShrink: 0, padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,12,30,0.8)', backdropFilter: 'blur(16px)' }}>
                <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                        placeholder={lang === 'en' ? 'Ask about voter registration, elections, EVM...' : 'मतदाता पंजीकरण, चुनाव, EVM के बारे में पूछें...'}
                        style={{
                            flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '14px', padding: '14px 18px', color: 'white', fontSize: '0.95rem',
                        }}
                        id="chat-input"
                        aria-label="Chat input"
                    />
                    <button
                        onClick={() => send()}
                        disabled={!input.trim() || isTyping}
                        className="btn-primary"
                        style={{ padding: '14px 24px', borderRadius: '14px', opacity: (!input.trim() || isTyping) ? 0.6 : 1 }}
                        id="chat-send-btn"
                        aria-label="Send message"
                    >
                        Send ↗
                    </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>
                    Responses sourced from ECI official documents · Always verify at eci.gov.in
                </p>
            </div>
        </main>
    );
}
