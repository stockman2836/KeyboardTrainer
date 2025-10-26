import React from 'react';

interface WordDisplayProps {
  currentWord: string;
  nextWords: string[];
  userInput: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ 
  currentWord, 
  nextWords, 
  userInput 
}) => {
  const getCharClass = (charIndex: number): string => {
    if (charIndex >= userInput.length) {
      return '';
    }
    
    if (userInput[charIndex] === currentWord[charIndex]) {
      return 'correct';
    } else {
      return 'incorrect';
    }
  };

  return (
    <div className="words-container">
      {/* Текущее слово с проверкой букв */}
      <div className="current-word">
        {currentWord.split('').map((char, index) => (
          <span
            key={index}
            className={`char ${getCharClass(index)}`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Следующие слова */}
      <div className="next-words">
        {nextWords.map((word, index) => (
          <span key={index} className="word">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;