import React from 'react';

interface WordResult {
  typed: string;
  correct: boolean[];
}

interface WordDisplayProps {
  words: string[];
  currentIndex: number;
  userInput: string;
  wordResults: Map<number, WordResult>;
  batchStartIndex: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ 
  words,
  currentIndex,
  userInput,
  wordResults,
  batchStartIndex
}) => {
  const getCharClass = (wordIndex: number, charIndex: number): string => {
    const absoluteWordIndex = batchStartIndex + wordIndex;
    
    // Если слово уже завершено, берем результаты из сохраненных
    if (wordResults.has(absoluteWordIndex)) {
      const result = wordResults.get(absoluteWordIndex)!;
      if (charIndex < result.correct.length) {
        return result.correct[charIndex] ? 'correct' : 'incorrect';
      }
      return '';
    }
    
    // Если это текущее слово, проверяем по userInput
    if (wordIndex === currentIndex) {
      // Добавляем подчеркивание для текущей позиции
      if (charIndex === userInput.length) {
        return 'current';
      }
      
      if (charIndex >= userInput.length) {
        return '';
      }
      
      if (userInput[charIndex] === words[currentIndex][charIndex]) {
        return 'correct';
      } else {
        return 'incorrect';
      }
    }
    
    return '';
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

  // Проверяем, нужно ли показать подчеркивание пробела
  const shouldShowSpaceUnderline = (wordIndex: number): boolean => {
    if (wordIndex !== currentIndex) return false;
    const currentWord = words[currentIndex];
    return userInput.length === currentWord.length;
  };

  return (
    <div className="words-container">
      <div className="words-wrapper">
        {words.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            <span className={`${getWordClass(wordIndex)} ${shouldShowSpaceUnderline(wordIndex) ? 'waiting-space' : ''}`}>
              {word.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`char ${getCharClass(wordIndex, charIndex)}`}
                >
                  {char}
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;