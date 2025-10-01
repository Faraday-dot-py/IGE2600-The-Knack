import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PuzzleResult } from '../../types';
import { Button } from '../../components/ui';
import './ShowAndTell.css';

interface ShowAndTellProps {
  onComplete: (result: PuzzleResult) => void;
  timeElapsed: number;
}

type ChoiceType = 'achievement-heavy' | 'process-focused' | 'self-erase' | 'people-pleaser';

interface DialogueChoice {
  id: string;
  text: string;
  type: ChoiceType;
  /** Social Standing effect (may be 0 on best choices) */
  ssEffect: number;
  /** Personal Contentment effect */
  pcEffect: number;
  /** Marks the “best” responses that raise PC but leave SS unchanged */
  best?: boolean;
  /** Optional flavor tag shown in history */
  description?: string;
  /** Next dialogue node id to branch to */
  nextId?: string;
}

interface DialogueExchange {
  id: string;
  prompt: string;
  context?: string;
  choices: DialogueChoice[];
}

/** Dialogue graph: branches adapt to earlier choices. */
const DIALOGUE: Record<string, DialogueExchange> = {
  start: {
    id: 'start',
    prompt: "What've you been working on lately?",
    context: 'A colleague notices you’ve been busy and asks about your projects.',
    choices: [
      {
        id: 'showcase',
        text: 'I built a hand that can pick up a grape without crushing it.',
        type: 'achievement-heavy',
        ssEffect: -2,
        pcEffect: 1,
        description: 'Leads with the impressive result',
        nextId: 'impressedDistant',
      },
      {
        id: 'processInvite',
        text: 'I got stuck on tendon routing for weeks, learned a neat trick from biomechanics—want to see?',
        type: 'process-focused',
        ssEffect: 0, // best: PC only
        pcEffect: 3,
        best: true,
        description: 'Shares journey + invites them in',
        nextId: 'curiousEngaged',
      },
      {
        id: 'deflect',
        text: 'Nothing special, just tinkering.',
        type: 'self-erase',
        ssEffect: -1,
        pcEffect: -2,
        description: 'Downplays and closes the door',
        nextId: 'awkwardChange',
      },
    ],
  },

  curiousEngaged: {
    id: 'curiousEngaged',
    prompt: 'Wow, how did you even start something like that?',
    context: 'They’re sincerely curious, leaning in.',
    choices: [
      {
        id: 'relatableStart',
        text: 'Honestly? I kept dropping things. I started with just one finger.',
        type: 'process-focused',
        ssEffect: 0, // best: PC only
        pcEffect: 2,
        best: true,
        description: 'Relatable detail; keeps them engaged',
        nextId: 'plansEngaged',
      },
      {
        id: 'technicalDive',
        text: 'I analyzed grip force distributions and modeled tendon mechanics in CAD…',
        type: 'achievement-heavy',
        ssEffect: -1,
        pcEffect: 2, // authentic tech detail feels good to you
        description: 'Accurate but risks overwhelming them',
        nextId: 'plansTech',
      },
      {
        id: 'dismissComplexity',
        text: 'It’s not that complex once you break it down.',
        type: 'self-erase',
        ssEffect: -1,
        pcEffect: -1,
        description: 'Minimizes your effort',
        nextId: 'awkwardChange',
      },
    ],
  },

  impressedDistant: {
    id: 'impressedDistant',
    prompt: "That's really complex! How did you even start?",
    context: 'They’re impressed but a bit intimidated—distance forming.',
    choices: [
      {
        id: 'humanReframe',
        text: 'I started tiny—one joint at a time. The tricky bit was routing the string cleanly.',
        type: 'process-focused',
        ssEffect: 0, // best: PC only
        pcEffect: 2,
        best: true,
        description: 'Reframes in approachable terms',
        nextId: 'plansEngaged',
      },
      {
        id: 'deepTech',
        text: 'I ran FEA on tendon paths and tuned compliance—happy to show the graphs.',
        type: 'achievement-heavy',
        ssEffect: -1,
        pcEffect: 2,
        description: 'Authentic tech joy; may alienate',
        nextId: 'plansTech',
      },
      {
        id: 'minimize',
        text: 'Eh, it’s nothing, really.',
        type: 'self-erase',
        ssEffect: -1,
        pcEffect: -2,
        description: 'Shuts the door on connection',
        nextId: 'awkwardChange',
      },
    ],
  },

  awkwardChange: {
    id: 'awkwardChange',
    prompt: 'Oh, cool. Anyway…',
    context: 'They start drifting away from the topic.',
    choices: [
      {
        id: 'inviteThem',
        text: 'What kind of things do you like to build or fix?',
        type: 'people-pleaser',
        ssEffect: 2, // pleases them socially
        pcEffect: -1, // costs you (masking/deflection)
        description: 'Shifts focus to keep peace',
        nextId: 'plansEngaged',
      },
      {
        id: 'stayAuthenticSmall',
        text: 'No worries—I can show you the simple version later if you want.',
        type: 'process-focused',
        ssEffect: 0, // best: PC only
        pcEffect: 1,
        best: true,
        description: 'Keeps door open without self-erasing',
        nextId: 'plansEngaged',
      },
      {
        id: 'bowOut',
        text: 'Yeah, let’s talk about something else.',
        type: 'self-erase',
        ssEffect: 0,
        pcEffect: -2,
        description: 'Drops the thread entirely',
        nextId: 'end',
      },
    ],
  },

  plansEngaged: {
    id: 'plansEngaged',
    prompt: 'Are you planning to do anything with it? Like sell it or something?',
    context: 'They’re trying to understand your motivation.',
    choices: [
      {
        id: 'learningFun',
        text: 'Maybe later. Right now I’m learning and having fun.',
        type: 'process-focused',
        ssEffect: 0, // best: PC only
        pcEffect: 2,
        best: true,
        description: 'Intrinsic motivation',
        nextId: 'end',
      },
      {
        id: 'bigAmbition',
        text: 'I might patent part of it and explore a small product.',
        type: 'achievement-heavy',
        ssEffect: -1,
        pcEffect: 2, // authentic excitement
        description: 'Ambition risks being read as bragging',
        nextId: 'end',
      },
      {
        id: 'justHobby',
        text: 'Nah, just a hobby. Nothing serious.',
        type: 'self-erase',
        ssEffect: 0,
        pcEffect: -3,
        description: 'Diminishes your passion',
        nextId: 'end',
      },
    ],
  },

  plansTech: {
    id: 'plansTech',
    prompt: 'So… what’s the endgame for this?',
    context: 'They sound cautious after the tech dive.',
    choices: [
      {
        id: 'shareWhy',
        text: 'It helps me think. Building it was the point.',
        type: 'process-focused',
        ssEffect: 0, // best: PC only
        pcEffect: 2,
        best: true,
        description: 'Purpose > prestige',
        nextId: 'end',
      },
      {
        id: 'sellIt',
        text: 'Maybe turn it into a product if the prototype holds up.',
        type: 'achievement-heavy',
        ssEffect: -1,
        pcEffect: 2,
        description: 'Ambition with a caveat',
        nextId: 'end',
      },
      {
        id: 'downplay',
        text: 'It’s probably not useful anyway.',
        type: 'self-erase',
        ssEffect: 0,
        pcEffect: -2,
        description: 'Self-sabotaging',
        nextId: 'end',
      },
    ],
  },

  end: {
    id: 'end',
    prompt: '',
    choices: [],
  },
};

