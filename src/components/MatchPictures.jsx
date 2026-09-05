import { useMemo, useState } from 'react';
import { Progress, Typography } from 'antd';
import { speakChinese } from '../utils/speech';

const { Text } = Typography;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PAIR_COUNT = 24;

export default function MatchPictures({ vocab, onComplete }) {
  const items = useMemo(() => vocab.slice(0, PAIR_COUNT), [vocab]);
  const [pictures] = useState(() => shuffle(items));
  const [words] = useState(() => shuffle(items));
  const [selectedId, setSelectedId] = useState(null);
  const [matched, setMatched] = useState(() => new Set());
  const [wrongId, setWrongId] = useState(null);
  const [doneNotified, setDoneNotified] = useState(false);

  function handlePictureTap(item) {
    if (matched.has(item.hanzi)) return;
    speakChinese(item.hanzi);
    setSelectedId(item.hanzi);
    setWrongId(null);
  }

  function handleWordTap(item) {
    if (matched.has(item.hanzi) || selectedId === null) return;

    if (item.hanzi === selectedId) {
      const next = new Set(matched);
      next.add(item.hanzi);
      setMatched(next);
      setSelectedId(null);
      if (next.size === items.length && !doneNotified) {
        setDoneNotified(true);
        onComplete?.();
      }
    } else {
      setWrongId(item.hanzi);
      setTimeout(() => setWrongId(null), 400);
      setSelectedId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Text type="secondary" className="text-sm">
        Tap a picture to hear it, then tap its matching word.
      </Text>

      <Progress
        percent={Math.round((matched.size / items.length) * 100)}
        size="small"
        showInfo={false}
      />

      <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
        <div className="flex flex-col gap-2">
          {pictures.map((item) => {
            const isMatched = matched.has(item.hanzi);
            const isSelected = selectedId === item.hanzi;
            return (
              <button
                key={item.hanzi}
                onClick={() => handlePictureTap(item)}
                disabled={isMatched}
                className={`h-11 rounded-lg border text-2xl flex items-center justify-center transition-all shrink-0
                  ${isMatched ? 'opacity-30 border-gray-200 bg-gray-50 cursor-default' : 'border-gray-200 bg-white hover:border-blue-300'}
                  ${isSelected ? 'ring-2 ring-blue-400 border-blue-400' : ''}
                `}
              >
                {item.emoji}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          {words.map((item) => {
            const isMatched = matched.has(item.hanzi);
            const isWrong = wrongId === item.hanzi;
            return (
              <button
                key={item.hanzi}
                onClick={() => handleWordTap(item)}
                disabled={isMatched}
                className={`h-11 rounded-lg border px-2 flex flex-col items-center justify-center leading-tight transition-all shrink-0
                  ${isMatched ? 'opacity-30 border-gray-200 bg-gray-50 cursor-default' : 'border-gray-200 bg-white hover:border-blue-300'}
                  ${isWrong ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <span className="hanzi text-sm font-medium">{item.hanzi}</span>
                <span className="text-[10px] text-gray-400">{item.pinyin}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Text className="text-center text-sm text-gray-500">
        Matched {matched.size} / {items.length}
      </Text>
    </div>
  );
}
