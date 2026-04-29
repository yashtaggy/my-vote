"""
Static structured election data for India.
This acts as the ground-truth knowledge base for the RAG pipeline
and API responses when live data is unavailable.
"""

INDIA_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
]

UPCOMING_ELECTIONS = {
    "Bihar": {
        "name": "Bihar Vidhan Sabha Elections",
        "date": "2025-10-15",
        "type": "State Assembly",
        "phases": 3,
    },
    "Delhi": {
        "name": "Delhi Vidhan Sabha Elections",
        "date": "2025-02-08",
        "type": "State Assembly",
        "phases": 1,
    },
    "default": {
        "name": "Lok Sabha General Elections 2029",
        "date": "2029-04-01",
        "type": "General Election",
        "phases": 7,
    },
}

JOURNEY_STEPS = [
    {
        "step_id": 1,
        "title": "Eligibility Check",
        "title_hi": "पात्रता जांच",
        "description": (
            "You must be a citizen of India, at least 18 years old on "
            "the qualifying date (1st January of the year), and ordinarily "
            "resident in the constituency you wish to register in."
        ),
        "description_hi": (
            "आपको भारत का नागरिक होना चाहिए, पात्रता तिथि (वर्ष की 1 जनवरी) को "
            "कम से कम 18 वर्ष का होना चाहिए, और आप जिस निर्वाचन क्षेत्र में पंजीकरण "
            "कराना चाहते हैं, उसके सामान्य निवासी होने चाहिए।"
        ),
        "actions": [
            {"action": "Confirm you are 18+ as of January 1 of the current year", "action_hi": "सुनिश्चित करें कि आप 1 जनवरी तक 18+ हैं"},
            {"action": "Confirm Indian citizenship", "action_hi": "भारतीय नागरिकता की पुष्टि करें"},
            {"action": "Confirm current residential address", "action_hi": "वर्तमान आवासीय पता सत्यापित करें"},
        ],
        "documents": ["Proof of Age (Birth Certificate / Aadhaar / Passport)", "Proof of Address", "Proof of Citizenship"],
        "official_reference": "Representation of the People Act, 1950 — Section 19, 20",
        "official_url": "https://eci.gov.in/electoral-rolls/",
        "icon": "shield-check",
    },
    {
        "step_id": 2,
        "title": "Voter Registration (Form 6)",
        "title_hi": "मतदाता पंजीकरण (फॉर्म 6)",
        "description": (
            "Apply for inclusion in the Electoral Roll using Form 6 on the "
            "Voter Service Portal (voters.eci.gov.in) or at your nearest "
            "Booth Level Officer (BLO). You may also register via the Voter "
            "Helpline App."
        ),
        "description_hi": (
            "Voter Service Portal (voters.eci.gov.in) पर Form 6 का उपयोग करके "
            "या अपने निकटतम Booth Level Officer (BLO) के पास Electoral Roll में "
            "शामिल होने के लिए आवेदन करें।"
        ),
        "actions": [
            {"action": "Visit voters.eci.gov.in and click 'New Voter Registration'", "action_hi": "voters.eci.gov.in पर जाएं और 'नया मतदाता पंजीकरण' पर क्लिक करें"},
            {"action": "Fill Form 6 with personal details", "action_hi": "व्यक्तिगत विवरण के साथ फॉर्म 6 भरें"},
            {"action": "Upload scanned documents", "action_hi": "स्कैन किए गए दस्तावेज़ अपलोड करें"},
            {"action": "Submit and note your reference number", "action_hi": "सबमिट करें और अपना संदर्भ नंबर नोट करें"},
        ],
        "documents": [
            "Recent passport-size photograph",
            "Proof of Age (Aadhaar / Birth Certificate / School Certificate)",
            "Proof of Address (Aadhaar / Passport / Utility Bill)",
        ],
        "official_reference": "Form 6 — Registration of electors, ECI",
        "official_url": "https://voters.eci.gov.in/",
        "icon": "file-text",
    },
    {
        "step_id": 3,
        "title": "Verification & Electoral Roll",
        "title_hi": "सत्यापन और मतदाता सूची",
        "description": (
            "After submission, the Electoral Registration Officer (ERO) "
            "verifies your application within 30 days. You can track your "
            "application status online. Once approved, your name appears in "
            "the Electoral Roll."
        ),
        "description_hi": (
            "जमा करने के बाद, Electoral Registration Officer (ERO) 30 दिनों के "
            "भीतर आपके आवेदन का सत्यापन करता है। आप ऑनलाइन अपने आवेदन की स्थिति "
            "ट्रैक कर सकते हैं।"
        ),
        "actions": [
            {"action": "Track application at voters.eci.gov.in/track-application", "action_hi": "voters.eci.gov.in पर आवेदन ट्रैक करें"},
            {"action": "Search your name in electoral roll", "action_hi": "मतदाता सूची में अपना नाम खोजें"},
            {"action": "Download or note Voter ID / EPIC number", "action_hi": "मतदाता पहचान पत्र / EPIC नंबर डाउनलोड करें"},
        ],
        "documents": ["Application Reference Number", "Mobile number linked to application"],
        "official_reference": "Electoral Registration Officers Rules, 1960",
        "official_url": "https://electoralsearch.eci.gov.in/",
        "icon": "search",
    },
    {
        "step_id": 4,
        "title": "Polling Day Preparation",
        "title_hi": "मतदान दिवस की तैयारी",
        "description": (
            "On election day, locate your polling booth (available on ECI "
            "website), carry required ID proof, and cast your vote. Voting "
            "is your constitutional right under Article 326."
        ),
        "description_hi": (
            "चुनाव के दिन, अपने मतदान केंद्र का पता लगाएं (ECI वेबसाइट पर "
            "उपलब्ध), आवश्यक पहचान प्रमाण लाएं, और अपना वोट डालें।"
        ),
        "actions": [
            {"action": "Find your polling booth at electoralsearch.eci.gov.in", "action_hi": "electoralsearch.eci.gov.in पर मतदान केंद्र खोजें"},
            {"action": "Carry Voter ID (EPIC) or any approved alternate ID", "action_hi": "मतदाता पहचान पत्र (EPIC) या कोई स्वीकृत वैकल्पिक ID लाएं"},
            {"action": "Arrive at polling booth between 7 AM – 6 PM", "action_hi": "मतदान केंद्र पर सुबह 7 बजे से शाम 6 बजे के बीच पहुंचें"},
            {"action": "Do NOT carry mobile phone inside booth", "action_hi": "मतदान केंद्र के अंदर मोबाइल फोन न ले जाएं"},
        ],
        "documents": [
            "Voter ID Card (EPIC)",
            "Alternate IDs: Aadhaar, Passport, Driving Licence, PAN Card, MNREGA Job Card, Bank/Post Office Passbook with photo",
        ],
        "official_reference": "Conduct of Elections Rules, 1961 — Rule 49",
        "official_url": "https://eci.gov.in/faqs/elections/voter-faqs/",
        "icon": "map-pin",
    },
    {
        "step_id": 5,
        "title": "Cast Your Vote (EVM)",
        "title_hi": "अपना वोट डालें (EVM)",
        "description": (
            "Inside the polling booth, verify your identity, sign/thumbprint "
            "the register, receive an ink mark on your finger, and press the "
            "button next to your chosen candidate on the Electronic Voting Machine (EVM). "
            "VVPAT will show a paper slip for 7 seconds."
        ),
        "description_hi": (
            "मतदान केंद्र के अंदर, अपनी पहचान सत्यापित करें, रजिस्टर में "
            "हस्ताक्षर/अंगूठे का निशान लगाएं, अपनी उंगली पर स्याही का निशान "
            "प्राप्त करें, और EVM पर अपने चुने हुए उम्मीदवार के बगल वाला बटन दबाएं।"
        ),
        "actions": [
            {"action": "Verify name in presiding officer's register", "action_hi": "पीठासीन अधिकारी के रजिस्टर में नाम सत्यापित करें"},
            {"action": "Get indelible ink mark on left index finger", "action_hi": "बाईं तर्जनी पर अमिट स्याही का निशान लगवाएं"},
            {"action": "Go to EVM and press button for chosen candidate", "action_hi": "EVM के पास जाएं और चुने हुए उम्मीदवार का बटन दबाएं"},
            {"action": "Verify VVPAT paper slip (7 seconds)", "action_hi": "VVPAT पर्ची को 7 सेकंड के लिए सत्यापित करें"},
            {"action": "Exit polling booth quietly", "action_hi": "शांतिपूर्वक मतदान केंद्र से बाहर जाएं"},
        ],
        "documents": [],
        "official_reference": "EVM & VVPAT — Election Commission of India",
        "official_url": "https://eci.gov.in/evm/",
        "icon": "check-square",
    },
]

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the minimum age to vote in India?",
        "question_hi": "भारत में मतदान करने की न्यूनतम आयु क्या है?",
        "type": "mcq",
        "options": [
            {"id": "a", "text": "16 years", "text_hi": "16 वर्ष"},
            {"id": "b", "text": "18 years", "text_hi": "18 वर्ष"},
            {"id": "c", "text": "21 years", "text_hi": "21 वर्ष"},
            {"id": "d", "text": "25 years", "text_hi": "25 वर्ष"},
        ],
        "correct_answer": "b",
        "explanation": "Under Article 326 of the Indian Constitution, every citizen who is 18 years or above is entitled to vote.",
        "explanation_hi": "भारतीय संविधान के अनुच्छेद 326 के तहत, 18 वर्ष या उससे अधिक आयु का प्रत्येक नागरिक मतदान करने का हकदार है।",
        "category": "eligibility",
    },
    {
        "id": 2,
        "question": "NOTA stands for ____?",
        "question_hi": "NOTA का पूर्ण रूप क्या है?",
        "type": "mcq",
        "options": [
            {"id": "a", "text": "None Of The Above", "text_hi": "उपरोक्त में से कोई नहीं"},
            {"id": "b", "text": "Not On The Agenda", "text_hi": "एजेंडे पर नहीं"},
            {"id": "c", "text": "No Other Than Approved", "text_hi": "स्वीकृत के अतिरिक्त नहीं"},
            {"id": "d", "text": "None Of The Aspirants", "text_hi": "उम्मीदवारों में से कोई नहीं"},
        ],
        "correct_answer": "a",
        "explanation": "NOTA (None Of The Above) was introduced in 2013 by the Supreme Court, allowing voters to reject all candidates.",
        "explanation_hi": "NOTA (उपरोक्त में से कोई नहीं) 2013 में सुप्रीम कोर्ट द्वारा शुरू किया गया था, जो मतदाताओं को सभी उम्मीदवारों को अस्वीकार करने की अनुमति देता है।",
        "category": "voting_process",
    },
    {
        "id": 3,
        "question": "You can vote even without a Voter ID card if you have an Aadhaar card.",
        "question_hi": "यदि आपके पास आधार कार्ड है तो आप मतदाता पहचान पत्र के बिना भी मत दे सकते हैं।",
        "type": "true_false",
        "options": [
            {"id": "true", "text": "True", "text_hi": "सत्य"},
            {"id": "false", "text": "False", "text_hi": "असत्य"},
        ],
        "correct_answer": "true",
        "explanation": "The ECI allows 12 alternative photo IDs including Aadhaar, Passport, Driving Licence, PAN Card, MNREGA job card etc.",
        "explanation_hi": "ECI आधार, पासपोर्ट, ड्राइविंग लाइसेंस, PAN कार्ड, MNREGA जॉब कार्ड सहित 12 वैकल्पिक फोटो पहचान पत्र की अनुमति देता है।",
        "category": "voting_process",
    },
    {
        "id": 4,
        "question": "Which form is used for new voter registration in India?",
        "question_hi": "भारत में नए मतदाता पंजीकरण के लिए कौन सा फॉर्म उपयोग किया जाता है?",
        "type": "mcq",
        "options": [
            {"id": "a", "text": "Form 4", "text_hi": "फॉर्म 4"},
            {"id": "b", "text": "Form 6", "text_hi": "फॉर्म 6"},
            {"id": "c", "text": "Form 8", "text_hi": "फॉर्म 8"},
            {"id": "d", "text": "Form 10", "text_hi": "फॉर्म 10"},
        ],
        "correct_answer": "b",
        "explanation": "Form 6 is the application form for inclusion in the electoral roll for a person who has not been previously registered.",
        "explanation_hi": "फॉर्म 6 उस व्यक्ति के लिए मतदाता सूची में शामिल होने का आवेदन पत्र है जो पहले पंजीकृत नहीं हुआ है।",
        "category": "registration",
    },
    {
        "id": 5,
        "question": "EVM stands for Electronic Voting Machine.",
        "question_hi": "EVM का मतलब इलेक्ट्रॉनिक वोटिंग मशीन है।",
        "type": "true_false",
        "options": [
            {"id": "true", "text": "True", "text_hi": "सत्य"},
            {"id": "false", "text": "False", "text_hi": "असत्य"},
        ],
        "correct_answer": "true",
        "explanation": "EVM (Electronic Voting Machine) replaced traditional paper ballots in Indian elections starting from 1998.",
        "explanation_hi": "EVM (इलेक्ट्रॉनिक वोटिंग मशीन) ने 1998 से भारतीय चुनावों में पारंपरिक कागजी मतपत्रों की जगह ली।",
        "category": "evm",
    },
    {
        "id": 6,
        "question": "If you move to a new city, which form do you fill to transfer your voter registration?",
        "question_hi": "यदि आप नए शहर में जाते हैं, तो मतदाता पंजीकरण स्थानांतरित करने के लिए कौन सा फॉर्म भरते हैं?",
        "type": "mcq",
        "options": [
            {"id": "a", "text": "Form 6", "text_hi": "फॉर्म 6"},
            {"id": "b", "text": "Form 6A", "text_hi": "फॉर्म 6A"},
            {"id": "c", "text": "Form 8A", "text_hi": "फॉर्म 8A"},
            {"id": "d", "text": "Form 7", "text_hi": "फॉर्म 7"},
        ],
        "correct_answer": "c",
        "explanation": "Form 8A is used for transposing entries within the same constituency when you shift address. For a different constituency, you fill a fresh Form 6.",
        "explanation_hi": "फॉर्म 8A का उपयोग उसी निर्वाचन क्षेत्र में पता बदलने पर किया जाता है। अलग निर्वाचन क्षेत्र के लिए नया फॉर्म 6 भरें।",
        "category": "registration",
    },
    {
        "id": 7,
        "question": "What does VVPAT stand for?",
        "question_hi": "VVPAT का पूर्ण रूप क्या है?",
        "type": "mcq",
        "options": [
            {"id": "a", "text": "Voter Verified Paper Audit Trail", "text_hi": "मतदाता सत्यापित पेपर ऑडिट ट्रेल"},
            {"id": "b", "text": "Voting Verification and Print Audit Terminal", "text_hi": "वोटिंग सत्यापन और प्रिंट ऑडिट टर्मिनल"},
            {"id": "c", "text": "Verified Voter Paper Authentication Tool", "text_hi": "सत्यापित मतदाता पेपर प्रमाणीकरण उपकरण"},
            {"id": "d", "text": "Vote Validity Paper Approval Template", "text_hi": "वोट वैधता पेपर अनुमोदन टेम्पलेट"},
        ],
        "correct_answer": "a",
        "explanation": "VVPAT (Voter Verified Paper Audit Trail) displays a paper slip for 7 seconds after you vote so you can confirm your choice was recorded.",
        "explanation_hi": "VVPAT मतदान के बाद 7 सेकंड के लिए एक कागजी पर्ची दिखाता है ताकि आप पुष्टि कर सकें कि आपकी पसंद दर्ज की गई।",
        "category": "evm",
    },
    {
        "id": 8,
        "question": "A Non-Resident Indian (NRI) cannot vote in Indian elections.",
        "question_hi": "एक अनिवासी भारतीय (NRI) भारतीय चुनावों में मत नहीं दे सकता।",
        "type": "true_false",
        "options": [
            {"id": "true", "text": "True", "text_hi": "सत्य"},
            {"id": "false", "text": "False", "text_hi": "असत्य"},
        ],
        "correct_answer": "false",
        "explanation": "NRIs who are Indian citizens can register as overseas electors (Form 6A) and vote in their registered constituency.",
        "explanation_hi": "भारतीय नागरिक NRI प्रवासी मतदाता (फॉर्म 6A) के रूप में पंजीकरण करा सकते हैं और अपने पंजीकृत निर्वाचन क्षेत्र में मतदान कर सकते हैं।",
        "category": "eligibility",
    },
    {
        "id": 9,
        "question": "What is the Model Code of Conduct (MCC)?",
        "question_hi": "आदर्श आचार संहिता (MCC) क्या है?",
        "type": "mcq",
        "options": [
            {"id": "a", "text": "A document for candidates to follow during elections", "text_hi": "उम्मीदवारों के लिए चुनाव के दौरान पालन करने वाला दस्तावेज़"},
            {"id": "b", "text": "A set of guidelines issued by ECI for parties and candidates", "text_hi": "ECI द्वारा दलों और उम्मीदवारों के लिए जारी दिशानिर्देशों का सेट"},
            {"id": "c", "text": "Rules for voters at polling booths", "text_hi": "मतदान केंद्रों पर मतदाताओं के लिए नियम"},
            {"id": "d", "text": "The Indian electoral law", "text_hi": "भारतीय चुनावी कानून"},
        ],
        "correct_answer": "b",
        "explanation": "The Model Code of Conduct is a set of guidelines issued by the ECI for political parties and candidates during elections to ensure free and fair polling.",
        "explanation_hi": "आदर्श आचार संहिता ECI द्वारा राजनीतिक दलों और उम्मीदवारों के लिए जारी दिशानिर्देशों का एक सेट है।",
        "category": "general",
    },
    {
        "id": 10,
        "question": "Voting is mandatory in India by law.",
        "question_hi": "भारत में कानून द्वारा मतदान अनिवार्य है।",
        "type": "true_false",
        "options": [
            {"id": "true", "text": "True", "text_hi": "सत्य"},
            {"id": "false", "text": "False", "text_hi": "असत्य"},
        ],
        "correct_answer": "false",
        "explanation": "Voting is NOT mandatory in India at the national level. However, Gujarat has a law making local body voting compulsory.",
        "explanation_hi": "राष्ट्रीय स्तर पर भारत में मतदान अनिवार्य नहीं है। हालांकि, गुजरात में स्थानीय निकाय मतदान अनिवार्य करने वाला कानून है।",
        "category": "myths",
    },
]

