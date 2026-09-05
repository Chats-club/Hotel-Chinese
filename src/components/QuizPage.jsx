import { useMemo, useState } from 'react';
import { Button, Progress, Typography, Result, Empty } from 'antd';
import { SoundOutlined, RightOutlined } from '@ant-design/icons';
import lessons from '../data/lessons';
import { speakChinese } from '../utils/speech';
import { recordQuizAnswer } from '../utils/progress';

const { Text } = Typography;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(vocab, count) {
  const pool = shuffle(vocab).slice(0, count);
  return pool.map((item) => {
    const askEnglish = Math.random() < 0.5;
    const distractorPool = vocab.filter((v) => v.hanzi !== item.hanzi);
    const distractors = shuffle(distractorPool).slice(0, 3);
    const options = shuffle([item, ...distractors]);
    return {
      id: item.hanzi,
      item,
      askEnglish,
      options,
    };
  });
}

export default function QuizPage({ onQuizAnswered }) {
  const allVocab = useMemo(() => {
    const rows = [];
    for (const lesson of lessons) {
      if (lesson.locked) continue;
      rows.push(...lesson.vocab);
    }
    return rows;
  }, []);

  const questions = useMemo(() => buildQuestions(allVocab, Math.min(500, allVocab.length)), [allVocab]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attemptedCount, setAttemptedCount] = useState(null);

  if (allVocab.length < 4) {
    return <Empty description="Not enough vocabulary yet for a quiz" />;
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function handleSelect(option) {
    if (selected) return;
    const correct = option.hanzi === question.item.hanzi;
    setSelected(option.hanzi);
    if (correct) setScore((s) => s + 1);
    recordQuizAnswer({ id: question.id, item: question.item, askEnglish: question.askEnglish }, correct);
    onQuizAnswered?.();
    if (!question.askEnglish) speakChinese(question.item.hanzi);
  }

  function next() {
    if (isLast) {
      setAttemptedCount(questions.length);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAttemptedCount(null);
  }

  if (finished) {
    const total = attemptedCount ?? questions.length;
    return (
      <div className="max-w-md">
        <Result
          status={total > 0 && score / total >= 0.7 ? 'success' : 'info'}
          title={`${score} / ${total} correct`}
          subTitle="Nice work — keep practicing to lock it in."
          extra={
            <Button type="primary" onClick={restart}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Quiz</h2>
        <p className="text-gray-500 text-sm">Multiple choice, sampled from every unlocked lesson.</p>
      </div>

      <div className="max-w-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Progress percent={Math.round((index / questions.length) * 100)} size="small" showInfo={false} className="flex-1 mr-3" />
          <Button
            size="small"
            onClick={() => {
              setAttemptedCount(selected ? index + 1 : index || 0);
              setFinished(true);
            }}
          >
            End quiz
          </Button>
        </div>
        <Text type="secondary" className="text-sm">
          Question {index + 1} / {questions.length}
        </Text>

        <div className="flex flex-col items-center gap-3 py-6 rounded-xl border border-gray-200 bg-gray-50">
          {question.askEnglish ? (
            <>
              <div className="hanzi text-3xl">{question.item.hanzi}</div>
              <div className="text-blue-600">{question.item.pinyin}</div>
              <Button shape="circle" size="small" icon={<SoundOutlined />} onClick={() => speakChinese(question.item.hanzi)} />
              <Text type="secondary" className="text-xs mt-1">What does this mean?</Text>
            </>
          ) : (
            <>
              <div className="text-xl text-gray-700">{question.item.english}</div>
              <Text type="secondary" className="text-xs">Which word matches?</Text>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {question.options.map((opt) => {
            const isCorrect = selected && opt.hanzi === question.item.hanzi;
            const isWrongPick = selected === opt.hanzi && opt.hanzi !== question.item.hanzi;
            return (
              <button
                key={opt.hanzi}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
                className={`h-16 rounded-xl border flex flex-col items-center justify-center leading-tight transition-all
                  ${isCorrect ? 'border-green-400 bg-green-50 text-green-600' : ''}
                  ${isWrongPick ? 'border-red-400 bg-red-50 text-red-500' : ''}
                  ${!isCorrect && !isWrongPick ? 'border-gray-200 bg-white hover:border-blue-300' : ''}
                `}
              >
                {question.askEnglish ? (
                  <span>{opt.english}</span>
                ) : (
                  <>
                    <span className="hanzi text-lg font-medium">{opt.hanzi}</span>
                    <span className="text-xs opacity-70">{opt.pinyin}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="flex justify-end">
            <Button type="primary" icon={<RightOutlined />} onClick={next}>
              {isLast ? 'See results' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
