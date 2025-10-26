import React from 'react';

interface WordDisplayProps {
  words: string[];
  currentIndex: number;
  userInput: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ 
  words,
  currentIndex,
  userInput 
}) => {
  const getCharClass = (wordIndex: number, charIndex: number): string => {
    // Если это не текущее слово
    if (wordIndex !== currentIndex) {
      return '';
    }
    
    // Для текущего слова проверяем введенные символы
    if (charIndex >= userInput.length) {
      return '';
    }
    
    if (userInput[charIndex] === words[currentIndex][charIndex]) {
      return 'correct';
    } else {
      return 'incorrect';
    }
  };

  const getWordClass = (wordIndex: number): string => {
    if (wordIndex < currentIndex) {
      return 'word completed';
    } else if (wordIndex === currentIndex) {
      return 'word active';
    } else {
      return 'word';
    }
  };

  return (
    <div className="words-container">
      <div className="words-wrapper">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className={getWordClass(wordIndex)}>
            {word.split('').map((char, charIndex) => (
              <span
                key={charIndex}
                className={`char ${getCharClass(wordIndex, charIndex)}`}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;