import { useMemo, useState } from 'react';
import { Button, Progress, Typography } from 'antd';
import { SoundOutlined, RightOutlined } from '@ant-design/icons';
import { speakChinese } from '../utils/speech';
import { generateFillBlankItems } from '../utils/fillBlank';

const { Text } = Typography;

export default function FillBlank({ vocab, sentences, onComplete, maxItems = 24 }) {
  const items = useMemo(() => generateFillBlankItems(sentences, vocab, maxItems), [sentences, vocab, maxItems]);

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('playing'); // playing | correct
  const [wrongOption, setWrongOption] = useState(null);
  const [solvedCount, setSolvedCount] = useState(0);

  const item = items[index];
  const isLast = index === items.length - 1;

  function playAudio() {
    speakChinese(item.sentence.hanzi);
  }

  function handleOptionTap(opt) {
    if (status !== 'playing') return;
    if (opt.word === item.answer) {
      setStatus('correct');
      setSolvedCount((c) => c + 1);
    } else {
      setWrongOption(opt.word);
      setTimeout(() => setWrongOption(null), 400);
    }
  }

  function next() {
    if (isLast) {
      onComplete?.();
      return;
    }
    setIndex((i) => i + 1);
    setStatus('playing');
    setWrongOption(null);
  }

  if (!item) {
    return <Text type="secondary">Not enough sentence content to build this exercise yet.</Text>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Progress
          percent={Math.round((solvedCount / items.length) * 100)}
          size="small"
          showInfo={false}
          className="flex-1 mr-3"
        />
        <Button size="small" onClick={() => onComplete?.()}>
          End session
        </Button>
      </div>
      <div className="text-gray-500 text-sm">
        Item {index + 1} / {items.length} — listen and pick the missing word
      </div>

      <div className="flex flex-col items-center gap-3 py-4 rounded-xl border border-gray-200 bg-gray-50">
        <Button
          shape="circle"
          size="large"
          icon={<SoundOutlined />}
          onClick={playAudio}
          type="primary"
        />
        <Text type="secondary" className="text-xs">tap to hear the sentence</Text>

        <div className="flex flex-wrap justify-center gap-2 mt-2 px-4">
          {item.sentence.chunks.map((chunk, i) =>
            i === item.blankIndex ? (
              <span
                key={i}
                className={`flex flex-col items-center px-3 py-1 rounded-md border-2 border-dashed min-w-12 text-center
                  ${status === 'correct' ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-300 bg-white text-gray-300'}`}
              >
                <span className="hanzi text-xl">{status === 'correct' ? item.answer : '？'}</span>
                {status === 'correct' && item.answerPinyin && (
                  <span className="text-[11px] opacity-70">{item.answerPinyin}</span>
                )}
              </span>
            ) : (
              <span key={i} className="flex flex-col items-center px-1 py-1">
                <span className="hanzi text-xl">{chunk}</span>
                {item.chunkPinyins[i] && (
                  <span className="text-[11px] text-gray-400">{item.chunkPinyins[i]}</span>
                )}
              </span>
            )
          )}
        </div>

        <Text type="secondary" className="text-sm px-4 text-center">
          {item.sentence.english}
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {item.options.map((opt) => {
          const isCorrectChoice = status === 'correct' && opt.word === item.answer;
          const isWrongChoice = wrongOption === opt.word;
          return (
            <button
              key={opt.word}
              onClick={() => handleOptionTap(opt)}
              disabled={status === 'correct'}
              className={`h-16 rounded-xl border flex flex-col items-center justify-center leading-tight transition-all
                ${isCorrectChoice ? 'border-green-400 bg-green-50 text-green-600' : ''}
                ${isWrongChoice ? 'border-red-400 bg-red-50 text-red-500' : ''}
                ${!isCorrectChoice && !isWrongChoice ? 'border-gray-200 bg-white hover:border-blue-300' : ''}
              `}
            >
              <span className="hanzi text-lg font-medium">{opt.word}</span>
              {opt.pinyin && <span className="text-xs opacity-70">{opt.pinyin}</span>}
            </button>
          );
        })}
      </div>

      {status === 'correct' && (
        <div className="flex justify-end">
          <Button type="primary" icon={<RightOutlined />} onClick={next}>
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}