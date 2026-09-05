import { useMemo, useState } from 'react';
import { Input, List, Button, Tag, Empty } from 'antd';
import { SoundOutlined, SearchOutlined } from '@ant-design/icons';
import lessons from '../data/lessons';
import { speakChinese } from '../utils/speech';

export default function SentencesPage() {
  const [query, setQuery] = useState('');

  const allSentences = useMemo(() => {
    const rows = [];
    for (const lesson of lessons) {
      if (lesson.locked) continue;
      for (const s of lesson.sentences) {
        rows.push({ ...s, lessonTitle: lesson.titleEn, lessonIcon: lesson.icon });
      }
    }
    return rows;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allSentences;
    const q = query.trim().toLowerCase();
    return allSentences.filter(
      (s) =>
        s.hanzi.includes(q) ||
        s.pinyin.toLowerCase().includes(q) ||
        s.english.toLowerCase().includes(q)
    );
  }, [allSentences, query]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sentences</h2>
        <p className="text-gray-500 text-sm">{allSentences.length} phrases across all unlocked lessons.</p>
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
        <Empty description="No matching sentences" />
      ) : (
        <List
          bordered
          dataSource={filtered}
          renderItem={(item) => (
            <List.Item
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
              <div className="w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="hanzi text-lg">{item.hanzi}</span>
                  <Tag className="ml-auto">{item.lessonIcon} {item.lessonTitle}</Tag>
                </div>
                <div className="text-blue-600 text-sm">{item.pinyin}</div>
                <div className="text-gray-500 text-sm">{item.english}</div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
