import { useState } from 'react';
import lessons from '../data/lessons';
import LessonCard from './LessonCard';
import LessonModal from './LessonModal';
import { getLessonCompletionRatio, setLessonTaskDone } from '../utils/progress';

export default function LessonsPage({ refreshKey, onProgressChange }) {
  const [activeLesson, setActiveLesson] = useState(null);

  function handleTaskComplete(task) {
    if (!activeLesson) return;
    setLessonTaskDone(activeLesson.id, task);
    onProgressChange?.();
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lessons</h2>
        <p className="text-gray-500 text-sm">Pick a topic to practice vocabulary and phrases.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progressRatio={getLessonCompletionRatio(lesson.id)}
            onClick={() => !lesson.locked && setActiveLesson(lesson)}
          />
        ))}
      </div>

      <LessonModal
        lesson={activeLesson}
        open={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        onTaskComplete={handleTaskComplete}
      />
    </div>
  );
}
