import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleResult } from '../../types';
import { Button } from '../../components/ui';
import './PrinterPanic.css';

interface PrinterPanicProps {
  onComplete: (result: PuzzleResult) => void;
  timeElapsed: number;
}

interface KnobPosition {
  front: number; // 0-100
  left: number;  // 0-100
  right: number; // 0-100
}

export const PrinterPanic: React.FC<PrinterPanicProps> = ({ onComplete, timeElapsed }) => {
  const [knobPositions, setKnobPositions] = useState<KnobPosition>({
    front: 20,
    left: 80,
    right: 30
  });
  const [temperature, setTemperature] = useState(180);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentExtrusion, setCurrentExtrusion] = useState('beaded');
  const [isPrinting, setIsPrinting] = useState(false);

  // Target values for success
  const TARGET_TEMP_MIN = 195;
  const TARGET_TEMP_MAX = 205;
  const KNOB_TOLERANCE = 15; // ±15% from 50% (center position)

  // Check if all conditions are met
  const checkSuccess = useCallback(() => {
    const tempInRange = temperature >= TARGET_TEMP_MIN && temperature <= TARGET_TEMP_MAX;
    const frontInRange = Math.abs(knobPositions.front - 50) <= KNOB_TOLERANCE;
    const leftInRange = Math.abs(knobPositions.left - 50) <= KNOB_TOLERANCE;
    const rightInRange = Math.abs(knobPositions.right - 50) <= KNOB_TOLERANCE;
    
    return tempInRange && frontInRange && leftInRange && rightInRange;
  }, [knobPositions, temperature]);

  // Update extrusion quality based on current settings
  useEffect(() => {
    const tempInRange = temperature >= TARGET_TEMP_MIN && temperature <= TARGET_TEMP_MAX;
    const averageDistance = (
      Math.abs(knobPositions.front - 50) +
      Math.abs(knobPositions.left - 50) +
      Math.abs(knobPositions.right - 50)
    ) / 3;

    if (tempInRange && averageDistance <= KNOB_TOLERANCE) {
      setCurrentExtrusion('perfect');
    } else if (tempInRange && averageDistance <= 25) {
      setCurrentExtrusion('good');
    } else {
      setCurrentExtrusion('beaded');
    }
  }, [knobPositions, temperature]);

  // Check for completion when settings change
  useEffect(() => {
    const isSuccessful = checkSuccess();
    if (isSuccessful && !isComplete) {
      setIsComplete(true);
      setIsPrinting(true);
      
      // Calculate score
      const stars = calculateStars();
      const result: PuzzleResult = {
        stars,
        pcDelta: getScoreDeltas(stars).pc,
        ssDelta: getScoreDeltas(stars).ss,
        timeElapsed,
        attempts,
        hintsUsed,
      };
      
      setTimeout(() => onComplete(result), 3000);
    }
  }, [knobPositions, temperature, isComplete, timeElapsed, attempts, hintsUsed, onComplete]);

  // Show hint after 20 seconds
  useEffect(() => {
    if (timeElapsed >= 20 && !isComplete && !showHint) {
      setShowHint(true);
    }
  }, [timeElapsed, isComplete, showHint]);

  const handleKnobChange = (knob: keyof KnobPosition, value: number) => {
    setKnobPositions(prev => ({ ...prev, [knob]: value }));
    setAttempts(prev => prev + 1);
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    setAttempts(prev => prev + 1);
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(false);
  };

  const calculateStars = (): 0 | 1 | 2 | 3 => {
    let stars = 3;
    
    if (timeElapsed > 60) stars -= 1;
    if (timeElapsed > 90) stars -= 1;
    if (attempts > 6) stars -= 1;
    if (hintsUsed > 0) stars -= 1;
    
    // Bonus for speed
    if (timeElapsed < 40) stars = Math.min(3, stars + 1);
    
    return Math.max(0, stars) as 0 | 1 | 2 | 3;
  };

  const getScoreDeltas = (stars: number) => {
    switch (stars) {
      case 3: return { pc: 15, ss: 5 };
      case 2: return { pc: 10, ss: 3 };
      case 1: return { pc: 6, ss: 2 };
      default: return { pc: -5, ss: -2 };
    }
  };

  const getKnobColor = (knob: keyof KnobPosition) => {
    const distance = Math.abs(knobPositions[knob] - 50);
    if (distance <= KNOB_TOLERANCE) return '#27ae60';
    if (distance <= 25) return '#f39c12';
    return '#e74c3c';
  };

  const getExtrusionPath = () => {
    switch (currentExtrusion) {
      case 'perfect':
        return 'M 10 50 Q 30 48 50 50 Q 70 52 90 50';
      case 'good':
        return 'M 10 50 Q 30 46 50 50 Q 70 54 90 50';
      default:
        return 'M 10 50 L 15 45 L 20 55 L 25 45 L 30 55 L 35 45 L 40 55 L 45 45 L 50 55 L 55 45 L 60 55 L 65 45 L 70 55 L 75 45 L 80 55 L 85 45 L 90 50';
    }
  };

  return (
    <div className="printer-panic">
      <div className="printer-container">
        <motion.div
          className="printer-bed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bed-header">
            <h3>3D Printer Bed</h3>
            <div className="bed-grid">
              <div className="grid-line" />
              <div className="grid-line" />
              <div className="grid-line" />
            </div>
          </div>

          <div className="bed-surface">
            {/* Leveling knobs */}
            <div className="knob-container knob-front">
              <div 
                className="knob"
                style={{ 
                  backgroundColor: getKnobColor('front'),
                  transform: `rotate(${knobPositions.front * 3.6}deg)` 
                }}
              >
                <div className="knob-indicator" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={knobPositions.front}
                onChange={(e) => handleKnobChange('front', parseInt(e.target.value))}
                className="knob-slider"
              />
              <label>Front</label>
            </div>

            <div className="knob-container knob-left">
              <div 
                className="knob"
                style={{ 
                  backgroundColor: getKnobColor('left'),
                  transform: `rotate(${knobPositions.left * 3.6}deg)` 
                }}
              >
                <div className="knob-indicator" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={knobPositions.left}
                onChange={(e) => handleKnobChange('left', parseInt(e.target.value))}
                className="knob-slider"
              />
              <label>Left</label>
            </div>

            <div className="knob-container knob-right">
              <div 
                className="knob"
                style={{ 
                  backgroundColor: getKnobColor('right'),
                  transform: `rotate(${knobPositions.right * 3.6}deg)` 
                }}
              >
                <div className="knob-indicator" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={knobPositions.right}
                onChange={(e) => handleKnobChange('right', parseInt(e.target.value))}
                className="knob-slider"
              />
              <label>Right</label>
            </div>

            {/* Nozzle and extrusion preview */}
            <div className="nozzle-area">
              <div className="nozzle">
                <div className="nozzle-tip" />
              </div>
              
              <svg className="extrusion-preview" viewBox="0 0 100 100">
                <path
                  d={getExtrusionPath()}
                  stroke={currentExtrusion === 'perfect' ? '#27ae60' : 
                         currentExtrusion === 'good' ? '#f39c12' : '#e74c3c'}
                  strokeWidth="3"
                  fill="none"
                  className={`extrusion-line extrusion-${currentExtrusion}`}
                />
              </svg>
              
              <div className="extrusion-quality">
                Quality: <span className={`quality-${currentExtrusion}`}>
                  {currentExtrusion === 'perfect' ? 'Perfect!' : 
                   currentExtrusion === 'good' ? 'Good' : 'Poor'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Temperature controls */}
        <motion.div
          className="temperature-control"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="temp-header">
            <h4>🌡️ Nozzle Temperature</h4>
          </div>
          
          <div className="temp-display">
            <span className="temp-value">{temperature}°C</span>
            <span className={`temp-status ${
              temperature >= TARGET_TEMP_MIN && temperature <= TARGET_TEMP_MAX 
                ? 'optimal' : 'suboptimal'
            }`}>
              {temperature >= TARGET_TEMP_MIN && temperature <= TARGET_TEMP_MAX 
                ? 'Optimal' : 'Adjust needed'}
            </span>
          </div>
          
          <input
            type="range"
            min="180"
            max="220"
            value={temperature}
            onChange={(e) => handleTemperatureChange(parseInt(e.target.value))}
            className="temp-slider"
          />
          
          <div className="temp-labels">
            <span>180°C</span>
            <span>200°C</span>
            <span>220°C</span>
          </div>
        </motion.div>
      </div>

      {/* Success animation */}
      <AnimatePresence>
        {isPrinting && (
          <motion.div
            className="printing-animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="printing-progress">
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5 }}
                />
              </div>
              <p>Printing first layer... Perfect adhesion! 🎉</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint system */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="hint-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p>💡 Adjust the corner knobs to level the bed and set temperature around 200°C</p>
            <Button onClick={handleHint} variant="secondary">
              Got it!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-content"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2>🎉 Perfect First Layer!</h2>
              <p>I don't know, it just <i>looks</i> like a good first layer.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};