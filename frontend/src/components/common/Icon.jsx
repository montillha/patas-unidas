const PATHS = {
  paw: (
    <>
      <ellipse cx="7" cy="9" rx="2.2" ry="2.8" />
      <ellipse cx="12" cy="6.5" rx="2.2" ry="2.8" />
      <ellipse cx="17" cy="9" rx="2.2" ry="2.8" />
      <ellipse cx="19" cy="14.5" rx="2.2" ry="2.6" />
      <path d="M12 12c-3.5 0-6.5 2.3-6.5 5.2 0 1.8 1.6 3.3 3.6 3.3 1.1 0 1.9-.4 2.9-.4s1.8.4 2.9.4c2 0 3.6-1.5 3.6-3.3C18.5 14.3 15.5 12 12 12z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" fill="none" strokeWidth="2" stroke="currentColor" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  heart: (
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  ),
  check: (
    <path d="M5 12.5l4.5 4.5L19 7" fill="none" strokeWidth="2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ),
  shelter: (
    <>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        transform="translate(12,17) scale(0.18) translate(-12,-12)"
      />
    </>
  ),
  pin: (
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  ),
  mail: (
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  ),
  phone: (
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  ),
};

export function Icon({ name, size = 24, className }) {
  const content = PATHS[name];
  if (!content) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
