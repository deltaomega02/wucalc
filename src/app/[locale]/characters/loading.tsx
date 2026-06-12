// src/app/[locale]/loading.tsx — 라우트 전환 공통 로딩
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="flex items-end gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-[color:var(--color-coast-mid)]"
            style={{
              height: 18,
              animation: `loading-wave 1s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes loading-wave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
