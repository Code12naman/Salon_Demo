const ICONS = {
  scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.1 8.1L20 20M8.1 15.9L20 4" /></>,
  brush: <><path d="M18 3l3 3-9 9-3-3 9-9z" /><path d="M9 12c-3 0-5 2-5 5 0 2 1 3 3 4 3 0 5-2 5-5" /></>,
  bottle: <><path d="M9 3h6v3l1 2v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l1-2V3z" /><path d="M8 12h8" /></>,
  dryer: <><path d="M3 9a5 5 0 0 1 5-5h7a5 5 0 0 1 0 10H8a5 5 0 0 1-5-5z" /><path d="M10 14l-1 7h4l1-7" /><circle cx="15" cy="9" r="1.5" /></>,
  razor: <><path d="M4 20L20 4" /><path d="M7 14l3 3M10 11l3 3M13 8l3 3" /></>,
  crown: <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14L7 22l5-3 5 3-1.5-8" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="M8 14h2M12 14h2M16 14h0M8 17.5h2M12 17.5h2" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  check: <path d="M5 13l4 4L19 7" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  heart: <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />,
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

export function Icon({ name, size = 22, stroke = 1.5, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

export function Photo({ src, alt = "", children, className = "", style, position = "center", loading = "lazy", fetchpriority = "auto" }) {
  return (
    <div className={"photo " + className} style={style}>
      {src && <img src={src} alt={alt} loading={loading} decoding="async" fetchpriority={fetchpriority} style={{ objectPosition: position }} />}
      {children}
    </div>
  );
}
