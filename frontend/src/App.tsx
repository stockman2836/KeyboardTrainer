import { useState, useEffect, useRef } from 'react';
import './App.css';

interface WordsResponse {
  success: boolean;
  words: string[];
  count: number;
}

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Метрики
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Обновление метрик в реальном времени
  useEffect(() => {
    if (startTime && currentWordIndex > 0) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // в минутах
      
      // WPM
      const wordsPerMinute = Math.round(currentWordIndex / timeElapsed);
      setWpm(wordsPerMinute);
      
      // CPM
      const charsPerMinute = Math.round(correctChars / timeElapsed);
      setCpm(charsPerMinute);
      
      // Accuracy
      if (totalCharsTyped > 0) {
        const acc = Math.round((correctChars / totalCharsTyped) * 100);
        setAccuracy(acc);
      }
    }
  }, [currentWordIndex, startTime, correctChars, totalCharsTyped]);

  const fetchWords = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/words?count=50');
      const data: WordsResponse = await response.json();
      setWords(data.words);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase();
    const currentWord = words[currentWordIndex];

    // Начинаем таймер при первом нажатии
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    // Если пользователь нажал пробел
    if (value.length > 0 && value[value.length - 1] === ' ') {
      const typedWord = value.trim();
      
      // Подсчет правильных и общих символов
      let correct = 0;
      for (let i = 0; i < typedWord.length; i++) {
        if (i < currentWord.length && typedWord[i] === currentWord[i]) {
          correct++;
        }
      }
      
      setTotalCharsTyped(prev => prev + typedWord.length);
      setCorrectChars(prev => prev + correct);
      
      if (typedWord === currentWord) {
        // Правильно! Переходим к следующему слову
        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput('');
      } else {
        // Неправильно - все равно идем дальше
        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput('');
      }
    } else if (value.length <= currentWord.length) {
      // Обычный ввод
      setUserInput(value);
    }
  };

  // Функция для определения цвета каждой буквы
  const getCharClass = (charIndex: number): string => {
    if (charIndex >= userInput.length) {
      return ''; // Еще не напечатано
    }
    
    const currentWord = words[currentWordIndex];
    if (userInput[charIndex] === currentWord[charIndex]) {
      return 'correct'; // Зеленый
    } else {
      return 'incorrect'; // Красный
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

  return (
    <div className="app">
      <h1>Typing Trainer</h1>
      
      {/* Метрики */}
      <div className="metrics">
        <div className="metric">
          <div className="metric-value">{wpm}</div>
          <div className="metric-label">WPM</div>
        </div>
        <div className="metric">
          <div className="metric-value">{cpm}</div>
          <div className="metric-label">CPM</div>
        </div>
        <div className="metric">
          <div className="metric-value">{accuracy}%</div>
          <div className="metric-label">Accuracy</div>
        </div>
        <div className="metric">
          <div className="metric-value">{currentWordIndex}</div>
          <div className="metric-label">Words</div>
        </div>
      </div>

      {/* Отображение слов */}
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
          {words.slice(currentWordIndex + 1, currentWordIndex + 10).map((word, index) => (
            <span key={currentWordIndex + 1 + index} className="word">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Инпут для печати */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="typing-input"
        placeholder="start typing..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}

export default App;