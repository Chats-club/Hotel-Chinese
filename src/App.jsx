import { useState } from 'react';
import { ConfigProvider, Typography, Button } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  MessageOutlined,
  SoundOutlined,
  AudioOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  ArrowLeftOutlined,
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

const HOME_KEY = 'lessons';

// Each section gets its own bright accent color so the footer reads as a
// colorful, easy-to-scan bar even over the blue gradient background — these
// are deliberately light/saturated shades (not the darker 500/600-weight
// versions) since a mid-tone blue background would wash out darker colors,
// and "Sentences" specifically avoids blue hues entirely so it doesn't
// blend into the footer itself.
const NAV_ITEMS = [
  { key: 'lessons', icon: <BookOutlined />, label: 'Lessons', color: '#fbbf24' },
  { key: 'vocabulary', icon: <ReadOutlined />, label: 'Vocabulary', color: '#34d399' },
  { key: 'sentences', icon: <MessageOutlined />, label: 'Sentences', color: '#e879f9' },
  { key: 'listening', icon: <SoundOutlined />, label: 'Listening', color: '#a78bfa' },
  { key: 'speaking', icon: <AudioOutlined />, label: 'Speaking', color: '#f472b6' },
  { key: 'quiz', icon: <QuestionCircleOutlined />, label: 'Quiz', color: '#67e8f9' },
  { key: 'review', icon: <ReloadOutlined />, label: 'Review', color: '#fb923c' },
  { key: 'progress', icon: <BarChartOutlined />, label: 'Progress', color: '#fde047' },
];

export default function App() {
  const [page, setPage] = useState(HOME_KEY);
  // Simple one-level-at-a-time navigation history, so every page can offer
  // a "Back" action that returns to wherever the person actually came from
  // (not always straight to Lessons), the same way a mobile app's back
  // button behaves.
  const [history, setHistory] = useState([]);
  const [, forceRender] = useState(0);
  const refresh = () => forceRender((n) => n + 1);

  function navigateTo(key) {
    if (key === page) return;
    setHistory((h) => [...h, page]);
    setPage(key);
  }

  function goBack() {
    setHistory((h) => {
      if (h.length === 0) {
        setPage(HOME_KEY);
        return h;
      }
      const next = [...h];
      const previous = next.pop();
      setPage(previous);
      return next;
    });
  }

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

  const showBack = page !== HOME_KEY;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0369a1', borderRadius: 12 } }}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2">
            {showBack ? (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                aria-label="Back"
              >
                <span className="hidden sm:inline">Back</span>
              </Button>
            ) : (
              <span className="w-2" />
            )}
            <Title level={4} className="mb-0">
              🏨 <span className="text-gray-700">Hotel Chinese</span>
            </Title>
          </div>
        </header>

        <main className="flex-1 p-6 pb-28">
          <div className="max-w-5xl mx-auto">{renderPage()}</div>
        </main>

        <footer className="bg-linear-to-r bg-black sticky bottom-0 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.15)]">
          <style>{`
            @keyframes navPop {
              0% { transform: scale(0.8); }
              55% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            .nav-item-active {
              animation: navPop 0.35s ease-out;
            }
            @keyframes navGlow {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.55; }
            }
            .nav-label-active {
              animation: navGlow 1.6s ease-in-out infinite;
            }
          `}</style>
          <nav className="grid grid-cols-4 sm:grid-cols-8">
            {NAV_ITEMS.map((item) => {
              const isActive = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigateTo(item.key)}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[11px] leading-tight text-center transition-colors"
                >
                  {isActive && (
                    <span
                      className="absolute inset-1 rounded-lg"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    />
                  )}
                  <span
                    className={`relative text-lg ${isActive ? 'nav-item-active' : ''}`}
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`relative ${isActive ? 'font-extrabold nav-label-active' : 'font-bold'}`}
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span
                      className="relative mt-0.5 h-0.5 w-6 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </footer>
      </div>
    </ConfigProvider>
  );
}