export const ShowAndTell: React.FC<ShowAndTellProps> = ({ onComplete, timeElapsed }) => {
  const [currentId, setCurrentId] = useState<string>('start');
  const [partnerReaction, setPartnerReaction] = useState(0); // -5 .. +5
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; choice: DialogueChoice }>>([]);
  const [pcTotal, setPcTotal] = useState(0);
  const [ssTotal, setSsTotal] = useState(0);
  const [bestPicks, setBestPicks] = useState(0);
  const [sharedSubstance, setSharedSubstance] = useState(false); // did they actually share something meaningful?

  const node = DIALOGUE[currentId];

  // Hint appears after 25s if still talking
  useEffect(() => {
    if (timeElapsed >= 25 && currentId !== 'end' && !showHint) {
      setShowHint(true);
    }
  }, [timeElapsed, currentId, showHint]);

  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

  const handleChoice = (choice: DialogueChoice) => {
    if (!node) return;

    // Record history
    setHistory((prev) => [...prev, { prompt: node.prompt, choice }]);

    // Update reaction and totals
    setPartnerReaction((prev) => clamp(prev + choice.ssEffect, -5, 5));
    setPcTotal((prev) => prev + choice.pcEffect);
    setSsTotal((prev) => prev + choice.ssEffect);

    // Track “best” picks and substance sharing
    if (choice.best) setBestPicks((p) => p + 1);
    if (choice.type === 'process-focused' || choice.type === 'people-pleaser' || choice.type === 'achievement-heavy') {
      setSharedSubstance(true);
    }

    setAttempts((a) => a + 1);
    setShowHint(false);

    // Severe misread → early end
    const newReaction = clamp(partnerReaction + choice.ssEffect, -5, 5);
    if (newReaction <= -4) {
      finishConversation(0);
      return;
    }

    // Advance
    const nextId = choice.nextId ?? 'end';
    if (!nextId || nextId === 'end') {
      finishConversation();
    } else {
      // slight pause for animation feel
      setTimeout(() => setCurrentId(nextId), 600);
    }
  };

  const finishConversation = (forcedStars?: 0 | 1 | 2 | 3) => {
    // Stars: feedback only (not the meter math)
    const stars = typeof forcedStars === 'number' ? forcedStars : calculateStars();
    const deltas = getScoreDeltas(); // derived solely from choices to respect PC-only best rule

    const result: PuzzleResult = {
      stars,
      pcDelta: deltas.pc,
      ssDelta: deltas.ss,
      timeElapsed,
      attempts,
      hintsUsed,
    };

    // brief result reveal
    setCurrentId('end');
    setTimeout(() => onComplete(result), 900);
  };

  const handleHint = () => {
    setHintsUsed((h) => h + 1);
    setShowHint(false);
  };

  /** Stars are for UI satisfaction, not meter deltas */
  const calculateStars = (): 0 | 1 | 2 | 3 => {
    let s = 3;
    if (timeElapsed > 60) s -= 1;
    if (timeElapsed > 90) s -= 1;
    if (attempts > 6) s -= 1;
    if (hintsUsed > 0) s -= 1;
    if (partnerReaction < 0) s -= 1;
    if (!sharedSubstance) s -= 1;
    return clamp(s, 0, 3) as 0 | 1 | 2 | 3;
  };

  /**
   * Meter deltas:
   * - Sum of choice effects.
   * - Best-path ribbon: picking ≥2 “best” choices grants small extra PC (+3) with **no SS change**.
   * - Soft guardrail: if PC gained a lot, do not let SS climb in the same scene (already mostly ensured by choice design).
   */
  const getScoreDeltas = () => {
    let pc = pcTotal;
    let ss = ssTotal;

    if (bestPicks >= 2) {
      pc += 3; // reward sustained authenticity
      // ss unchanged by design
    }

    // Final guardrail to avoid SS+PC both being high from odd paths:
    // If PC ended significantly positive (≥5), cap SS gain at max(0, ss) = 0.
    if (pc >= 5 && ss > 0) {
      ss = 0;
    }

    return { pc, ss };
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
    return "Thinks you're bragging";
  };

  const isComplete = currentId === 'end';

  if (isComplete) {
    const success = partnerReaction >= 0 && sharedSubstance;
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
                !sharedSubstance ? '😔 Missed the Opportunity' :
                '😐 Mixed Results'}
            </h2>
            <div className="final-reaction">
              <span className="reaction-emoji">{getReactionEmoji()}</span>
              <span>Their reaction: {getReactionText()}</span>
            </div>
            {sharedSubstance && (
              <div className="project-status">✅ You shared your project and process</div>
            )}
            <div className="reflection">
              <p><em>"Sharing joy reads different depending on who’s listening."</em></p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const exchange = node;

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
            <div className="avatar">👤</div>
            <div className="reaction-indicator">
              <span className="reaction-emoji">{getReactionEmoji()}</span>
              <span className="reaction-text">{getReactionText()}</span>
            </div>
          </div>
        </motion.div>

        <div className="conversation-area">
          <div className="context-display">
            <p>{exchange?.context}</p>
          </div>

          {/* Conversation history */}
          <div className="conversation-history">
            {history.map((item, idx) => (
              <div key={idx} className="exchange-history">
                <div className="message message-them">
                  <div className="message-bubble">{item.prompt}</div>
                </div>
                <div className="message message-you">
                  <div className={`message-bubble ${item.choice.best ? 'authentic' : ''}`}>
                    {item.choice.text}
                  </div>
                  {item.choice.description && (
                    <div className="choice-effect">{item.choice.description}</div>
                  )}
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
              key={`prompt-${exchange?.id}`}
            >
              <div className="message-bubble">{exchange?.prompt}</div>
            </motion.div>

            <motion.div
              className="choices-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="choices-prompt">How do you respond?</div>
              <div className="choices">
                {exchange?.choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    className={`choice-button ${choice.type} ${choice.best ? 'authentic-choice' : ''}`}
                    onClick={() => handleChoice(choice)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="choice-text">{choice.text}</div>
                    {choice.description && (
                      <div className="choice-description">{choice.description}</div>
                    )}
                    {choice.best && (
                      <div className="authenticity-badge">Authentic (PC ↑, SS —)</div>
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
              <p>💡 Share the journey and what it means to you. Keep it approachable. Asking a sincere question back often helps.</p>
              <Button onClick={handleHint} variant="secondary">Got it!</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
