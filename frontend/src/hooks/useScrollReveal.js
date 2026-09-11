import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisivel(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(elemento);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visivel };
}
