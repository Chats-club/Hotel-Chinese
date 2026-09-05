import { useEffect, useMemo } from 'react';
import { Button, List, Tag, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { speakChinese, isSpeechSupported, hasChineseVoice } from '../utils/speech';

const { Text } = Typography;

// Finds a sentence that actually uses this word as one of its word-tiles
// (chunks), falling back to a plain substring match if no exact tile match
// exists — gives every word a real, natural example in context where one
// is available in this lesson's sentence set.
function findExampleSentence(hanzi, sentences) {
  return (
    sentences.find((s) => s.chunks.includes(hanzi)) ||
    sentences.find((s) => s.hanzi.includes(hanzi)) ||
    null
  );
}

export default function Pronunciation({ vocab, sentences, toneDrills, onComplete }) {
  useEffect(() => {
    // Mark this tab as visited/complete as soon as it's opened.
    onComplete?.();
    // Intentionally run once on mount only — onComplete is a new function
    // reference on every parent render, so including it here would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supported = isSpeechSupported();
  const hasVoice = supported && hasChineseVoice();

  const wordsWithExamples = useMemo(
    () => vocab.map((item) => ({ ...item, example: findExampleSentence(item.hanzi, sentences) })),
    [vocab, sentences]
  );

  // Ant Design's default list border is a thin 1px line that's easy to miss
  // when scanning quickly — bumping both the outer container border and the
  // per-item dividers to 2px makes each word/sentence block much easier to
  // tell apart at a glance. Tailwind's `!` (important) modifier is needed
  // since antd's own border rules would otherwise win on specificity.
  const thickBorderListClass = '[&.ant-list-bordered]:!border-2 [&.ant-list-bordered]:!border-gray-300 [&_.ant-list-item]:!border-gray-300';
  const thickBorderItemClass = '!border-b-2';

  return (
    <div className="flex flex-col gap-5">
      {!supported && (
        <Text type="secondary" className="text-sm">
          Your browser doesn't support audio playback — you can still read the pinyin below.
        </Text>
      )}
      {supported && !hasVoice && (
        <Text type="secondary" className="text-sm">
          No Mandarin voice was found on this device, so playback may sound off or stay silent.
          You can still read the pinyin below — installing a Chinese (zh-CN) system voice will fix audio.
        </Text>
      )}

      {toneDrills && toneDrills.length > 0 && (
        <div>
          <Text strong className="block mb-2">Tone practice</Text>
          <Text type="secondary" className="text-xs block mb-2">
            Mandarin's four tones, tap to hear each one.
          </Text>
          <div className="flex flex-col gap-2">
            {toneDrills.map((drill, i) => (
              <div
                key={i}
                className="flex items-center gap-2 flex-wrap border-2 border-gray-300 rounded-lg px-3 py-2"
              >
                {drill.pinyinRow.map((syl, j) => (
                  <Button
                    key={j}
                    size="small"
                    onClick={() => speakChinese(syl)}
                    disabled={!supported}
                    className="hanzi"
                  >
                    {syl}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Text strong className="block mb-2">Words</Text>
        <List
          size="small"
          bordered
          className={thickBorderListClass}
          dataSource={wordsWithExamples}
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
                  disabled={!supported}
                />,
              ]}
            >
              <div className="w-full">
                <span className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="hanzi text-3xl font-medium">{item.hanzi}</span>
                  <Tag color="blue" className="text-sm">{item.pinyin}</Tag>
                  <span className="text-gray-500">{item.english}</span>
                </span>

                {item.example && (
                  <div className="mt-2 ml-1 pl-3 border-l-4 border-gray-300 flex items-start justify-between gap-2">
                    <div>
                      <div className="hanzi text-base text-gray-700">{item.example.hanzi}</div>
                      <div className="text-blue-600 text-sm">{item.example.pinyin}</div>
                      <div className="text-gray-400 text-sm">{item.example.english}</div>
                    </div>
                    <Button
                      size="small"
                      shape="circle"
                      icon={<SoundOutlined />}
                      onClick={() => speakChinese(item.example.hanzi)}
                      disabled={!supported}
                    />
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>

      <div>
        <Text strong className="block mb-2">Sentences</Text>
        <List
          size="small"
          bordered
          className={thickBorderListClass}
          dataSource={sentences}
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
                  disabled={!supported}
                />,
              ]}
            >
              <div>
                <div className="hanzi text-lg">{item.hanzi}</div>
                <div className="text-blue-600 text-sm">{item.pinyin}</div>
                <div className="text-gray-500 text-sm">{item.english}</div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}