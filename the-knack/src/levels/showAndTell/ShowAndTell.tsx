import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleResult } from '../../types';
import { Button } from '../../components/ui';
import './ShowAndTell.css';

interface ShowAndTellProps {
  onComplete: (result: PuzzleResult) => void;
  timeElapsed: number;
}

interface DialogueChoice {
  id: string;
  text: string;
  type: 'achievement-heavy' | 'process-focused' | 'self-erase';
  ssEffect: number; // Social Standing effect
  pcEffect: number; // Personal Contentment effect
  authenticity?: boolean;
  description?: string; // What this choice represents
}

interface DialogueExchange {
  id: number;
  prompt: string;
  choices: DialogueChoice[];
  context?: string; // Additional context about the situation
}

const DIALOGUE_EXCHANGES: DialogueExchange[] = [
  {
    id: 1,
    prompt: "What've you been working on lately?",
    context: "A colleague notices you've been busy and asks about your projects",
    choices: [
      {
        id: "showcase",
        text: "I built a robotic hand that can pick up a grape without crushing it. Watch this!",
        type: "achievement-heavy",
        ssEffect: -2,
        pcEffect: 1,
        description: "Leading with the impressive result"
      },
      {
        id: "process",
        text: "I got stuck on tendon routing for weeks, then learned this neat trick from biomechanics. Want to see?",
        type: "process-focused",
        ssEffect: 2,
        pcEffect: 2,
        description: "Sharing the journey and inviting engagement"
      },
      {
        id: "deflect",
        text: "Nothing special, just tinkering with some stuff.",
        type: "self-erase",
        ssEffect: 0,
        pcEffect: -2,
        description: "Downplaying your work"
      }
    ]
  },
  {
    id: 2,
    prompt: "Wow, that's really complex! How did you even start something like that?",
    context: "They seem genuinely interested but maybe intimidated",
    choices: [
      {
        id: "technical",
        text: "First I analyzed grip force distributions, then modeled the tendon mechanics in CAD...",
        type: "achievement-heavy",
        ssEffect: -1,
        pcEffect: 0,
        authenticity: true,
        description: "Technical deep-dive (authentic but overwhelming)"
      },
      {
        id: "relatable",
        text: "Honestly? I kept dropping things and got frustrated. Started small with just one finger.",
        type: "process-focused",
        ssEffect: 1,
        pcEffect: 1,
        description: "Making it relatable and human"
      },
      {
        id: "dismiss",
        text: "Oh, it's not that complex once you break it down.",
        type: "self-erase",
        ssEffect: -1,
        pcEffect: -1,
        description: "Minimizing the achievement"
      }
    ]
  },
  {
    id: 3,
    prompt: "That's so cool! I could never do anything like that.",
    context: "They're expressing admiration but also creating distance",
    choices: [
      {
        id: "superior",
        text: "It just takes the right mindset and understanding the physics involved.",
        type: "achievement-heavy",
        ssEffect: -3,
        pcEffect: -1,
        description: "Implying they lack the 'right mindset'"
      },
      {
        id: "encouraging",
        text: "I bet you could! What kind of things do you like to build or fix?",
        type: "process-focused",
        ssEffect: 2,
        pcEffect: 1,
        description: "Turning focus to their interests"
      },
      {
        id: "agree",
        text: "Yeah, it's probably not for everyone.",
        type: "self-erase",
        ssEffect: -2,
        pcEffect: -2,
        authenticity: true,
        description: "Accidentally reinforcing their self-doubt"
      }
    ]
  },
  {
    id: 4,
    prompt: "Are you planning to do anything with it? Like sell it or something?",
    context: "They're trying to understand your motivation",
    choices: [
      {
        id: "ambitious",
        text: "I'm thinking of patenting the grip algorithm and starting a robotics company.",
        type: "achievement-heavy",
        ssEffect: -1,
        pcEffect: 1,
        authenticity: true,
        description: "Sharing big ambitions (authentic excitement)"
      },
      {
        id: "learning",
        text: "Maybe someday, but right now I'm just learning and having fun with it.",
        type: "process-focused",
        ssEffect: 1,
        pcEffect: 2,
        description: "Focusing on intrinsic motivation"
      },
      {
        id: "hobby",
        text: "Nah, it's just a hobby thing. Nothing serious.",
        type: "self-erase",
        ssEffect: 0,
        pcEffect: -3,
        description: "Diminishing your passion"
      }
    ]
  }
];

