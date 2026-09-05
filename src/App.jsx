import { useState } from 'react';
import { ConfigProvider, Typography } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  MessageOutlined,
  SoundOutlined,
  AudioOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import LessonsPage from './components/LessonsPage';
import VocabularyPage from './components/VocabularyPage';
import SentencesPage from './components/SentencesPage';
import ListeningPage from './components/ListeningPage';
import SpeakingPage from './components/SpeakingPage';
import QuizPage from './components/QuizPage';
import ReviewPage from './components/ReviewPage';
import ProgressPage from './components/ProgressPage';

const { Title } = Typography;

const NAV_ITEMS = [
  { key: 'lessons', icon: <BookOutlined />, label: 'Lessons' },
  { key: 'vocabulary', icon: <ReadOutlined />, label: 'Vocabulary' },
  { key: 'sentences', icon: <MessageOutlined />, label: 'Sentences' },
  { key: 'listening', icon: <SoundOutlined />, label: 'Listening' },
  { key: 'speaking', icon: <AudioOutlined />, label: 'Speaking' },
  { key: 'quiz', icon: <QuestionCircleOutlined />, label: 'Quiz' },
  { key: 'review', icon: <ReloadOutlined />, label: 'Review' },
  { key: 'progress', icon: <BarChartOutlined />, label: 'Progress' },
];

export default function App() {
  const [page, setPage] = useState('lessons');
  const [, forceRender] = useState(0);
  const refresh = () => forceRender((n) => n + 1);

  function renderPage() {
    switch (page) {
      case 'lessons':
        return <LessonsPage onProgressChange={refresh} />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'sentences':
        return <SentencesPage />;
      case 'listening':
        return <ListeningPage />;
      case 'speaking':
        return <SpeakingPage />;
      case 'quiz':
        return <QuizPage onQuizAnswered={refresh} />;
      case 'review':
        return <ReviewPage />;
      case 'progress':
        return <ProgressPage />;
      default:
        return null;
    }
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0369a1', borderRadius: 12 } }}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <Title level={4} className="mb-0">
              🏨 <span className="text-gray-700">Hotel Chinese</span>
            </Title>
          </div>
        </header>

        <main className="flex-1 p-6 pb-28">
          <div className="max-w-5xl mx-auto">{renderPage()}</div>
        </main>

        <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-10">
          <nav className="grid grid-cols-4 sm:grid-cols-8">
            {NAV_ITEMS.map((item) => {
              const isActive = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[11px] leading-tight text-center transition-colors
                    ${isActive ? 'text-sky-700' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  <span className={`text-lg ${isActive ? 'text-sky-700' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
                  {isActive && <span className="mt-0.5 h-0.5 w-6 rounded-full bg-sky-700" />}
                </button>
              );
            })}
          </nav>
        </footer>
      </div>
    </ConfigProvider>
  );
}