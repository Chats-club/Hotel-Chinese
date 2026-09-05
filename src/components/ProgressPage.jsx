import { Progress, Statistic, Row, Col, Card } from 'antd';
import lessons from '../data/lessons';
import { getLessonCompletionRatio, getOverallStats, getQuizStats } from '../utils/progress';

export default function ProgressPage({ refreshKey }) {
  const stats = getOverallStats(lessons);
  const quiz = getQuizStats();
  const quizAccuracy = quiz.total > 0 ? Math.round((quiz.correct / quiz.total) * 100) : null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Progress</h2>
        <p className="text-gray-500 text-sm">Your overall stats across all lessons.</p>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card size="small">
            <Statistic title="Vocabulary words" value={stats.totalVocab} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Sentences" value={stats.totalSentences} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Quiz accuracy"
              value={quizAccuracy === null ? '—' : `${quizAccuracy}%`}
              suffix={quiz.total > 0 ? `(${quiz.correct}/${quiz.total})` : ''}
            />
          </Card>
        </Col>
      </Row>

      <div className="text-sm font-medium text-gray-600 mb-2">Lessons</div>
      <div className="flex flex-col gap-3 max-w-xl">
        {lessons.map((lesson) => {
          const ratio = lesson.locked ? 0 : getLessonCompletionRatio(lesson.id);
          return (
            <div key={lesson.id} className="flex items-center gap-3">
              <span className="text-xl w-8">{lesson.icon}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-700">
                  {lesson.titleCn} <span className="text-gray-400">· {lesson.titleEn}</span>
                </div>
                <Progress
                  percent={Math.round(ratio * 100)}
                  size="small"
                  showInfo={false}
                  status={lesson.locked ? 'exception' : 'normal'}
                />
              </div>
              {lesson.locked && <span className="text-xs text-gray-400">locked</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
