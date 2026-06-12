// src/components/ui/SearchSelect.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface SearchSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  group?: string;
  /** 옵션 좌측 썸네일 이미지 경로 (캐릭터 헤드/무기 아이콘) */
  icon?: string;
  /** 아이콘 배경색 (속성 브라이트 CSS 변수 등) */
  iconBg?: string;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  disabled = false,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = search
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          (o.sublabel?.toLowerCase().includes(search.toLowerCase()) ?? false),
      )
    : options;

  // 그룹별 정리
  const grouped = filtered.reduce<Record<string, SearchSelectOption[]>>(
    (acc, opt) => {
      const group = opt.group ?? '';
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    },
    {},
  );

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
      setSearch('');
    },
    [onChange],
  );

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // 열릴 때 input 포커스
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
          open
            ? 'border-primary bg-bg'
            : 'border-border bg-bg hover:border-text-muted'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <span className={`flex min-w-0 items-center gap-2 ${selectedOption ? 'text-text' : 'text-text-muted'}`}>
          {selectedOption?.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedOption.icon}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] shrink-0 rounded-md object-cover"
              style={selectedOption.iconBg ? { background: `color-mix(in srgb, ${selectedOption.iconBg} 20%, var(--color-bg))` } : undefined}
            />
          )}
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/20">
          {/* Search input */}
          <div className="border-b border-border p-2">
            <div className="relative">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-border bg-bg py-2 pl-8 pr-3 text-sm text-text placeholder-text-muted outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Options */}
          <div ref={listRef} data-lenis-prevent className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-text-muted">
                No results
              </p>
            )}
            {Object.entries(grouped).map(([group, opts]) => (
              <div key={group}>
                {group && (
                  <p className="px-3 pt-2 pb-1 text-[12px] font-medium uppercase tracking-wider text-text-muted">
                    {group}
                  </p>
                )}
                {opts.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      opt.value === value
                        ? 'bg-primary/10 text-primary'
                        : 'text-text hover:bg-bg'
                    }`}
                  >
                    {opt.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={opt.icon}
                        alt=""
                        width={26}
                        height={26}
                        loading="lazy"
                        className="h-[26px] w-[26px] shrink-0 rounded-md object-cover"
                        style={opt.iconBg ? { background: `color-mix(in srgb, ${opt.iconBg} 20%, var(--color-bg))` } : undefined}
                      />
                    )}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="shrink-0 text-xs text-text-muted">
                        {opt.sublabel}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
