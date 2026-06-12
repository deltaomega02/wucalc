// src/app/[locale]/[...rest]/page.tsx — 매칭되지 않는 모든 경로를 404로 보낸다
import { notFound } from 'next/navigation';

// SSG 캐시를 타면 404 상태 코드 대신 200이 내려가므로 런타임 렌더 강제
export const dynamic = 'force-dynamic';

export default function CatchAllNotFound() {
  notFound();
}
