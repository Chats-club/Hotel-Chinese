const STORAGE_KEY = 'hotel-chinese-progress-v1';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { lessons: {}, quizWrong: [], quizStats: { correct: 0, total: 0 } };
  } catch {
    return { lessons: {}, quizWrong: [], quizStats: { correct: 0, total: 0 } };
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable — fail silently
  }
}

const DEFAULT_TASKS = {
  flashcards: false,
  pronunciation: false,
  mixedSentences: false,
  matchPictures: false,
  fillBlank: false,
  crossword: false,
};

export function getLessonProgress(lessonId) {
  const all = readAll();
  return all.lessons[lessonId] || { ...DEFAULT_TASKS };
}

export function setLessonTaskDone(lessonId, task) {
  const all = readAll();
  const current = all.lessons[lessonId] || { ...DEFAULT_TASKS };
  current[task] = true;
  all.lessons[lessonId] = current;
  writeAll(all);
  return current;
}

export function getLessonCompletionRatio(lessonId) {
  const p = getLessonProgress(lessonId);
  const tasks = Object.values(p);
  const done = tasks.filter(Boolean).length;
  return done / tasks.length;
}

export function recordQuizAnswer(item, correct) {
  const all = readAll();
  all.quizStats.total += 1;
  if (correct) {
    all.quizStats.correct += 1;
    all.quizWrong = all.quizWrong.filter((w) => w.id !== item.id);
  } else {
    if (!all.quizWrong.find((w) => w.id === item.id)) {
      all.quizWrong.push(item);
    }
  }
  writeAll(all);
}

export function getQuizWrongItems() {
  return readAll().quizWrong;
}

export function clearReviewItem(id) {
  const all = readAll();
  all.quizWrong = all.quizWrong.filter((w) => w.id !== id);
  writeAll(all);
}

export function getQuizStats() {
  return readAll().quizStats;
}

export function getOverallStats(lessons) {
  let totalVocab = 0;
  let totalSentences = 0;
  let completedLessons = 0;
  for (const lesson of lessons) {
    if (lesson.locked) continue;
    totalVocab += lesson.vocab.length;
    totalSentences += lesson.sentences.length;
    if (getLessonCompletionRatio(lesson.id) === 1) completedLessons++;
  }
  return { totalVocab, totalSentences, completedLessons };
}

export function resetProgress() {
  writeAll({ lessons: {}, quizWrong: [], quizStats: { correct: 0, total: 0 } });
}
