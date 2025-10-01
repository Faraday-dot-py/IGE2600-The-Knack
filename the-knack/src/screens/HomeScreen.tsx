import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui';
import './HomeScreen.css';

export const HomeScreen: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);

  const handleStart = () => {
    setScreen('levelSelect');
  };

  return (
    <div className="home-screen">
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="home-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          The Knack
        </motion.h1>
        
        <motion.p
          className="home-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          A 60-second micro-puzzle autoethnography
        </motion.p>
        
        <motion.div
          className="home-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p>
            Navigate mechanical puzzles and social situations while balancing 
            two meters: <strong>Social Standing</strong> and <strong>Personal Contentment</strong>.
          </p>
          <p>
            Experience what it's like to understand machines better than people.
          </p>
        </motion.div>
        
        <motion.div
          className="home-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button onClick={handleStart} variant="primary">
            Start Game
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};