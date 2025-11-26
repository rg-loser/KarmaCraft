# KarmaQuest (Fullstack)

Backend: Flask, Frontend: React + Vite.\nSee backend/ and frontend/ folders.


karma_app/
│
├── backend/
│   ├── app.py               # Flask backend with JSON persistence
│   ├── requirements.txt     # Railway-ready dependencies
│   ├── Procfile             # Railway deployment file
│   └── data/
│       ├── agami.json
│       ├── sanchita.json
│       └── prarabdha.json
│
└── frontend/
    ├── package.json         # Placeholder; ready for React setup
    └── README.md




High-Level System Flow
----------------------
 ┌───────────────────────────────────────────────────────┐
 │                       START APP                        │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │                  ONBOARDING WIZARD                    │
 │   - Enter Name                                        │
 │   - Choose Atma Nature (Calm / Curious / Fire / Bal) │
 │   - Choose Dominant Icchā (Wants)                     │
 │   - Choose Dominant Kāmanā (Desires)                  │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │             CREATE SOUL PROFILE (LOCAL)               │
 │   {                                                   │
 │     name, nature, iccha, kamana,                      │
 │     karma=0, shanti=0, expectation=0, level=1         │
 │   }                                                   │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │                    HOME SCREEN                        │
 │    - "Begin Journey"                                  │
 │    - "Continue"                                        │
 │    - "Lessons"                                         │
 │    - "Wisdom Cards"                                    │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │               ENTER GAME LOOP (Level X)               │
 │   - UI shows 3 meters: Karma, Expectation, Shanti     │
 │   - Render Life Scenario Card                         │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │                 USER SEES SCENARIO                    │
 │   e.g. "Someone needs help…"                          │
 │   OPTIONS:                                            │
 │      1. Action w/ no expectation → Tyāga              │
 │      2. Action w/ expectation → Less Shanti           │
 │      3. Non-action → Negative Karma                   │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │               USER MAKES A CHOICE                     │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │              SEND ACTION → BACKEND (API)              │
 │   POST /action                                        │
 │   BODY: {desc, expectation_strength, outcome_type}    │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │              BACKEND COMPUTES FALAH                   │
 │   - Store action in agami.json                        │
 │   - Compute Result (instant/delayed/mental)           │
 │   - Update:                                           │
 │        karma, expectation, shanti, mental_state       │
 │   - Return updated stats                              │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │           UI UPDATES METERS (Animate glow)            │
 │   - Karma rises/falls                                 │
 │   - Expectation changes                               │
 │   - Shanti flower opens/closes                        │
 └───────────────────────────────────────────────────────┘
                |
                v
 ┌───────────────────────────────────────────────────────┐
 │               UNLOCK WISDOM CARD?                     │
 │   If: tyag + good karma + low desire                  │
 │   Then: unlock card (e.g. Tyāgāt śāntir anantaram)    │
 └───────────────────────────────────────────────────────┘
                |
                v
        ┌─────────────Decision──────────────┐
        │                                    │
        ▼                                    ▼
 ┌───────────────────────┐         ┌────────────────────────┐
 │  More Cards Remain?   │         │ Last Card Completed?   │
 │        YES            │         │        YES             │
 └───────────────────────┘         └────────────────────────┘
        |                                   |
        v                                   v
   Loop back                         LEVEL COMPLETE →
   to new card                       increase level,
                                     unlock chapter,
                                     show peace animation
                                     
                                     go back to game loop
