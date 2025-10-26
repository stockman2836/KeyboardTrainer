import { useState, useEffect, useRef } from 'react';
import './App.css';
import { useInfiniteWords } from './hooks/useInfiniteWords';
import Metrics from './components/Metrics';
import WordDisplay from './components/WordDisplay';
import TypingInput from './components/TypingInput';

function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  
  // Метрики
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Используем хук для бесконечной подгрузки слов
  const { words, isLoading, isLoadingMore, loadInitialWords } = useInfiniteWords(currentWordIndex);

  useEffect(() => {
    loadInitialWords();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Обновление метрик в реальном времени
  useEffect(() => {
    if (startTime && currentWordIndex > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      
      const wordsPerMinute = Math.round(currentWordIndex / timeElapsed);
      setWpm(wordsPerMinute);
      
      const charsPerMinute = Math.round(correctChars / timeElapsed);
      setCpm(charsPerMinute);
      
      if (totalCharsTyped > 0) {
        const acc = Math.round((correctChars / totalCharsTyped) * 100);
        setAccuracy(acc);
      }
    }
  }, [currentWordIndex, startTime, correctChars, totalCharsTyped]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase();
    const currentWord = words[currentWordIndex];

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    if (value.length > 0 && value[value.length - 1] === ' ') {
      const typedWord = value.trim();
      
      let correct = 0;
      for (let i = 0; i < typedWord.length; i++) {
        if (i < currentWord.length && typedWord[i] === currentWord[i]) {
          correct++;
        }
      }
      
      setTotalCharsTyped(prev => prev + typedWord.length);
      setCorrectChars(prev => prev + correct);
      setCurrentWordIndex(currentWordIndex + 1);
      setUserInput('');
    } else if (value.length <= currentWord.length) {
      setUserInput(value);
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">Loading words...</div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const nextWords = words.slice(currentWordIndex + 1, currentWordIndex + 10);

  return (
    <div className="app">
      <h1>Typing Trainer</h1>
      
      <Metrics 
        wpm={wpm}
        cpm={cpm}
        accuracy={accuracy}
        wordsTyped={currentWordIndex}
      />

      <WordDisplay 
        currentWord={currentWord}
        nextWords={nextWords}
        userInput={userInput}
      />

      <TypingInput 
        value={userInput}
        onChange={handleInputChange}
        inputRef={inputRef}
      />

      {isLoadingMore && (
        <div className="loading-indicator">
          Loading more words...
        </div>
      )}
    </div>
  );
}

export default App;