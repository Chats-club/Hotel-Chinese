import { useMemo, useState } from 'react';
import { Button, Progress, Typography, Tag, Empty, message } from 'antd';
import { SoundOutlined, AudioOutlined, RightOutlined, CheckCircleFilled } from '@ant-design/icons';
import lessons from '../data/lessons';
import { speakChinese } from '../utils/speech';
import { isRecognitionSupported, isSecureContextOk, recognizeOnce, scorePronunciation } from '../utils/speechRecognition';

const { Text } = Typography;

export default function SpeakingPage() {
  const [msgApi, contextHolder] = message.useMessage();

  const items = useMemo(() => {
    const rows = [];
    for (const lesson of lessons) {
      if (lesson.locked) continue;
      for (const s of lesson.sentences) rows.push(s);
    }
    return rows;
  }, []);

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | listening | done
  const [result, setResult] = useState(null); // { heard, score }
  const [completedCount, setCompletedCount] = useState(0);

  const supported = isRecognitionSupported();
  const secure = isSecureContextOk();
  const item = items[index];
  const isLast = index === items.length - 1;

  if (items.length === 0) {
    return <Empty description="No sentences available yet" />;
  }

  const ERROR_MESSAGES = {
    not_supported: "Speech recognition isn't available in this browser — try Chrome or Edge, or just practice by listening and repeating out loud.",
    insecure_context: 'Speech recognition needs a secure connection (HTTPS) — it won\'t work over a plain http:// address except on localhost.',
    'not-allowed': 'Microphone access was denied. Check your browser\'s site settings and allow the microphone, then try again.',
    'service-not-allowed': 'Microphone access was denied. Check your browser\'s site settings and allow the microphone, then try again.',
    'audio-capture': 'No microphone was found. Connect one and try again.',
    network: 'Network error while recognizing speech — check your connection and try again.',
    'no-speech': "Didn't hear anything — make sure your mic isn't muted, then try again.",
    timeout: "Didn't catch that in time — try again.",
    start_failed: 'Could not start the microphone — try again.',
  };

  async function handleRecord() {
    setStatus('listening');
    setResult(null);
    try {
      const heard = await recognizeOnce({ lang: 'zh-CN' });
      const score = scorePronunciation(item.hanzi, heard);
      setResult({ heard, score });
      if (score >= 0.7) setCompletedCount((c) => c + 1);
    } catch (err) {
      msgApi.warning(ERROR_MESSAGES[err.message] || 'Something went wrong — try again.');
    } finally {
      setStatus('done');
    }
  }

  function markPracticed() {
    setCompletedCount((c) => c + 1);
    next();
  }

  function next() {
    if (isLast) return;
    setIndex((i) => i + 1);
    setStatus('idle');
    setResult(null);
  }

  return (
    <div>
      {contextHolder}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Speaking</h2>
        <p className="text-gray-500 text-sm">Listen, then repeat the phrase out loud.</p>
      </div>

      <div className="max-w-xl flex flex-col gap-4">
        {supported && !secure && (
          <Text type="warning" className="text-xs">
            ⚠️ This page isn't running on a secure connection (https, or localhost), so the microphone won't work here — speak-and-check is disabled. You can still listen and repeat out loud, or open this app over https:// / localhost to enable it.
          </Text>
        )}
        <Progress percent={Math.round((completedCount / items.length) * 100)} size="small" showInfo={false} />
        <Text type="secondary" className="text-sm">
          Phrase {index + 1} / {items.length}
        </Text>

        <div className="flex flex-col items-center gap-3 py-6 rounded-xl border border-gray-200 bg-gray-50">
          <Button shape="circle" size="large" type="primary" icon={<SoundOutlined />} onClick={() => speakChinese(item.hanzi)} />
          <Text type="secondary" className="text-xs">tap to hear it</Text>

          <div className="hanzi text-2xl mt-2">{item.hanzi}</div>
          <div className="text-blue-600 text-sm">{item.pinyin}</div>
          <div className="text-gray-500 text-sm">{item.english}</div>

          {supported && secure ? (
            <Button
              className="mt-3"
              icon={<AudioOutlined />}
              loading={status === 'listening'}
              onClick={handleRecord}
            >
              {status === 'listening' ? 'Listening...' : 'Tap to speak'}
            </Button>
          ) : (
            <Button className="mt-3" icon={<CheckCircleFilled />} onClick={markPracticed}>
              Mark as practiced
            </Button>
          )}

          {result && (
            <div className="mt-2 flex flex-col items-center gap-1">
              <Tag color={result.score >= 0.7 ? 'green' : result.score >= 0.4 ? 'orange' : 'red'}>
                Heard: {result.heard || '(nothing)'}
              </Tag>
              <Text type="secondary" className="text-xs">
                {result.score >= 0.7 ? 'Great pronunciation!' : result.score >= 0.4 ? 'Close — try again' : 'Try again'}
              </Text>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="primary" icon={<RightOutlined />} onClick={next} disabled={isLast}>
            {isLast ? 'Last phrase' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
