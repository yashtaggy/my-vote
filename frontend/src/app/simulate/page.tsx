'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Candidate { id: number; name: string; party: string; symbol: string; }
interface SimStep {
    id: string; label: string; label_hi: string;
    description: string; description_hi: string; icon: string;
}

const SIM_STEPS: SimStep[] = [
    { id: 'enter_booth', icon: '🚪', label: 'Enter Booth', label_hi: 'केंद्र में प्रवेश', description: 'Walk into the polling booth and approach the presiding officer.', description_hi: 'मतदान केंद्र में प्रवेश करें और पीठासीन अधिकारी के पास जाएं।' },
    { id: 'show_id', icon: '🪪', label: 'Show ID', label_hi: 'पहचान पत्र दिखाएं', description: 'Present your Voter ID or approved alternate ID to the polling officer.', description_hi: 'मतदान अधिकारी को मतदाता पहचान पत्र या स्वीकृत ID दिखाएं।' },
    { id: 'sign_register', icon: '✍️', label: 'Sign Register', label_hi: 'रजिस्टर पर हस्ताक्षर', description: 'Sign the electoral register or give left thumb impression. Ink is applied on your finger.', description_hi: 'मतदाता रजिस्टर पर हस्ताक्षर करें। उंगली पर अमिट स्याही लगाई जाती है।' },
    { id: 'receive_slip', icon: '📄', label: 'Proceed to EVM', label_hi: 'EVM की ओर जाएं', description: 'Approach the Electronic Voting Machine in the private voting compartment.', description_hi: 'निजी मतदान कक्ष में EVM के पास जाएं।' },
    { id: 'press_evm', icon: '🗳️', label: 'Cast Your Vote', label_hi: 'वोट डालें', description: 'Press the button next to your chosen candidate. VVPAT shows slip for 7 seconds.', description_hi: 'अपने उम्मीदवार के बगल वाला बटन दबाएं। VVPAT 7 सेकंड दिखाता है।' },
    { id: 'complete', icon: '🎉', label: 'Vote Complete!', label_hi: 'मतदान पूर्ण!', description: 'Your vote has been securely recorded. Thank you for participating!', description_hi: 'आपका वोट सुरक्षित रूप से दर्ज किया गया। भाग लेने के लिए धन्यवाद!' },
];

const CANDIDATES: Candidate[] = [
    { id: 1, name: 'Priya Sharma', party: 'National Progress Party', symbol: '🌿' },
    { id: 2, name: 'Rajesh Kumar', party: "People's Democratic Front", symbol: '⭐' },
    { id: 3, name: 'Anita Desai', party: 'Lok Shakti Party', symbol: '🌸' },
    { id: 4, name: 'Mohammed Iqbal', party: 'United Development Party', symbol: '🔔' },
    { id: 5, name: 'NOTA', party: 'None Of The Above', symbol: '✖️' },
];

type ErrorScenario = 'none' | 'no_id' | 'name_not_found';

