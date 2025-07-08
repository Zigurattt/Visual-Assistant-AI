import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); // Reset when text changes
    if (text) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
        if (i === text.length) {
          clearInterval(timer);
        }
      }, speed);

      return () => {
        clearInterval(timer);
      };
    }
  }, [text, speed]);

  return displayText;
};
