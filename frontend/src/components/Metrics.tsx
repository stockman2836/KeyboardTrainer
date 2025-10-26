import React from 'react';

interface MetricsProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  wordsTyped: number;
}

const Metrics: React.FC<MetricsProps> = ({ wpm, cpm, accuracy, wordsTyped }) => {
  return (
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
        <div className="metric-value">{wordsTyped}</div>
        <div className="metric-label">Words</div>
      </div>
    </div>
  );
};

export default Metrics;