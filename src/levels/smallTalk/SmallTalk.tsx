import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleResult } from '../../types';
import { Button } from '../../components/ui';
import './SmallTalk.css';

interface SmallTalkProps {
  onComplete: (result: PuzzleResult) => void;
  timeElapsed: number;
}

interface DialogueChoice {
  id: string;
  text: string;
  type: 'literal' | 'context-seeking' | 'topic-shift';
  moodEffect: number; // -2 to +2
  authenticity?: boolean; // true if this is an authentic response
}

interface DialogueExchange {
  id: number;
  prompt: string;
  choices: DialogueChoice[];
}

const DIALOGUE_EXCHANGES: DialogueExchange[] = [
  {
    id: 1,
    prompt: "Crazy weather, huh?",
    choices: [
      {
        id: "literal",
        text: "Barometric pressure dropped 12mb in 2 hours.",
        type: "literal",
        moodEffect: -1,
        authenticity: true
      },
      {
        id: "light",
        text: "Yeah, wild. Did it mess with your day?",
        type: "context-seeking",
        moodEffect: 1
      },
      {
        id: "shift",
        text: "I was modeling airflow patterns actually.",
        type: "topic-shift",
        moodEffect: 0,
        authenticity: true
      }
    ]
  },
  {
    id: 2,
    prompt: "How's your weekend going?",
    choices: [
      {
        id: "detailed",
        text: "Did a stress-test on my home server, almost accidentally directed it to my AWS instance.",
        type: "literal",
        moodEffect: -1,
        authenticity: true
      },
      {
        id: "reciprocal",
        text: "Pretty good! What about you?",
        type: "context-seeking",
        moodEffect: 1
      },
      {
        id: "project",
        text: "Working on a project. You ever built anything?",
        type: "topic-shift",
        moodEffect: 0
      }
    ]
  },
  {
    id: 3,
    prompt: "The coffee machine is acting up again...",
    choices: [
      {
        id: "technical",
        text: "Probably mineral buildup in the heating element. I could look at it.",
        type: "literal",
        moodEffect: 0,
        authenticity: true
      },
      {
        id: "empathy",
        text: "That's frustrating! Is there somewhere else to get coffee nearby?",
        type: "context-seeking",
        moodEffect: 1
      },
      {
        id: "avoid",
        text: "I usually bring tea anyway.",
        type: "topic-shift",
        moodEffect: -1
      }
    ]
  },
  {
    id: 4,
    prompt: "Any plans for lunch?",
    choices: [
      {
        id: "schedule",
        text: "I eat at 12:37 to avoid the rush. Same sandwich, optimal timing.",
        type: "literal",
        moodEffect: -1,
        authenticity: true
      },
      {
        id: "social",
        text: "Not sure yet. Want to grab something together?",
        type: "context-seeking",
        moodEffect: 2
      },
      {
        id: "deflect",
        text: "I should probably get back to work soon.",
        type: "topic-shift",
        moodEffect: -1
      }
    ]
  }
];

