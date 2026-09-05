import { useState } from 'react';
import { List, Button, Tag, Empty, Typography } from 'antd';
import { SoundOutlined, CheckOutlined } from '@ant-design/icons';
import { getQuizWrongItems, clearReviewItem } from '../utils/progress';
import { speakChinese } from '../utils/speech';

const { Text } = Typography;

export default function ReviewPage() {
  const [items, setItems] = useState(() => getQuizWrongItems());

  function handleGotIt(id) {
    clearReviewItem(id);
    setItems(getQuizWrongItems());
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Review</h2>
        <p className="text-gray-500 text-sm">Words you've missed on quizzes — practice them again here.</p>
      </div>

      {items.length === 0 ? (
        <Empty description="Nothing to review — great job!" />
      ) : (
        <List
          bordered
          className="max-w-xl"
          dataSource={items}
          renderItem={(entry) => (
            <List.Item
              actions={[
                <Button
                  key="play"
                  size="small"
                  shape="circle"
                  icon={<SoundOutlined />}
                  onClick={() => speakChinese(entry.item.hanzi)}
                />,
                <Button key="gotit" size="small" icon={<CheckOutlined />} onClick={() => handleGotIt(entry.id)}>
                  Got it
                </Button>,
              ]}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">{entry.item.emoji}</span>
                <span className="hanzi text-lg">{entry.item.hanzi}</span>
                <Tag color="blue">{entry.item.pinyin}</Tag>
                <Text type="secondary">{entry.item.english}</Text>
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
