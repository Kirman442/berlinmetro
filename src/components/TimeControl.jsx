import { useEffect, useRef } from 'react';
import { START_YEAR, END_YEAR } from '../lib/config';

const decades = [];
for (let y = Math.ceil(START_YEAR / 20) * 20; y <= END_YEAR; y += 20) decades.push(y);

export default function TimeControl({ year, setYear, playing, setPlaying }) {
  const timer = useRef(null);
  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setInterval(() => {
      setYear((y) => {
        if (y >= END_YEAR) { setPlaying(false); return y; }
        return y + 1;
      });
    }, 220);
    return () => clearInterval(timer.current);
  }, [playing, setYear, setPlaying]);

  const togglePlay = () => {
    if (!playing && year >= END_YEAR) setYear(START_YEAR);
    setPlaying(!playing);
  };

  return (
    <div className="time">
      <button type="button" className="play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Abspielen'}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          {playing ? <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /> : <path d="M5 2.5v11l9-5.5z" fill="currentColor" />}
        </svg>
      </button>
      <div className="slider">
        <input type="range" min={START_YEAR} max={END_YEAR} step={1} value={year}
          onChange={(e) => { setPlaying(false); setYear(Number(e.target.value)); }} aria-label="Jahr" />
        <div className="ticks">
          {decades.map((d) => (
            <span key={d} style={{ left: `${((d - START_YEAR) / (END_YEAR - START_YEAR)) * 100}%` }}>{d}</span>
          ))}
        </div>
      </div>
      <div className="year">{year}</div>
    </div>
  );
}
