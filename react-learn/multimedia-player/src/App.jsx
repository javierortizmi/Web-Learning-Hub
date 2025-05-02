import { useRef, useState, useEffect } from 'react';
import './App.css';

const songs = [
  { title: "Canción 1", file: "/audio1.mp3" },
  { title: "Canción 2", file: "/audio2.mp3" }
];

export default function App() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [audioCtx, setAudioCtx] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (!audioCtx) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaElementSource(audioRef.current);
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 64;
      source.connect(analyserNode);
      analyserNode.connect(context.destination);
      setAudioCtx(context);
      setAnalyser(analyserNode);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handleSongChange = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (analyser && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength);
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2;
          ctx.fillStyle = `rgb(${barHeight + 100},50,150)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
        requestAnimationFrame(draw);
      };
      draw();
    }
  }, [analyser]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      songs.push({ title: file.name, file: url });
      setCurrentSongIndex(songs.length - 1);
      setTimeout(() => {
        audioRef.current.play();
        setIsPlaying(true);
      }, 100);
    }
  };

  return (
    <div>
      <div className="player-container">
        <h1>🎧 React Audio Player</h1>
        <p className="song-title">{songs[currentSongIndex].title}</p>

        <canvas ref={canvasRef} width={400} height={100} className="visualizer" />

        <audio
          ref={audioRef}
          src={songs[currentSongIndex].file}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        <div className="controls">
          <button onClick={togglePlayback} className="main-button">
            {isPlaying ? '⏸ Pausar' : '▶️ Reproducir'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const newTime = (e.target.value / 100) * duration;
              audioRef.current.currentTime = newTime;
              setProgress(e.target.value);
              setCurrentTime(newTime);
            }}
          />
          <div className="time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="song-list">
          {songs.map((song, index) => (
            <button
              key={index}
              onClick={() => handleSongChange(index)}
              className={index === currentSongIndex ? 'selected' : ''}
            >
              {song.title}
            </button>
          ))}
        </div>

        <div className="upload-section">
          <input type="file" accept="audio/*" onChange={handleFileUpload} />
        </div>
      </div>

      <footer className='footer'>
        <p>Made with ❤️ by <a href="https://www.javierortizmi.com/" target="_blank" rel="noopener noreferrer">Javier Ortiz Millan</a></p>
        <p>Source code available on <a href="https://github.com/javierortizmi/web-development/tree/main/react-learn/multimedia-player" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}
