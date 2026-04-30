'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Question {
    id: number;
    question: string;
    question_hi: string;
    type: 'mcq' | 'true_false';
    options: { id: string; text: string; text_hi: string }[];
    category: string;
}

interface AnswerResult {
    correct: boolean;
    correct_answer: string;
    explanation: string;
    explanation_hi: string;
}

const LOCAL_QUESTIONS: Question[] = [
    {
        id: 1, question: 'What is the minimum age to vote in India?', question_hi: 'भारत में मतदान करने की न्यूनतम आयु क्या है?', type: 'mcq', category: 'eligibility',
        options: [{ id: 'a', text: '16 years', text_hi: '16 वर्ष' }, { id: 'b', text: '18 years', text_hi: '18 वर्ष' }, { id: 'c', text: '21 years', text_hi: '21 वर्ष' }, { id: 'd', text: '25 years', text_hi: '25 वर्ष' }]
    },
    {
        id: 2, question: 'NOTA stands for ____?', question_hi: 'NOTA का पूर्ण रूप क्या है?', type: 'mcq', category: 'voting_process',
        options: [{ id: 'a', text: 'None Of The Above', text_hi: 'उपरोक्त में से कोई नहीं' }, { id: 'b', text: 'Not On The Agenda', text_hi: 'एजेंडे पर नहीं' }, { id: 'c', text: 'None Of The Aspirants', text_hi: 'उम्मीदवारों में से कोई नहीं' }, { id: 'd', text: 'No Other Than Approved', text_hi: 'स्वीकृत के अतिरिक्त नहीं' }]
    },
    {
        id: 3, question: 'You can vote with an Aadhaar card even without a Voter ID.', question_hi: 'आधार कार्ड से मतदाता पहचान पत्र के बिना भी मत दे सकते हैं।', type: 'true_false', category: 'voting_process',
        options: [{ id: 'true', text: 'True', text_hi: 'सत्य' }, { id: 'false', text: 'False', text_hi: 'असत्य' }]
    },
    {
        id: 4, question: 'Which form is used for new voter registration?', question_hi: 'नए मतदाता पंजीकरण के लिए कौन सा फॉर्म?', type: 'mcq', category: 'registration',
        options: [{ id: 'a', text: 'Form 4', text_hi: 'फॉर्म 4' }, { id: 'b', text: 'Form 6', text_hi: 'फॉर्म 6' }, { id: 'c', text: 'Form 8', text_hi: 'फॉर्म 8' }, { id: 'd', text: 'Form 10', text_hi: 'फॉर्म 10' }]
    },
    {
        id: 5, question: 'EVM stands for Electronic Voting Machine.', question_hi: 'EVM का मतलब इलेक्ट्रॉनिक वोटिंग मशीन है।', type: 'true_false', category: 'evm',
        options: [{ id: 'true', text: 'True', text_hi: 'सत्य' }, { id: 'false', text: 'False', text_hi: 'असत्य' }]
    },
    {
        id: 6, question: 'What does VVPAT stand for?', question_hi: 'VVPAT का पूर्ण रूप क्या है?', type: 'mcq', category: 'evm',
        options: [{ id: 'a', text: 'Voter Verified Paper Audit Trail', text_hi: 'मतदाता सत्यापित पेपर ऑडिट ट्रेल' }, { id: 'b', text: 'Voting Verification Print Audit Terminal', text_hi: 'वोटिंग सत्यापन प्रिंट ऑडिट टर्मिनल' }, { id: 'c', text: 'Verified Voter Paper Authentication Tool', text_hi: 'सत्यापित मतदाता पेपर प्रमाणीकरण उपकरण' }, { id: 'd', text: 'Vote Validity Paper Approval Template', text_hi: 'वोट वैधता पेपर अनुमोदन टेम्पलेट' }]
    },
    {
        id: 7, question: 'Voting is mandatory in India by law.', question_hi: 'भारत में कानून द्वारा मतदान अनिवार्य है।', type: 'true_false', category: 'myths',
        options: [{ id: 'true', text: 'True', text_hi: 'सत्य' }, { id: 'false', text: 'False', text_hi: 'असत्य' }]
    },
    {
        id: 8, question: 'NRIs who hold Indian citizenship can register to vote.', question_hi: 'भारतीय नागरिकता वाले NRI मतदाता पंजीकरण करा सकते हैं।', type: 'true_false', category: 'eligibility',
        options: [{ id: 'true', text: 'True', text_hi: 'सत्य' }, { id: 'false', text: 'False', text_hi: 'असत्य' }]
    },
];

