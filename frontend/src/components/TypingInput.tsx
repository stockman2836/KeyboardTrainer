import React, { type RefObject } from 'react';

interface TypingInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

const TypingInput: React.FC<TypingInputProps> = ({ 
  value, 
  onChange, 
  inputRef 
}) => {
  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      className="typing-input"
      placeholder=""
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
    />
  );
};

export default TypingInput;