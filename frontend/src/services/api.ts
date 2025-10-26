import type { WordsResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000';

export const fetchWords = async (count: number = 50): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/words?count=${count}`);
    const data: WordsResponse = await response.json();
    return data.words;
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
};