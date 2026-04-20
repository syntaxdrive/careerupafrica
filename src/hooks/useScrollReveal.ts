import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach(el => observer.observe(el));

    // Cleanup when component unmounts
    return () => observer.disconnect();
  }, []);
}