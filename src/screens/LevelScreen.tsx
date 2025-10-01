import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getLevelById } from '../levels/registry';
import { Button, Meter } from '../components/ui';

// Import level components
import { PowerLoop } from '../levels/powerLoop';
import { PrinterPanic } from '../levels/printerPanic';
import { SmallTalk } from '../levels/smallTalk';
import { ShowAndTell } from '../levels/showAndTell';

import './LevelScreen.css';

const LevelComponents: Record<string, React.ComponentType<any>> = {
  powerLoop: PowerLoop,
  printerPanic: PrinterPanic,
  smallTalk: SmallTalk,
  showAndTell: ShowAndTell,
};

export const LevelScreen: React.FC = () => {
  const { currentLevel, PC, SS, setScreen, completePuzzle } = useGameStore();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const level = currentLevel ? getLevelById(currentLevel) : null;
  const LevelComponent = currentLevel ? LevelComponents[currentLevel] : null;

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleBack = () => {
    setScreen('levelSelect');
  };

  if (!level || !LevelComponent) {
    return (
      <div className="level-screen">
        <div className="level-error">
          <h2>Level not found</h2>
          <Button onClick={handleBack}>← Back to Level Select</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="level-screen">
      <motion.header
        className="level-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="level-info">
          <h1 className="level-title">{level.title}</h1>
          <p className="level-goal">{level.goal}</p>
        </div>
        
        <div className="level-hud">
          <div className="meters">
            <Meter
              label="PC"
              value={PC}
              color="#4CAF50"
              icon="⚙️"
            />
            <Meter
              label="SS"
              value={SS}
              color="#2196F3"
              icon="👥"
            />
          </div>
          
          <div className="timer">
            <span className="timer-label">Time:</span>
            <span className="timer-value">{timeElapsed}s</span>
          </div>
        </div>
        
        <div className="level-nav">
          <Button onClick={handleBack} variant="secondary">
            ← Back
          </Button>
        </div>
      </motion.header>

      <main className="level-main">
        <LevelComponent
          onComplete={(result: any) => {
            setIsActive(false);
            if (currentLevel) {
              completePuzzle(currentLevel, result);
            }
            // Return to level select after a short delay
            setTimeout(() => setScreen('levelSelect'), 1000);
          }}
          timeElapsed={timeElapsed}
        />
      </main>
    </div>
  );
};