export default function SimulatePage() {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [voterIdInput, setVoterIdInput] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [vvpatVisible, setVvpatVisible] = useState(false);
    const [vvpatCandidate, setVvpatCandidate] = useState<Candidate | null>(null);
    const [errorScenario, setErrorScenario] = useState<ErrorScenario>('none');
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [animating, setAnimating] = useState(false);
    const [sessionId] = useState(() => 'sim-' + Date.now());
    const [message, setMessage] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('mv_user');
        if (stored) { const u = JSON.parse(stored); if (u.language) setLang(u.language); }
    }, []);

    const currentStep = SIM_STEPS[currentStepIdx];
    const isLastStep = currentStepIdx === SIM_STEPS.length - 1;
    const isEVMStep = currentStep?.id === 'press_evm';
    const isShowIDStep = currentStep?.id === 'show_id';

    const advance = async () => {
        if (isShowIDStep && !voterIdInput.trim()) {
            setErrorScenario('no_id');
            return;
        }

        setAnimating(true);
        setErrorScenario('none');

        // Call backend simulation (graceful fallback)
        try {
            const res = await fetch('/api/v1/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    action: currentStep.id,
                    voter_id: voterIdInput || null,
                    candidate_choice: selectedCandidate,
                }),
            });
            const data = await res.json();
            if (!data.success) {
                setErrorScenario(data.error || 'none');
                setAnimating(false);
                return;
            }
            if (data.message) setMessage(data.message);
        } catch { /* offline mode OK */ }

        setTimeout(() => {
            setCurrentStepIdx(i => Math.min(i + 1, SIM_STEPS.length - 1));
            setAnimating(false);
        }, 400);
    };

    const castVote = () => {
        if (!selectedCandidate) return;
        const candidate = CANDIDATES.find(c => c.id === selectedCandidate)!;
        setVvpatCandidate(candidate);
        setVvpatVisible(true);
        setTimeout(() => {
            setVvpatVisible(false);
            setCurrentStepIdx(SIM_STEPS.length - 1);
        }, 7000);
    };

    const restart = () => {
        setCurrentStepIdx(0); setVoterIdInput('');
        setSelectedCandidate(null); setVvpatVisible(false);
        setVvpatCandidate(null); setErrorScenario('none');
        setMessage('');
    };

    return (
        <div className="min-h-screen" style={{ padding: '0 0 60px' }}>
            <nav className="glass" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>←</span>
                    <span style={{ fontWeight: 700 }}>{lang === 'en' ? '🗳️ Voting Simulation' : '🗳️ मतदान सिमुलेशन'}</span>
                </Link>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={restart} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>🔁 Reset</button>
                    <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                        {lang === 'en' ? '🇮🇳 हिंदी' : '🇮🇳 English'}
                    </button>
                </div>
            </nav>

            <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
                {/* Step progress */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '36px', flexWrap: 'wrap' }}>
                    {SIM_STEPS.map((s, i) => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700,
                                background: i < currentStepIdx ? 'rgba(19,136,8,0.3)' : i === currentStepIdx ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.06)',
                                border: `2px solid ${i < currentStepIdx ? '#138808' : i === currentStepIdx ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`,
                                color: i < currentStepIdx ? '#6EE7A6' : i === currentStepIdx ? '#FF8C5A' : 'rgba(255,255,255,0.3)',
                            }}>
                                {i < currentStepIdx ? '✓' : s.icon}
                            </div>
                            {i < SIM_STEPS.length - 1 && (
                                <div style={{ width: '24px', height: '2px', background: i < currentStepIdx ? '#138808' : 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* VVPAT Overlay */}
                {vvpatVisible && vvpatCandidate && (
                    <div role="alert" aria-live="polite" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <div style={{ background: '#F8F8E8', borderRadius: '16px', padding: '32px', textAlign: 'center', border: '4px solid #138808', maxWidth: '320px' }}>
                            <div style={{ color: '#1A1F4B', fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase' }}>📄 VVPAT Paper Slip</div>
                            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{vvpatCandidate.symbol}</div>
                            <div style={{ color: '#1A1F4B', fontWeight: 800, fontSize: '1.1rem' }}>{vvpatCandidate.name}</div>
                            <div style={{ color: '#555', fontSize: '0.85rem', marginBottom: '16px' }}>{vvpatCandidate.party}</div>
                            <div style={{ color: '#138808', fontWeight: 700, fontSize: '0.9rem' }}>✅ Your vote is recorded!</div>
                            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#888' }}>This slip will be hidden in 7 seconds</div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: isEVMStep ? '1fr 1fr' : '1fr', gap: '24px' }}>

                    {/* Step Card */}
                    <div className="glass-card" style={{ padding: '36px', opacity: animating ? 0.6 : 1, transition: 'opacity 0.3s' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '16px', textAlign: 'center' }}>{currentStep.icon}</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
                            {lang === 'hi' ? currentStep.label_hi : currentStep.label}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.7, marginBottom: '28px' }}>
                            {lang === 'hi' ? currentStep.description_hi : currentStep.description}
                        </p>

                        {/* Error display */}
                        {errorScenario !== 'none' && (
                            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', marginBottom: '20px' }}>
                                <p style={{ color: '#FCA5A5', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                                    {errorScenario === 'no_id'
                                        ? (lang === 'en'
                                            ? '❌ No valid ID presented. You must show a Voter ID, Aadhaar, Passport, Driving Licence, or PAN Card.'
                                            : '❌ कोई मान्य पहचान पत्र नहीं। मतदाता पहचान पत्र, आधार, पासपोर्ट, ड्राइविंग लाइसेंस या PAN कार्ड लाएं।')
                                        : '❌ Name not found in electoral roll. Please verify your registration.'}
                                </p>
                            </div>
                        )}

                        {/* Special inputs for ID step */}
                        {isShowIDStep && !isLastStep && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                                    {lang === 'en' ? 'Enter Voter ID / EPIC Number (required):' : 'मतदाता पहचान संख्या दर्ज करें (आवश्यक):'}
                                </label>
                                <input
                                    value={voterIdInput}
                                    onChange={e => setVoterIdInput(e.target.value)}
                                    placeholder="e.g. ABC1234567"
                                    aria-label="Enter Voter ID"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '0.95rem', marginBottom: '8px' }}
                                    id="voter-id-input"
                                />
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['ABC1234567', 'DL/01/001/001234', 'AADHAAR-OK'].map(preset => (
                                        <button key={preset} onClick={() => setVoterIdInput(preset)} className="glass" style={{ padding: '5px 12px', borderRadius: '100px', fontSize: '0.75rem', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', border: 'none' }}>
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isEVMStep && !isLastStep && (
                            <button onClick={advance} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} id={`sim-btn-${currentStep.id}`} disabled={animating}>
                                {lang === 'en' ? 'Continue →' : 'जारी रखें →'}
                            </button>
                        )}

                        {isLastStep && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎊</div>
                                <p style={{ color: '#6EE7A6', fontWeight: 700, marginBottom: '20px' }}>
                                    {lang === 'en' ? 'Simulation complete! You now know how to vote.' : 'सिमुलेशन पूर्ण! अब आप जानते हैं कि कैसे वोट करें।'}
                                </p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button onClick={restart} className="btn-primary">🔁 {lang === 'en' ? 'Try Again' : 'फिर से'}</button>
                                    <Link href="/journey" className="btn-secondary">📋 {lang === 'en' ? 'Journey Steps' : 'यात्रा के चरण'}</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EVM Panel */}
                    {isEVMStep && (
                        <div className="evm-machine">
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,107,53,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                    🗳️ EVM — Ballot Unit
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                                    {lang === 'en' ? 'Constituency: Demo (Mock Election)' : 'निर्वाचन क्षेत्र: डेमो (नकली चुनाव)'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                {CANDIDATES.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCandidate(c.id)}
                                        className={`evm-button ${selectedCandidate === c.id ? 'selected' : ''}`}
                                        id={`evm-candidate-${c.id}`}
                                        aria-pressed={selectedCandidate === c.id}
                                    >
                                        <span style={{ fontSize: '1.4rem' }}>{c.symbol}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{c.party}</div>
                                        </div>
                                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `3px solid ${selectedCandidate === c.id ? '#138808' : 'rgba(255,255,255,0.15)'}`, background: selectedCandidate === c.id ? '#138808' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem' }}>
                                            {selectedCandidate === c.id && '✓'}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={castVote}
                                disabled={!selectedCandidate || vvpatVisible}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: !selectedCandidate ? 0.5 : 1 }}
                                id="evm-cast-vote-btn"
                            >
                                {lang === 'en' ? '🔵 CAST VOTE' : '🔵 वोट डालें'}
                            </button>

                            {selectedCandidate && (
                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                                    {lang === 'en' ? 'VVPAT will show slip for 7 seconds' : 'VVPAT 7 सेकंड के लिए पर्ची दिखाएगा'}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Error scenario selector (educational) */}
                {currentStep.id === 'show_id' && errorScenario === 'none' && (
                    <div className="glass" style={{ padding: '16px 20px', marginTop: '20px', borderRadius: '14px' }}>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                            {lang === 'en' ? '⚠️ Test error scenarios:' : '⚠️ त्रुटि परिदृश्य आज़माएं:'}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button onClick={() => { setVoterIdInput(''); advance(); }} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
                                🚫 {lang === 'en' ? 'No ID' : 'ID नहीं'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
