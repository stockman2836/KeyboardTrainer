import { useState, useEffect } from 'react';
import { fetchWords } from '../services/api';

interface UseInfiniteWordsReturn {
  words: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  loadInitialWords: () => Promise<void>;
}

export const useInfiniteWords = (currentWordIndex: number): UseInfiniteWordsReturn => {
  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Загрузка первых слов
  const loadInitialWords = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fetchedWords = await fetchWords(50);
      setWords(fetchedWords);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load words:', error);
      setIsLoading(false);
    }
  };

  // Подгрузка дополнительных слов
  const loadMoreWords = async (): Promise<void> => {
    try {
      setIsLoadingMore(true);
      const newWords = await fetchWords(50);
      setWords(prev => [...prev, ...newWords]);
      setIsLoadingMore(false);
    } catch (error) {
      console.error('Failed to load more words:', error);
      setIsLoadingMore(false);
    }
  };

  // Автоматическая подгрузка при приближении к концу
  useEffect(() => {
    const remainingWords = words.length - currentWordIndex;
    
    if (remainingWords < 20 && !isLoadingMore && words.length > 0) {
      loadMoreWords();
    }
  }, [currentWordIndex, words.length, isLoadingMore]);

  return {
    words,
    isLoading,
    isLoadingMore,
    loadInitialWords
  };
};