const ANSWERS: Record<number, { correct: string; explanation: string; explanation_hi: string }> = {
    1: { correct: 'b', explanation: 'Under Article 326, every citizen 18+ is entitled to vote.', explanation_hi: 'संविधान के अनुच्छेद 326 के तहत 18+ का हर नागरिक मत दे सकता है।' },
    2: { correct: 'a', explanation: 'NOTA (None Of The Above) was introduced in 2013 by the Supreme Court.', explanation_hi: 'NOTA 2013 में सुप्रीम कोर्ट द्वारा शुरू किया गया था।' },
    3: { correct: 'true', explanation: 'ECI allows 12 alternate photo IDs including Aadhaar, Passport, PAN Card, Driving Licence etc.', explanation_hi: 'ECI 12 वैकल्पिक फोटो पहचान पत्र की अनुमति देता है।' },
    4: { correct: 'b', explanation: 'Form 6 is the application form for new voter registration at voters.eci.gov.in.', explanation_hi: 'फॉर्म 6 नए मतदाता पंजीकरण के लिए है।' },
    5: { correct: 'true', explanation: 'EVM (Electronic Voting Machine) replaced paper ballots in Indian elections since 1998.', explanation_hi: 'EVM ने 1998 से कागजी मतपत्रों की जगह ली।' },
    6: { correct: 'a', explanation: 'VVPAT displays a paper slip for 7 seconds after you vote to confirm your choice.', explanation_hi: 'VVPAT मतदान के बाद 7 सेकंड के लिए पर्ची दिखाता है।' },
    7: { correct: 'false', explanation: 'Voting is NOT mandatory nationally in India. Only Gujarat has compulsory local body voting.', explanation_hi: 'राष्ट्रीय स्तर पर भारत में मतदान अनिवार्य नहीं है।' },
    8: { correct: 'true', explanation: 'NRIs who are Indian citizens can register as overseas electors using Form 6A.', explanation_hi: 'भारतीय नागरिक NRI फॉर्म 6A से प्रवासी मतदाता के रूप में पंजीकरण करा सकते हैं।' },
};

const CATEGORY_COLORS: Record<string, string> = {
    eligibility: '#FF6B35', voting_process: '#3D52A0', registration: '#138808',
    evm: '#F4C542', myths: '#9333EA', general: '#0EA5E9',
};

