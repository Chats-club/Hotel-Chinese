import { useState } from 'react';
import { Button, Progress, Space, Tag } from 'antd';
import { LeftOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons';
import { speakChinese } from '../utils/speech';

export default function FlashCards({ vocab, onComplete }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(() => new Set());

  const card = vocab[index];
  const isLast = index === vocab.length - 1;

  function markSeen(i) {
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(i);
      if (next.size === vocab.length) onComplete?.();
      return next;
    });
  }

  function goNext() {
    markSeen(index);
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, vocab.length - 1));
  }

  function goPrev() {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <Progress
        percent={Math.round((seen.size / vocab.length) * 100)}
        size="small"
        className="w-full max-w-sm"
        showInfo={false}
      />

      <div
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-sm h-56 cursor-pointer select-none"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white shadow-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-5xl">{card.emoji}</div>
            <div className="hanzi text-4xl font-semibold">{card.hanzi}</div>
            <div className="text-gray-400 text-sm">tap to flip</div>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 shadow-md"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <Tag color="blue" className="text-base px-3 py-1">{card.pinyin}</Tag>
            <div className="text-xl text-gray-700">{card.english}</div>
            <Button
              shape="circle"
              icon={<SoundOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                speakChinese(card.hanzi);
              }}
            />
          </div>
        </div>
      </div>

      <Space>
        <Button icon={<LeftOutlined />} onClick={goPrev} disabled={index === 0} />
        <span className="text-gray-500 text-sm w-16 text-center">
          {index + 1} / {vocab.length}
        </span>
        {isLast ? (
          <Button type="primary" onClick={() => markSeen(index)}>
            Done
          </Button>
        ) : (
          <Button icon={<RightOutlined />} onClick={goNext} />
        )}
      </Space>
    </div>
  );
}
