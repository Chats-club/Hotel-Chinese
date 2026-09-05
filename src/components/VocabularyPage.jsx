import { useMemo, useState } from 'react';
import { Input, List, Tag, Button, Empty } from 'antd';
import { SoundOutlined, SearchOutlined } from '@ant-design/icons';
import lessons from '../data/lessons';
import { speakChinese } from '../utils/speech';

// Ant Design's default list border is a thin 1px line that's easy to miss
// when scanning quickly — bumping both the outer container border and the
// per-item dividers to 2px makes each entry much easier to tell apart at a
// glance. Tailwind's `!` (important) modifier is needed since antd's own
// border rules would otherwise win on specificity.
const thickBorderListClass = '[&.ant-list-bordered]:!border-2 [&.ant-list-bordered]:!border-gray-300 [&_.ant-list-item]:!border-gray-300';
const thickBorderItemClass = '!border-b-2';

export default function VocabularyPage() {
  const [query, setQuery] = useState('');

  const allVocab = useMemo(() => {
    const rows = [];
    for (const lesson of lessons) {
      if (lesson.locked) continue;
      for (const v of lesson.vocab) {
        rows.push({ ...v, lessonTitle: lesson.titleEn, lessonIcon: lesson.icon });
      }
    }
    return rows;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allVocab;
    const q = query.trim().toLowerCase();
    return allVocab.filter(
      (v) =>
        v.hanzi.includes(q) ||
        v.pinyin.toLowerCase().includes(q) ||
        v.english.toLowerCase().includes(q)
    );
  }, [allVocab, query]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Vocabulary</h2>
        <p className="text-gray-500 text-sm">{allVocab.length} words across all unlocked lessons.</p>
      </div>

      <Input
        placeholder="Search by hanzi, pinyin, or English..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 max-w-md"
        allowClear
      />

      {filtered.length === 0 ? (
        <Empty description="No matching words" />
      ) : (
        <List
          bordered
          className={thickBorderListClass}
          dataSource={filtered}
          renderItem={(item) => (
            <List.Item
              className={thickBorderItemClass}
              actions={[
                <Button
                  key="play"
                  size="small"
                  shape="circle"
                  icon={<SoundOutlined />}
                  onClick={() => speakChinese(item.hanzi)}
                />,
              ]}
            >
              <span className="flex items-center gap-3 flex-wrap">
                <span className="text-xl">{item.emoji}</span>
                <span className="hanzi text-lg">{item.hanzi}</span>
                <Tag color="blue">{item.pinyin}</Tag>
                <span className="text-gray-500">{item.english}</span>
                <Tag className="ml-auto">{item.lessonIcon} {item.lessonTitle}</Tag>
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
