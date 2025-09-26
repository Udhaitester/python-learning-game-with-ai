
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        Pranam, young Yodha!
      </h2>
      <p className="text-lg text-gray-300 mb-8">
        Welcome to your training ground. You have been chosen to embark on a great quest: to master the art of Python.
        Your guide on this journey will be a wise AI Guru, who will teach you to wield the power of code.
        Each mission will bring a new story, a new teaching, and a test of your skills. Are you ready to begin your training?
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
      >
        Begin my Journey
      </button>
    </div>
  );
};

export default WelcomeScreen;