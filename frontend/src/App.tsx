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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

    if (value.length > 0 && value[value.length - 1] === ' ') {

      const typedWord = value.trim();
      
      if (typedWord === currentWord) {

        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput('');
      }
    } else if (value.length <= currentWord.length) {

      setUserInput(value);
    }
  };

  const getCharClass = (charIndex: number): string => {
    if (charIndex >= userInput.length) {
      return '';
    }
    
    const currentWord = words[currentWordIndex];
    if (userInput[charIndex] === currentWord[charIndex]) {
      return 'correct';
    } else {
      return 'incorrect';
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
      
      {}
      <div className="words-container">
        {}
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

        {}
        <div className="next-words">
          {words.slice(currentWordIndex + 1, currentWordIndex + 10).map((word, index) => (
            <span key={currentWordIndex + 1 + index} className="word">
              {word}
            </span>
          ))}
        </div>
      </div>

      {}
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

      {}
      <div className="stats">
        <div>Words: {currentWordIndex} / {words.length}</div>
      </div>
    </div>
  );
}

export default App;