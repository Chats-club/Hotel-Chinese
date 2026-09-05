import { Progress } from 'antd';
import { LockOutlined, CheckCircleFilled } from '@ant-design/icons';

export default function LessonCard({ lesson, progressRatio, onClick }) {
  const isComplete = progressRatio === 1;

  if (lesson.locked) {
    return (
      <div className="relative rounded-2xl p-5 flex flex-col gap-3 bg-gray-100 border border-dashed border-gray-300 cursor-not-allowed opacity-70">
        <div className="flex items-start justify-between">
          <span className="text-3xl grayscale">{lesson.icon}</span>
          <LockOutlined className="text-gray-400" />
        </div>
        <div>
          <div className="hanzi text-lg font-semibold text-gray-500">{lesson.titleCn}</div>
          <div className="text-sm text-gray-400">{lesson.titleEn}</div>
        </div>
        <div className="text-xs text-gray-400">Coming soon</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl p-5 flex flex-col gap-3 text-white shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${lesson.color}, ${lesson.color}cc)` }}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{lesson.icon}</span>
        {isComplete && <CheckCircleFilled className="text-lg text-white/90" />}
      </div>

      <div>
        <div className="hanzi text-xl font-semibold leading-tight">{lesson.titleCn}</div>
        <div className="text-sm text-white/85">{lesson.titleEn}</div>
      </div>

      <Progress
        percent={Math.round(progressRatio * 100)}
        size="small"
        showInfo={false}
        strokeColor="#ffffff"
        trailColor="rgba(255,255,255,0.3)"
      />

      <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 select-none pointer-events-none">
        {lesson.icon}
      </div>
    </div>
  );
}
