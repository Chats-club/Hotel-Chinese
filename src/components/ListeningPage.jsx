import { useMemo } from 'react';
import { Empty, message } from 'antd';
import lessons from '../data/lessons';
import FillBlank from './FillBlank';

export default function ListeningPage() {
  const [msgApi, contextHolder] = message.useMessage();

  const { allVocab, allSentences } = useMemo(() => {
    const vocab = [];
    const sentences = [];
    for (const lesson of lessons) {
      if (lesson.locked) continue;
      vocab.push(...lesson.vocab);
      sentences.push(...lesson.sentences);
    }
    return { allVocab: vocab, allSentences: sentences };
  }, []);

  if (allSentences.length === 0) {
    return <Empty description="No sentences available yet" />;
  }

  return (
    <div>
      {contextHolder}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listening</h2>
        <p className="text-gray-500 text-sm">Listen and fill in the missing word, across all unlocked lessons.</p>
      </div>
      <div className="max-w-xl">
        <FillBlank
          vocab={allVocab}
          sentences={allSentences}
          maxItems={800}
          onComplete={() => msgApi.success('Nice work — set complete!')}
        />
      </div>
    </div>
  );
}