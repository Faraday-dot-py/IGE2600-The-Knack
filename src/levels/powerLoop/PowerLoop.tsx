import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleResult } from '../../types';
import { Button } from '../../components/ui';
import './PowerLoop.css';

interface Component {
  id: string;
  type: 'battery' | 'switch' | 'motor';
  name: string;
  icon: string;
  rotation: number;
}

interface SlotProps {
  id: string;
  component: Component | null;
  onDrop: (component: Component) => void;
  onRotate: (componentId: string) => void;
  label: string;
  polaritySign?: '+' | '-';
}

interface DraggableComponentProps {
  component: Component;
  onRotate: (componentId: string) => void;
  disabled?: boolean;
}

interface PowerLoopProps {
  onComplete: (result: PuzzleResult) => void;
  timeElapsed: number;
}

const COMPONENTS: Component[] = [
  { id: 'battery', type: 'battery', name: 'Battery', icon: '🔋', rotation: 0 },
  { id: 'switch', type: 'switch', name: 'Switch', icon: '🔘', rotation: 0 },
  { id: 'motor', type: 'motor', name: 'Motor+Fan', icon: '🌀', rotation: 0 },
];

const DraggableComponent: React.FC<DraggableComponentProps> = ({ 
  component, 
  onRotate, 
  disabled = false 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: component,
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [component, disabled]);

  return (
    <div
      ref={drag as any}
      className={`draggable-component ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onRotate(component.id)}
    >
      <div 
        className="component-icon"
        style={{ transform: `rotate(${component.rotation}deg)` }}
      >
        {component.icon}
      </div>
      <div className="component-name">{component.name}</div>
      {!disabled && <div className="rotate-hint">Tap to rotate</div>}
    </div>
  );
};

const Slot: React.FC<SlotProps> = ({ 
  component, 
  onDrop, 
  onRotate, 
  label, 
  polaritySign 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: Component) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop]);

  return (
    <div
      ref={drop as any}
      className={`slot ${isOver ? 'slot--hover' : ''} ${component ? 'slot--filled' : ''}`}
    >
      <div className="slot-label">
        <span>{label}</span>
        {polaritySign && <span className="polarity-sign">{polaritySign}</span>}
      </div>
      
      {component && (
        <motion.div
          className="slotted-component"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => onRotate(component.id)}
        >
          <div 
            className="component-icon"
            style={{ transform: `rotate(${component.rotation}deg)` }}
          >
            {component.icon}
          </div>
        </motion.div>
      )}
      
      {!component && (
        <div className="slot-placeholder">
          Drop component here
        </div>
      )}
    </div>
  );
};

export const PowerLoop: React.FC<PowerLoopProps> = ({ onComplete, timeElapsed }) => {
  const [components, setComponents] = useState<Component[]>(COMPONENTS);
  const [slots, setSlots] = useState<Record<string, Component | null>>({
    A: null,
    B: null,
    C: null,
  });
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fanSpinning, setFanSpinning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wirePulse, setWirePulse] = useState(false);

  // Helper function to check circuit with given slots
  const checkCircuitWithSlots = (testSlots: Record<string, Component | null>) => {
    const { A, B, C } = testSlots;
    if (!A || !B || !C) return false;
    
    const isBatteryCorrect = A.type === 'battery' && (A.rotation === 0 || A.rotation === 180);
    const isSwitchCorrect = B.type === 'switch';
    const isMotorCorrect = C.type === 'motor';
    
    return isBatteryCorrect && isSwitchCorrect && isMotorCorrect;
  };

  // Handle component drop
  const handleDrop = (slotId: string) => (component: Component) => {
    // Remove component from other slots first
    const newSlots = { ...slots };
    Object.keys(newSlots).forEach(key => {
      if (newSlots[key]?.id === component.id) {
        newSlots[key] = null;
      }
    });
    
    // Place in new slot
    newSlots[slotId] = component;
    setSlots(newSlots);
    setAttempts(prev => prev + 1);
    
    // Check if circuit is now complete
    const isCorrect = checkCircuitWithSlots(newSlots);
    if (isCorrect) {
      setIsComplete(true);
      setFanSpinning(true);
      setWirePulse(true);
      
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
      
      setTimeout(() => onComplete(result), 2000);
    }
  };

  // Handle component rotation
  const handleRotate = (componentId: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, rotation: (comp.rotation + 90) % 360 }
        : comp
    ));
    
    setSlots(prev => {
      const newSlots = { ...prev };
      Object.keys(newSlots).forEach(key => {
        if (newSlots[key]?.id === componentId) {
          newSlots[key] = { 
            ...newSlots[key]!, 
            rotation: (newSlots[key]!.rotation + 90) % 360 
          };
        }
      });
      return newSlots;
    });
  };

  // Show hint after 20 seconds
  useEffect(() => {
    if (timeElapsed >= 20 && !isComplete && !showHint) {
      setShowHint(true);
    }
  }, [timeElapsed, isComplete, showHint]);

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(false);
    // Briefly highlight correct arrangement
    // This is a simple implementation - in a full game you'd have more sophisticated hints
  };

  const calculateStars = (): 0 | 1 | 2 | 3 => {
    let stars = 3;
    
    if (timeElapsed > 60) stars -= 1;
    if (timeElapsed > 90) stars -= 1;
    if (attempts > 3) stars -= 1;
    if (hintsUsed > 0) stars -= 1;
    
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="power-loop">
        <div className="circuit-area">
          <motion.div 
            className="circuit-board"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="board-header">
              <h3>Circuit Board</h3>
              <div className="flow-arrow">A → B → C</div>
            </div>
            
            <div className="slots-container">
              <Slot
                id="A"
                component={slots.A}
                onDrop={handleDrop('A')}
                onRotate={handleRotate}
                label="A"
                polaritySign="+"
              />
              <Slot
                id="B"
                component={slots.B}
                onDrop={handleDrop('B')}
                onRotate={handleRotate}
                label="B"
              />
              <Slot
                id="C"
                component={slots.C}
                onDrop={handleDrop('C')}
                onRotate={handleRotate}
                label="C"
              />
            </div>
            
            <AnimatePresence>
              {wirePulse && (
                <motion.div
                  className="wire-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="fan-target"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="target-ring">
              <motion.div
                className={`fan-indicator ${fanSpinning ? 'spinning' : ''}`}
                animate={fanSpinning ? { rotate: 360 } : {}}
                transition={fanSpinning ? { 
                  duration: 0.5, 
                  repeat: Infinity, 
                  ease: 'linear' 
                } : {}}
              >
                🌀
              </motion.div>
            </div>
            <div className="target-label">Target: Fan spins here</div>
          </motion.div>
        </div>

        <div className="components-tray">
          <h3>Components</h3>
          <div className="components-grid">
            {components.map(component => (
              <DraggableComponent
                key={component.id}
                component={component}
                onRotate={handleRotate}
                disabled={Object.values(slots).some(slotComp => slotComp?.id === component.id)}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              className="hint-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p>💡 Remember: Battery (+) → Switch → Motor</p>
              <Button onClick={handleHint} variant="secondary">
                Got it!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

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
                <h2>🎉 Circuit Complete!</h2>
                <p>When the path is clear, power flows.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};