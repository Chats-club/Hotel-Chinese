import { Modal, Tabs } from 'antd';
import {
  CreditCardOutlined,
  SoundOutlined,
  OrderedListOutlined,
  TableOutlined,
  AppstoreOutlined,
  EditOutlined,
} from '@ant-design/icons';
import FlashCards from './FlashCards';
import Pronunciation from './Pronunciation';
import MixedSentences from './MixedSentences';
import Crossword from './Crossword';
import MatchPictures from './MatchPictures';
import FillBlank from './FillBlank';

export default function LessonModal({ lesson, open, onClose, onTaskComplete }) {
  if (!lesson) return null;

  const items = [
    {
      key: 'flashcards',
      label: <span><CreditCardOutlined /> Flashcards</span>,
      children: <FlashCards vocab={lesson.vocab} onComplete={() => onTaskComplete('flashcards')} />,
    },
    {
      key: 'pronunciation',
      label: <span><SoundOutlined /> Pronunciation</span>,
      children: (
        <Pronunciation
          vocab={lesson.vocab}
          sentences={lesson.sentences}
          onComplete={() => onTaskComplete('pronunciation')}
        />
      ),
    },
    {
      key: 'mixed',
      label: <span><OrderedListOutlined /> Sentences</span>,
      children: (
        <MixedSentences sentences={lesson.sentences} onComplete={() => onTaskComplete('mixedSentences')} />
      ),
    },
    {
      key: 'match',
      label: <span><AppstoreOutlined /> Match</span>,
      children: <MatchPictures vocab={lesson.vocab} onComplete={() => onTaskComplete('matchPictures')} />,
    },
    {
      key: 'fillblank',
      label: <span><EditOutlined /> Fill Blank</span>,
      children: (
        <FillBlank
          vocab={lesson.vocab}
          sentences={lesson.sentences}
          onComplete={() => onTaskComplete('fillBlank')}
        />
      ),
    },
    {
      key: 'crossword',
      label: <span><TableOutlined /> Crossword</span>,
      children: <Crossword vocab={lesson.vocab} onComplete={() => onTaskComplete('crossword')} />,
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={820}
      title={
        <div className="flex items-center gap-3">
          <span className="text-2xl">{lesson.icon}</span>
          <div>
            <div className="hanzi text-lg leading-tight">{lesson.titleCn}</div>
            <div className="text-sm text-gray-400 font-normal">{lesson.titleEn}</div>
          </div>
        </div>
      }
      destroyOnHidden
    >
      <Tabs items={items} defaultActiveKey="flashcards" tabBarGutter={14} size="middle" />
    </Modal>
  );
}
