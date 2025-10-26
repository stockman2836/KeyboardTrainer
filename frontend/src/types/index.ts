export interface WordsResponse {
  success: boolean;
  words: string[];
  count: number;
}

export interface TypingMetrics {
  wpm: number;
  cpm: number;
  accuracy: number;
  totalCharsTyped: number;
  correctChars: number;
}

export interface TypingState {
  words: string[];
  currentWordIndex: number;
  userInput: string;
  startTime: number | null;
  isLoading: boolean;
  metrics: TypingMetrics;
}