import { useMemo, useState } from 'react';
import { Button, Progress, Tag, message } from 'antd';
import { CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { getChunkPinyins } from '../utils/pinyinChunks';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds { word, pinyin } pairs for a sentence's chunks, so pinyin travels
// with its word through shuffling/picking instead of being looked up by
// array position (which breaks once tiles get reordered).
function buildPairs(sentence) {
  const pinyins = getChunkPinyins(sentence);
  return sentence.chunks.map((word, i) => ({
    word,
    pinyin: pinyins ? pinyins[i] : null,
  }));
}

function WordTile({ pair, color, onClick }) {
  return (
    <Tag
      color={color}
      onClick={onClick}
      className="cursor-pointer !flex !flex-col !items-center !px-3 !py-1.5 !m-0 !leading-tight"
    >
      <span className="hanzi text-lg">{pair.word}</span>
      {pair.pinyin && (
        <span className="text-[11px] opacity-70 -mt-0.5">{pair.pinyin}</span>
      )}
    </Tag>
  );
}

export default function MixedSentences({ sentences, onComplete }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [pool, setPool] = useState(() => shuffle(buildPairs(sentences[0])));
  const [status, setStatus] = useState('playing'); // playing | correct | wrong
  const [solvedCount, setSolvedCount] = useState(0);
  const [msgApi, contextHolder] = message.useMessage();

  const sentence = sentences[index];
  const isLast = index === sentences.length - 1;

  const correctAnswer = useMemo(() => sentence.chunks.join(''), [sentence]);

  function pick(pair, poolIdx) {
    if (status !== 'playing') return;
    setSelected((s) => [...s, pair]);
    setPool((p) => p.filter((_, i) => i !== poolIdx));
  }

  function unpick(pair, selectedIdx) {
    if (status !== 'playing') return;
    setSelected((s) => s.filter((_, i) => i !== selectedIdx));
    setPool((p) => [...p, pair]);
  }

  function check() {
    const answer = selected.map((p) => p.word).join('');
    if (answer === correctAnswer) {
      setStatus('correct');
      setSolvedCount((c) => c + 1);
      msgApi.success('Correct!');
    } else {
      setStatus('wrong');
      msgApi.error('Not quite — try again');
    }
  }

  function retry() {
    setStatus('playing');
    setSelected([]);
    setPool(shuffle(buildPairs(sentence)));
  }

  function next() {
    if (isLast) {
      onComplete?.();
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setSelected([]);
    setPool(shuffle(buildPairs(sentences[nextIndex])));
    setStatus('playing');
  }

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
      <Progress
        percent={Math.round((solvedCount / sentences.length) * 100)}
        size="small"
        showInfo={false}
      />
      <div className="text-gray-500 text-sm">
        Sentence {index + 1} / {sentences.length} — put the words in order
      </div>
      <div className="text-gray-700">{sentence.english}</div>

      <div className="min-h-20 flex flex-wrap gap-2 p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50">
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">Tap words below to build the sentence</span>
        )}
        {selected.map((pair, i) => (
          <WordTile
            key={`${pair.word}-${i}`}
            pair={pair}
            color={status === 'correct' ? 'green' : status === 'wrong' ? 'red' : 'blue'}
            onClick={() => unpick(pair, i)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {pool.map((pair, i) => (
          <WordTile key={`${pair.word}-${i}`} pair={pair} onClick={() => pick(pair, i)} />
        ))}
      </div>

      {status === 'correct' && (
        <div className="text-green-600 hanzi">
          {sentence.hanzi} <span className="text-gray-400 text-sm">({sentence.pinyin})</span>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {status === 'wrong' && (
          <Button icon={<ReloadOutlined />} onClick={retry}>
            Retry
          </Button>
        )}
        {status !== 'correct' && (
          <Button type="primary" icon={<CheckOutlined />} onClick={check} disabled={pool.length > 0}>
            Check
          </Button>
        )}
        {status === 'correct' && (
          <Button type="primary" onClick={next}>
            {isLast ? 'Finish' : 'Next sentence'}
          </Button>
        )}
      </div>
    </div>
  );
}