export const SmallTalk: React.FC<SmallTalkProps> = ({ onComplete, timeElapsed }) => {
  const [currentExchange, setCurrentExchange] = useState(0);
  const [mood, setMood] = useState(0); // -4 to +4 scale
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{prompt: string, choice: DialogueChoice}>>([]);
  const [authenticChoices, setAuthenticChoices] = useState(0);

  // Show hint after 30 seconds
  useEffect(() => {
    if (timeElapsed >= 30 && !isComplete && !showHint && currentExchange < DIALOGUE_EXCHANGES.length) {
      setShowHint(true);
    }
  }, [timeElapsed, isComplete, showHint, currentExchange]);

  const handleChoice = (choice: DialogueChoice) => {
    const exchange = DIALOGUE_EXCHANGES[currentExchange];
    
    // Update conversation history
    setConversationHistory(prev => [...prev, { prompt: exchange.prompt, choice }]);
    
    // Update mood
    setMood(prev => Math.max(-4, Math.min(4, prev + choice.moodEffect)));
    
    // Track authentic choices
    if (choice.authenticity) {
      setAuthenticChoices(prev => prev + 1);
    }
    
    // Increment attempts
    setAttempts(prev => prev + 1);
    setShowHint(false);

    // Check if mood dropped too low (failure condition)
    const newMood = Math.max(-4, Math.min(4, mood + choice.moodEffect));
    if (newMood <= -3) {
      // Conversation derailed
      setIsComplete(true);
      const result: PuzzleResult = {
        stars: 0,
        pcDelta: -8,
        ssDelta: -4,
        timeElapsed,
        attempts,
        hintsUsed,
      };
      setTimeout(() => onComplete(result), 2000);
      return;
    }

    // Move to next exchange or complete
    if (currentExchange < DIALOGUE_EXCHANGES.length - 1) {
      setTimeout(() => setCurrentExchange(prev => prev + 1), 1500);
    } else {
      // Conversation completed successfully
      setIsComplete(true);
      const stars = calculateStars();
      const deltas = getScoreDeltas(stars);
      const result: PuzzleResult = {
        stars,
        pcDelta: deltas.pc,
        ssDelta: deltas.ss,
        timeElapsed,
        attempts,
        hintsUsed,
      };
      setTimeout(() => onComplete(result), 2000);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(false);
  };

  const calculateStars = (): 0 | 1 | 2 | 3 => {
    let stars = 3;
    
    if (timeElapsed > 60) stars -= 1;
    if (timeElapsed > 90) stars -= 1;
    if (attempts > 6) stars -= 1; // More than 1.5 attempts per exchange
    if (hintsUsed > 0) stars -= 1;
    if (mood < 0) stars -= 1; // Ended with negative mood
    
    return Math.max(0, stars) as 0 | 1 | 2 | 3;
  };

  const getScoreDeltas = (stars: number) => {
    const baseDeltas: Record<number, { pc: number; ss: number }> = {
      3: { pc: 5, ss: 15 },
      2: { pc: 3, ss: 10 },
      1: { pc: 2, ss: 6 },
      0: { pc: -8, ss: -4 }
    };
    
    let deltas = baseDeltas[stars] || baseDeltas[0];
    
    // Authenticity bonus/penalty
    if (authenticChoices >= 2) {
      deltas = {
        pc: deltas.pc + 8,
        ss: deltas.ss - 6
      };
    }
    
    return deltas;
  };

  const getMoodEmoji = () => {
    if (mood >= 2) return '😊';
    if (mood >= 0) return '😐';
    if (mood >= -2) return '😕';
    return '😠';
  };

  const getMoodText = () => {
    if (mood >= 2) return 'Pleased';
    if (mood >= 0) return 'Neutral';
    if (mood >= -2) return 'Awkward';
    return 'Annoyed';
  };

  if (isComplete) {
    const success = mood >= 0;
    return (
      <div className="small-talk">
        <motion.div
          className="conversation-result"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`result-content ${success ? 'success' : 'failure'}`}>
            <h2>{success ? '✅ Conversation Complete' : '❌ Conversation Derailed'}</h2>
            <div className="final-mood">
              <span className="mood-emoji">{getMoodEmoji()}</span>
              <span>Final mood: {getMoodText()}</span>
            </div>
            <div className="reflection">
              <p><em>"I answer the question asked, not the question meant."</em></p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const exchange = DIALOGUE_EXCHANGES[currentExchange];

  return (
    <div className="small-talk">
      <div className="conversation-container">
        <motion.div
          className="conversation-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="partner-info">
            <div className="avatar">👤</div>
            <div className="mood-indicator">
              <span className="mood-emoji">{getMoodEmoji()}</span>
              <span className="mood-text">{getMoodText()}</span>
            </div>
          </div>
          <div className="progress-indicator">
            Exchange {currentExchange + 1} / {DIALOGUE_EXCHANGES.length}
          </div>
        </motion.div>

        <div className="conversation-area">
          {/* Conversation history */}
          <div className="conversation-history">
            {conversationHistory.map((item, index) => (
              <div key={index} className="exchange-history">
                <div className="message message-them">
                  <div className="message-bubble">{item.prompt}</div>
                </div>
                <div className="message message-you">
                  <div className={`message-bubble ${item.choice.authenticity ? 'authentic' : ''}`}>
                    {item.choice.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current exchange */}
          <div className="current-exchange">
            <motion.div
              className="message message-them"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={`prompt-${currentExchange}`}
            >
              <div className="message-bubble">{exchange.prompt}</div>
            </motion.div>

            <motion.div
              className="choices-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="choices-prompt">Choose your response:</div>
              <div className="choices">
                {exchange.choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    className={`choice-button ${choice.authenticity ? 'authentic-choice' : ''}`}
                    onClick={() => handleChoice(choice)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="choice-text">{choice.text}</div>
                    {choice.authenticity && (
                      <div className="authenticity-badge">Authentic</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hint system */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              className="hint-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p>💡 Your gut says: keep it light and show interest in them</p>
              <Button onClick={handleHint} variant="secondary">
                Got it!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};