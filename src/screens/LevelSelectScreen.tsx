import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../levels/registry';
import { Button, StarDisplay, Meter } from '../components/ui';
import './LevelSelectScreen.css';

export const LevelSelectScreen: React.FC = () => {
  const { setScreen, setCurrentLevel, PC, SS, starsByLevel } = useGameStore();

  const handleLevelSelect = (levelId: string) => {
    setCurrentLevel(levelId);
    setScreen('level');
  };

  const handleBack = () => {
    setScreen('home');
  };

  return (
    <div className="level-select-screen">
      <div className="level-select-content">
        <motion.header
          className="level-select-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Choose Your Challenge</h1>
          
          <div className="meters-display">
            <Meter
              label="Personal Contentment"
              value={PC}
              color="#4CAF50"
              icon="⚙️"
            />
            <Meter
              label="Social Standing"
              value={SS}
              color="#2196F3"
              icon="👥"
            />
          </div>
        </motion.header>

        <motion.div
          className="levels-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {LEVELS.map((level, index) => {
            const isLocked = index > 0 && !starsByLevel[LEVELS[index - 1].id];
            const stars = starsByLevel[level.id] || 0;
            
            return (
              <motion.div
                key={level.id}
                className={`level-card ${level.type} ${isLocked ? 'locked' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                whileHover={!isLocked ? { y: -4 } : undefined}
              >
                <div className="level-card-header">
                  <h3 className="level-title">{level.title}</h3>
                  <span className={`level-type level-type--${level.type}`}>
                    {level.type === 'mechanical' ? '⚙️' : '💬'}
                  </span>
                </div>
                
                <p className="level-goal">{level.goal}</p>
                
                <div className="level-meta">
                  <div className="level-target">
                    🎯 {level.timerTargetSec}s target
                  </div>
                  
                  {stars > 0 && (
                    <div className="level-progress">
                      <StarDisplay count={stars} size="small" />
                    </div>
                  )}
                </div>
                
                <div className="level-actions">
                  <Button
                    onClick={() => handleLevelSelect(level.id)}
                    disabled={isLocked}
                    variant="primary"
                  >
                    {isLocked ? '🔒 Locked' : stars > 0 ? 'Replay' : 'Start'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="level-select-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button onClick={handleBack} variant="secondary">
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};