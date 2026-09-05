# 🏨 Hotel Chinese

Vocational Mandarin for hotel staff across every department — front desk
calls, housekeeping phrases, engineering reports, and guest-facing service
language, taught the same interactive way as a language-learning app.

## Structure — all 10 departments fully built

```
Hotel Chinese
├── Lessons
│   ├── Reception (前台接待)                    100 vocab · 12 phrases
│   ├── Concierge / Bell Service (礼宾服务)      100 vocab · 12 phrases
│   ├── Restaurant (餐厅服务)                    100 vocab · 12 phrases
│   ├── Room Service (客房服务)                  100 vocab · 12 phrases
│   ├── Accounting (财务部)                      100 vocab · 12 phrases
│   ├── Store / Warehouse (仓库物资)             100 vocab · 12 phrases
│   ├── Canteen (员工食堂)                       100 vocab · 12 phrases
│   ├── Security (保安部)                        100 vocab · 12 phrases
│   ├── Housekeeping (客房清洁部)                100 vocab · 12 phrases
│   └── Engineering / Maintenance (工程部)       100 vocab · 12 phrases
├── Vocabulary       (global, searchable — 1,000 words across all lessons)
├── Sentences        (global, searchable — 120 phrases across all lessons)
├── Listening        (fill-in-the-blank cloze, pulled from every lesson)
├── Speaking         (listen + repeat, with browser speech-recognition
│                     feedback where supported — Chrome recommended)
├── Quiz             (multiple choice, sampled from all vocab)
├── Review           (words missed on quizzes, for spaced practice)
└── Progress         (stats dashboard + per-lesson completion)
```

Every lesson opens into 6 activities: Flashcards, Pronunciation, Sentences
(word-ordering), Match (picture-to-word), Fill Blank, and Crossword — the
exact same proven activity set from the Casino Chinese app, reused here
since they're fully data-driven.

## Getting started

```bash
npm install
npm run dev
```

## Content notes

All vocabulary and phrases use standard, real hospitality-industry
terminology — 入住/退房 (check-in/check-out), 客房服务 (room service),
请勿打扰 (do not disturb), 消防 (fire safety), 报修 (report for repair),
and so on — written fresh for this app, not copied from any textbook.

Each lesson's domain-specific vocabulary is topped up to 100 words using
the same shared, verified pool of common professional Chinese used in the
Casino Chinese app (numbers, time expressions, courtesy phrases, workplace
nouns, money terms) — genuinely useful across every hotel department, and
far more reliable at this scale than inventing niche terms that don't
actually exist.

Every sentence's word chunks were validated to align correctly with their
pinyin (needed for the Sentences/word-ordering and Fill Blank activities),
and the crossword generator was confirmed to place all 100/100 words in
every single lesson before shipping.

## Project structure

```
src/
  data/lessons.js         ← all 10 departments' content
  components/
    LessonsPage.jsx / LessonCard.jsx / LessonModal.jsx
    VocabularyPage.jsx / SentencesPage.jsx
    ListeningPage.jsx / SpeakingPage.jsx
    QuizPage.jsx / ReviewPage.jsx / ProgressPage.jsx
    FlashCards.jsx / Pronunciation.jsx / MixedSentences.jsx
    Crossword.jsx / MatchPictures.jsx / FillBlank.jsx
  utils/
    progress.js              ← localStorage progress + quiz stats
    speech.js                 ← text-to-speech (Web Speech API)
    speechRecognition.js        ← speech-to-text for Speaking practice
    crossword.js / pinyinChunks.js / fillBlank.js
```

## Adding more content

Follow the same object shape in `src/data/lessons.js` to add an 11th
department or expand any lesson further:

```js
{
  id: 11,
  slug: 'my-new-department',
  icon: '🏨',
  color: '#000000',
  titleCn: '...',
  titleEn: '...',
  locked: false,
  vocab: [{ hanzi, pinyin, english, emoji }, ...],
  sentences: [{ hanzi, pinyin, english, chunks: [...] }, ...],
}
```

Important: each sentence's `chunks` array must have the same number of
elements as `pinyin` has whitespace-separated words (punctuation aside) —
fuse multi-syllable words together in the pinyin (e.g. `kèfángfúwù` not
`kèfáng fúwù`) to match a single chunk tile.
# Hotel-Chinese
