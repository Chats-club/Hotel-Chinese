import { useMemo, useRef, useState } from 'react';
import { Button, Tag, message } from 'antd';
import { CheckOutlined, RedoOutlined } from '@ant-design/icons';
import { generateCrossword, pinyinToAnswer } from '../utils/crossword';

export default function Crossword({ vocab, onComplete }) {
  const { grid, placements, size } = useMemo(() => {
    const entries = vocab.map((v) => ({
      word: pinyinToAnswer(v.pinyin),
      clue: `${v.emoji} ${v.english}`,
    }));
    return generateCrossword(entries);
  }, [vocab]);

  const [values, setValues] = useState({});
  const [checked, setChecked] = useState(false);
  const [msgApi, contextHolder] = message.useMessage();
  const inputRefs = useRef({});

  function key(r, c) {
    return `${r}-${c}`;
  }

  function handleChange(r, c, val) {
    const letter = val.slice(-1).toLowerCase();
    setValues((v) => ({ ...v, [key(r, c)]: letter }));
    setChecked(false);
  }

  function check() {
    let allCorrect = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] !== null) {
          const val = (values[key(r, c)] || '').toLowerCase();
          if (val !== grid[r][c]) allCorrect = false;
        }
      }
    }
    setChecked(true);
    if (allCorrect) {
      msgApi.success('Crossword solved!');
      onComplete?.();
    } else {
      msgApi.error('Some letters are wrong — keep trying');
    }
  }

  function reset() {
    setValues({});
    setChecked(false);
  }

  // Which cells start a word, for numbering.
  const numberAt = {};
  placements.forEach((p) => {
    numberAt[key(p.row, p.col)] = p.number;
  });

  // Trim the grid to only the bounding box that actually has letters, so we
  // don't render a huge mostly-empty grid.
  let minR = size, maxR = 0, minC = size, maxC = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== null) {
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
      <div className="overflow-auto">
        <div
          className="inline-grid gap-0.5 bg-gray-200 p-0.5 rounded"
          style={{ gridTemplateColumns: `repeat(${maxC - minC + 1}, 2rem)` }}
        >
          {Array.from({ length: maxR - minR + 1 }).map((_, ri) =>
            Array.from({ length: maxC - minC + 1 }).map((_, ci) => {
              const r = ri + minR;
              const c = ci + minC;
              const isCell = grid[r][c] !== null;
              const k = key(r, c);
              const num = numberAt[k];
              const isCorrect = checked && (values[k] || '').toLowerCase() === grid[r][c];
              const isWrong = checked && isCell && (values[k] || '').toLowerCase() !== grid[r][c];

              if (!isCell) {
                return <div key={k} className="w-8 h-8 bg-transparent" />;
              }

              return (
                <div key={k} className="relative w-8 h-8">
                  {num && (
                    <span className="absolute top-0 left-0.5 text-[8px] text-gray-400 leading-none">
                      {num}
                    </span>
                  )}
                  <input
                    ref={(el) => (inputRefs.current[k] = el)}
                    maxLength={1}
                    value={values[k] || ''}
                    onChange={(e) => handleChange(r, c, e.target.value)}
                    className={`w-8 h-8 text-center uppercase text-sm font-medium border outline-none
                      ${isCorrect ? 'bg-green-100 border-green-400' : ''}
                      ${isWrong ? 'bg-red-100 border-red-400' : 'border-gray-300'}
                      bg-white`}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-gray-600 mb-2">Clues</div>
        <div className="flex flex-col gap-1">
          {placements.map((p) => (
            <div key={p.number} className="text-sm text-gray-600">
              <Tag className="mr-1">{p.number}</Tag>
              {p.clue} ({p.horizontal ? 'across' : 'down'})
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button icon={<RedoOutlined />} onClick={reset}>
          Clear
        </Button>
        <Button type="primary" icon={<CheckOutlined />} onClick={check}>
          Check
        </Button>
      </div>
    </div>
  );
}