export const ShowAndTell: React.FC<ShowAndTellProps> = ({ onComplete, timeElapsed }) => {
  const [currentExchange, setCurrentExchange] = useState(0);
  const [partnerReaction, setPartnerReaction] = useState(0); // -5 to +5 scale
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{prompt: string, choice: DialogueChoice}>>([]);
  const [authenticChoices, setAuthenticChoices] = useState(0);
  const [totalPCEffect, setTotalPCEffect] = useState(0);
  const [totalSSEffect, setTotalSSEffect] = useState(0);
  const [projectShown, setProjectShown] = useState(false);

  // Show hint after 25 seconds
  useEffect(() => {
    if (timeElapsed >= 25 && !isComplete && !showHint && currentExchange < DIALOGUE_EXCHANGES.length) {
      setShowHint(true);
    }
  }, [timeElapsed, isComplete, showHint, currentExchange]);

  const handleChoice = (choice: DialogueChoice) => {
    const exchange = DIALOGUE_EXCHANGES[currentExchange];
    
    // Update conversation history
    setConversationHistory(prev => [...prev, { prompt: exchange.prompt, choice }]);
    
    // Update reaction and effects
    setPartnerReaction(prev => Math.max(-5, Math.min(5, prev + choice.ssEffect)));
    setTotalPCEffect(prev => prev + choice.pcEffect);
    setTotalSSEffect(prev => prev + choice.ssEffect);
    
    // Track authentic choices
    if (choice.authenticity) {
      setAuthenticChoices(prev => prev + 1);
    }

    // Track if we've shown the project (process-focused choices in first exchange)
    if (currentExchange === 0 && choice.type === 'process-focused') {
      setProjectShown(true);
    }
    
    // Increment attempts
    setAttempts(prev => prev + 1);
    setShowHint(false);

    // Check if reaction dropped too low (severe failure)
    const newReaction = Math.max(-5, Math.min(5, partnerReaction + choice.ssEffect));
    if (newReaction <= -4) {
      // You've been perceived as bragging/showing off
      setIsComplete(true);
      const result: PuzzleResult = {
        stars: 0,
        pcDelta: -8,
        ssDelta: -8,
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
    if (attempts > 6) stars -= 1;
    if (hintsUsed > 0) stars -= 1;
    if (partnerReaction < 0) stars -= 1; // Ended with negative reaction
    if (!projectShown) stars -= 1; // Failed to actually share the project
    
    return Math.max(0, stars) as 0 | 1 | 2 | 3;
  };

  const getScoreDeltas = (stars: number) => {
    const baseDeltas: Record<number, { pc: number; ss: number }> = {
      3: { pc: 5, ss: 15 },
      2: { pc: 3, ss: 10 },
      1: { pc: 2, ss: 6 },
      0: { pc: -8, ss: -8 }
    };
    
    let deltas = baseDeltas[stars] || baseDeltas[0];
    
    // Add accumulated effects from choices
    deltas.pc += totalPCEffect;
    deltas.ss += totalSSEffect;
    
    // Authenticity bonus/penalty (for being genuinely excited about your work)
    if (authenticChoices >= 1) {
      deltas = {
        pc: deltas.pc + 8,
        ss: deltas.ss - 6
      };
    }
    
    return deltas;
  };

  const getReactionEmoji = () => {
    if (partnerReaction >= 3) return '😊';
    if (partnerReaction >= 1) return '🙂';
    if (partnerReaction >= -1) return '😐';
    if (partnerReaction >= -3) return '😕';
    return '🙄';
  };

  const getReactionText = () => {
    if (partnerReaction >= 3) return 'Engaged & Inspired';
    if (partnerReaction >= 1) return 'Interested';
    if (partnerReaction >= -1) return 'Polite';
    if (partnerReaction >= -3) return 'Uncomfortable';
    return 'Thinks You\'re Bragging';
  };

  if (isComplete) {
    const success = partnerReaction >= 0 && projectShown;
    return (
      <div className="show-and-tell">
        <motion.div
          className="conversation-result"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`result-content ${success ? 'success' : 'failure'}`}>
            <h2>
              {success ? '✅ Shared Successfully' : 
               partnerReaction <= -4 ? '😬 Came Off as Bragging' : 
               !projectShown ? '😔 Missed the Opportunity' : 
               '😐 Mixed Results'}
            </h2>
            <div className="final-reaction">
              <span className="reaction-emoji">{getReactionEmoji()}</span>
              <span>Their reaction: {getReactionText()}</span>
            </div>
            {projectShown && (
              <div className="project-status">
                ✅ You shared your project and process
              </div>
            )}
            <div className="reflection">
              <p><em>"Sharing joy reads different depending on who's listening."</em></p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const exchange = DIALOGUE_EXCHANGES[currentExchange];

  return (
    <div className="show-and-tell">
      <div className="conversation-container">
        <motion.div
          className="conversation-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="scene-setting">
            <div className="setting-icon">🔧</div>
            <div className="setting-text">
              <h4>Demo Night Prep</h4>
              <p>Casual conversation before the event</p>
            </div>
          </div>
          <div className="partner-info">
            <div className="avatar">👨‍💼</div>
            <div className="reaction-indicator">
              <span className="reaction-emoji">{getReactionEmoji()}</span>
              <span className="reaction-text">{getReactionText()}</span>
            </div>
          </div>
        </motion.div>

        <div className="conversation-area">
          {/* Context display */}
          <div className="context-display">
            <p>{exchange.context}</p>
          </div>

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
                  <div className="choice-effect">
                    {item.choice.description}
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
              <div className="choices-prompt">How do you respond?</div>
              <div className="choices">
                {exchange.choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    className={`choice-button ${choice.type} ${choice.authenticity ? 'authentic-choice' : ''}`}
                    onClick={() => handleChoice(choice)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="choice-text">{choice.text}</div>
                    <div className="choice-description">{choice.description}</div>
                    {choice.authenticity && (
                      <div className="authenticity-badge">Genuine Excitement</div>
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
              <p>💡 Share the journey and struggles, not just the results. Ask about their interests too.</p>
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