RAG_DOCUMENTS = [
    {
        "title": "How to Register as a New Voter",
        "source": "ECI — National Voter Services Portal",
        "url": "https://voters.eci.gov.in/",
        "topic": "registration",
        "state": "all",
        "content": """
To register as a new voter in India, you must fill Form 6 on the National Voter Services Portal (voters.eci.gov.in) 
or at your nearest ERO/BLO office.

Required documents:
1. Recent passport-size colour photograph
2. Proof of Age: Aadhaar card, Birth certificate, School/College certificate, Driving licence
3. Proof of Address: Aadhaar card, Passport, Bank passbook, Utility bills (not older than 3 months)

Timeline: Application is processed within 30 days. You will receive your EPIC (Voter ID Card) by post 
or can download an e-EPIC from the portal.

Steps:
1. Visit voters.eci.gov.in
2. Click on "New Voter Registration (Form 6)"
3. Fill in your personal details
4. Upload documents
5. Submit and note your reference number
6. Track status at voters.eci.gov.in/track-application
        """,
    },
    {
        "title": "What to Carry on Polling Day",
        "source": "Election Commission of India",
        "url": "https://eci.gov.in/faqs/elections/voter-faqs/",
        "topic": "polling_day",
        "state": "all",
        "content": """
On polling day, you must carry at least one of the following photo identification documents:

1. Voter ID Card (EPIC) — Primary ID
2. Aadhaar Card
3. Passport
4. Driving Licence
5. PAN Card
6. MNREGA Job Card
7. Bank / Post Office Passbook with Photograph
8. Health Insurance Smart Card (RSBY)
9. Pension document with Photograph
10. NPR Smart Card
11. Smart card issued by RGI under NPR
12. Official identity card issued by MPs/MLAs/MLCs

Polling booths are open from 7:00 AM to 6:00 PM (timings may vary by state).
Do NOT bring mobile phones inside the booth premises.
You will receive an indelible ink mark on your left index finger after voting.
        """,
    },
    {
        "title": "Voter Registration Transfer — Moved to New City",
        "source": "ECI — Voter Helpline",
        "url": "https://voters.eci.gov.in/",
        "topic": "transfer",
        "state": "all",
        "content": """
If you have moved to a new city or constituency, here is what to do:

Scenario 1: Moved within same constituency
- Fill Form 8A to transpose your entry to the new address within the same constituency.

Scenario 2: Moved to a different constituency (same state or different state)
- Fill a fresh Form 6 in the new constituency.
- Your name will automatically be deleted from the old constituency roll after verification.

Documents required:
- Proof of new address
- Photograph
- EPIC number (old voter ID)

Timeline: 30 days for processing. You must apply before the cutoff date (usually 90 days before election).

Online process:
1. Visit voters.eci.gov.in
2. Select "Shift in Residence" or "New Registration"
3. Fill the appropriate form
4. Upload documents and submit
        """,
    },
    {
        "title": "Lost Voter ID Card — What to Do",
        "source": "NVSP — National Voter Services Portal",
        "url": "https://voters.eci.gov.in/",
        "topic": "lost_voter_id",
        "state": "all",
        "content": """
If you have lost your Voter ID Card (EPIC), you have two options:

Option 1: Download e-EPIC (Digital Voter ID)
- Visit voters.eci.gov.in
- Click on "Download e-EPIC"
- Enter your EPIC number or mobile number linked to voter registration
- Verify with OTP
- Download PDF of your digital voter ID

Option 2: Apply for Duplicate EPIC
- Fill Form 8 for correction and new EPIC
- Submit at your local ERO office

Note: Even without a physical voter ID, you can vote on election day using alternative photo IDs 
(Aadhaar, Passport, Driving Licence, PAN Card, etc.)

Important: Your e-EPIC is a valid document and accepted at polling booths.
        """,
    },
    {
        "title": "Name Correction in Voter ID",
        "source": "ECI — Electoral Roll Management",
        "url": "https://voters.eci.gov.in/",
        "topic": "correction",
        "state": "all",
        "content": """
To correct errors in your voter registration details (name, date of birth, address, photo):

Use Form 8 for correction of entries in the electoral roll.

Steps:
1. Visit voters.eci.gov.in
2. Click on "Correction of entries in Electoral Roll (Form 8)"
3. Enter your EPIC number
4. Select the field to correct (Name / DOB / Address / Photo)
5. Upload supporting document for the correction
6. Submit the application

Documents needed for name correction:
- Aadhaar card with correct name
- Or Gazette notification for name change
- Or Court affidavit

Timeline: Corrections are processed during the summary revision period or anytime for urgent cases.
Approval typically takes 15-30 days.
        """,
    },
    {
        "title": "Understanding EVM and VVPAT",
        "source": "Election Commission of India — EVM Division",
        "url": "https://eci.gov.in/evm/",
        "topic": "evm",
        "state": "all",
        "content": """
EVM (Electronic Voting Machine) is the device used for casting votes in Indian elections since 1998.

Components:
1. Ballot Unit (BU): Has buttons with candidate names and party symbols
2. Control Unit (CU): Operated by polling officer to enable voting
3. VVPAT: Voter Verifiable Paper Audit Trail — prints a paper slip

How voting works:
1. Polling officer enables the EVM for you
2. You go to the ballot unit
3. Press the button next to your chosen candidate
4. A beep confirms your vote
5. VVPAT displays a paper slip for 7 seconds showing your choice
6. The slip drops into a sealed compartment

Key facts:
- EVM is standalone — not connected to internet
- Each button press is final — cannot be changed
- NOTA button is at the bottom of all candidate buttons
- Results are stored in the Control Unit

If EVM malfunctions: Inform the presiding officer immediately. A mock poll is conducted before voting begins each day.
        """,
    },
]
