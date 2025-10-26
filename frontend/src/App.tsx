import { useState, useEffect } from 'react';
import './App.css';
import { useInfiniteWords } from './hooks/useInfiniteWords';
import { useTypingGame } from './hooks/useTypingGame';
import Metrics from './components/Metrics';
import WordDisplay from './components/WordDisplay';
import ControlButtons from './components/ControlButtons';

const WORDS_PER_BATCH = 20;

function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [batchStartIndex, setBatchStartIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  
  // Метрики
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);

  // Используем хуки
  const { words, isLoading, isLoadingMore, loadInitialWords } = useInfiniteWords(currentWordIndex);
  const { gameStatus, startGame, pauseGame, restartGame } = useTypingGame();

  useEffect(() => {
    loadInitialWords();
  }, []);

  // Проверка, нужно ли загрузить новый батч слов
  useEffect(() => {
    if (currentWordIndex >= batchStartIndex + WORDS_PER_BATCH) {
      setBatchStartIndex(currentWordIndex);
    }
  }, [currentWordIndex, batchStartIndex]);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      // Игнорируем специальные клавиши
      if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') return;

      e.preventDefault();

      const currentWord = words[currentWordIndex];

      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      } else if (e.key === ' ') {
        // Пробел - проверяем слово
        const typedWord = userInput;
        
        let correct = 0;
        for (let i = 0; i < typedWord.length; i++) {
          if (i < currentWord.length && typedWord[i] === currentWord[i]) {
            correct++;
          }
        }
        
        setTotalCharsTyped(prev => prev + typedWord.length);
        setCorrectChars(prev => prev + correct);
        setCurrentWordIndex(prev => prev + 1);
        setUserInput('');

        if (!startTime) {
          setStartTime(Date.now());
        }
      } else {
        // Обычная буква
        const char = e.key.toLowerCase();
        if (char.length === 1 && userInput.length < currentWord.length) {
          setUserInput(prev => prev + char);
          
          if (!startTime) {
            setStartTime(Date.now());
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStatus, userInput, currentWordIndex, words, startTime]);

  // Обновление метрик в реальном времени
  useEffect(() => {
    if (startTime && currentWordIndex > 0 && gameStatus === 'playing') {
      const timeElapsed = (Date.now() - startTime - pausedTime) / 1000 / 60;
      
      const wordsPerMinute = Math.round(currentWordIndex / timeElapsed);
      setWpm(wordsPerMinute);
      
      const charsPerMinute = Math.round(correctChars / timeElapsed);
      setCpm(charsPerMinute);
      
      if (totalCharsTyped > 0) {
        const acc = Math.round((correctChars / totalCharsTyped) * 100);
        setAccuracy(acc);
      }
    }
  }, [currentWordIndex, startTime, correctChars, totalCharsTyped, gameStatus, pausedTime]);

  const handleStart = () => {
    startGame();
    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  const handlePause = () => {
    pauseGame();
    if (startTime) {
      setPausedTime(prev => prev + (Date.now() - startTime));
    }
  };

  const handleRestart = () => {
    restartGame();
    setCurrentWordIndex(0);
    setBatchStartIndex(0);
    setUserInput('');
    setStartTime(null);
    setPausedTime(0);
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setTotalCharsTyped(0);
    setCorrectChars(0);
    loadInitialWords();
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">Loading words...</div>
      </div>
    );
  }

  // Получаем текущий батч слов
  const currentBatchWords = words.slice(batchStartIndex, batchStartIndex + WORDS_PER_BATCH);
  const relativeCurrentIndex = currentWordIndex - batchStartIndex;

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
        words={currentBatchWords}
        currentIndex={relativeCurrentIndex}
        userInput={gameStatus === 'playing' ? userInput : ''}
      />

      <ControlButtons
        gameStatus={gameStatus}
        onStart={handleStart}
        onPause={handlePause}
        onRestart={handleRestart}
      />

      {isLoadingMore && (
        <div className="loading-indicator">
          Loading more words...
        </div>
      )}

      {gameStatus === 'idle' && (
        <div className="hint">
          Press START and begin typing!
        </div>
      )}
    </div>
  );
}

export default App;