export default function QuizPage() {
    const [questions, setQuestions] = useState<Question[]>(LOCAL_QUESTIONS);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [result, setResult] = useState<AnswerResult | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [history, setHistory] = useState<boolean[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('mv_user');
        if (stored) { const u = JSON.parse(stored); if (u.language) setLang(u.language); }
        fetch('/api/v1/quiz').then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setQuestions(d); }).catch(() => { });
    }, []);

    const q = questions[current];

    const handleAnswer = async (optId: string) => {
        if (selected) return;
        setSelected(optId);

        let answer: AnswerResult;
        try {
            const res = await fetch('/api/v1/quiz/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question_id: q.id, answer: optId }),
            });
            answer = await res.json();
        } catch {
            const local = ANSWERS[q.id];
            answer = {
                correct: optId === local?.correct,
                correct_answer: local?.correct || 'a',
                explanation: local?.explanation || '',
                explanation_hi: local?.explanation_hi || '',
            };
        }

        setResult(answer);
        if (answer.correct) setScore(s => s + 1);
        setHistory(h => [...h, answer.correct]);
    };

    const next = () => {
        if (current + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setResult(null);
        }
    };

    const restart = () => {
        setCurrent(0); setSelected(null); setResult(null);
        setScore(0); setFinished(false); setHistory([]);
    };

    const pct = Math.round((score / questions.length) * 100);

    if (finished) {
        return (
            <div className="min-h-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '📚'}</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>
                        {lang === 'en' ? 'Quiz Complete!' : 'प्रश्नोत्तरी पूर्ण!'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '28px' }}>
                        {lang === 'en' ? 'Your Score' : 'आपका स्कोर'}
                    </p>
                    <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '8px' }} className="heading-gradient">{score}/{questions.length}</div>
                    <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '28px' }}>{pct}%</div>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '28px' }}>
                        {history.map((correct, i) => (
                            <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: correct ? '#138808' : '#DC2626' }} />
                        ))}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', font: '0.95rem/1.6 Inter, sans-serif' }}>
                        {pct >= 80 ? (lang === 'en' ? 'Excellent! You know your rights well. 🇮🇳' : 'उत्कृष्ट! आप अपने अधिकार अच्छे से जानते हैं।')
                            : pct >= 60 ? (lang === 'en' ? 'Good effort! Keep learning more.' : 'अच्छा प्रयास! और सीखते रहें।')
                                : (lang === 'en' ? 'Keep going! Use the AI assistant to learn more.' : 'जारी रखें! AI सहायक से और सीखें।')}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={restart} className="btn-primary">{lang === 'en' ? '🔁 Retake Quiz' : '🔁 फिर से दें'}</button>
                        <Link href="/chat" className="btn-secondary">{lang === 'en' ? '🤖 Ask AI' : '🤖 AI से पूछें'}</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ padding: '0 0 60px' }}>
            <nav className="glass" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>←</span>
                    <span style={{ fontWeight: 700 }}>{lang === 'en' ? '📚 Election Quiz' : '📚 चुनाव प्रश्नोत्तरी'}</span>
                </Link>
                <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                    {lang === 'en' ? '🇮🇳 हिंदी' : '🇮🇳 English'}
                </button>
            </nav>

            <main style={{ maxWidth: '680px', margin: '40px auto', padding: '0 24px' }}>
                {/* Progress */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        <span>{lang === 'en' ? `Question ${current + 1} of ${questions.length}` : `प्रश्न ${current + 1}/${questions.length}`}</span>
                        <span style={{ color: 'var(--color-gold)' }}>⭐ {score} correct</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                        {questions.map((_, i) => (
                            <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < history.length ? (history[i] ? '#138808' : '#DC2626') : i === current ? '#FF6B35' : 'rgba(255,255,255,0.1)' }} />
                        ))}
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-card" style={{ padding: '36px' }} key={q.id}>
                    {/* Category Badge */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: `${CATEGORY_COLORS[q.category]}22`, color: CATEGORY_COLORS[q.category] || '#FF6B35', border: `1px solid ${CATEGORY_COLORS[q.category]}44` }}>
                            {q.category.replace('_', ' ')}
                        </span>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                            {q.type === 'true_false' ? 'True / False' : 'Multiple Choice'}
                        </span>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.55, marginBottom: '28px' }}>
                        {lang === 'hi' ? q.question_hi : q.question}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        {q.options.map(opt => {
                            const isSelected = selected === opt.id;
                            const isCorrect = result && opt.id === result.correct_answer;
                            const isWrong = isSelected && result && !result.correct;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer(opt.id)}
                                    disabled={!!selected}
                                    className={`quiz-option${isCorrect && selected ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
                                    id={`quiz-opt-${q.id}-${opt.id}`}
                                >
                                    <span style={{ fontWeight: 700, marginRight: '12px', opacity: 0.5 }}>{opt.id.toUpperCase()}.</span>
                                    {lang === 'hi' ? opt.text_hi : opt.text}
                                    {isCorrect && selected && <span style={{ float: 'right' }}>✅</span>}
                                    {isWrong && <span style={{ float: 'right' }}>❌</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {result && (
                        <div style={{ padding: '16px', borderRadius: '12px', background: result.correct ? 'rgba(19,136,8,0.12)' : 'rgba(220,38,38,0.10)', border: `1px solid ${result.correct ? 'rgba(19,136,8,0.3)' : 'rgba(220,38,38,0.25)'}`, marginBottom: '20px' }}>
                            <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>
                                {result.correct ? '✅ Correct!' : '❌ Incorrect'}
                            </div>
                            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
                                {lang === 'hi' ? result.explanation_hi : result.explanation}
                            </p>
                        </div>
                    )}

                    {selected && (
                        <button onClick={next} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} id="quiz-next-btn">
                            {current + 1 >= questions.length
                                ? (lang === 'en' ? '🏆 See Results' : '🏆 परिणाम देखें')
                                : (lang === 'en' ? 'Next Question →' : 'अगला प्रश्न →')}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
