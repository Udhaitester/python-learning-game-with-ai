import { TutorialStep } from "./types";

export const LEVEL_TOPICS: string[] = [
  "Variables & Data Types: The Naming Ceremony",
  "Working with Numbers: The Village Abacus",
  "String Manipulation: Crafting Powerful Phrases",
  "Lists: The Army Formation",
  "Conditional Logic: The Path of Wisdom",
  "For Loops: The Sacred Ritual",
  "Functions: The Celestial Tools",
  "Dictionaries: The Royal Treasury",
];

export const TUTORIAL_STEPS: TutorialStep[] = [
  { // Step 0
    targetId: 'welcome-tutorial',
    text: "Pranam, Yodha! I am your Guru. For your first mission, I will guide your hand and teach you the ways of code.",
    position: 'center',
  },
  { // Step 1
    targetId: 'mission',
    text: "First, read your Mission. This tells you the story and the goal of your task.",
    position: 'right',
  },
  { // Step 2
    targetId: 'teaching',
    text: "Next, read the Teaching. Here, I explain the new concept, like a variable being a 'potli' (pouch) to hold a value.",
    position: 'right',
  },
  { // Step 3
    targetId: 'example',
    text: "This is an example code. See how it works. The '#' comments explain each line.",
    position: 'right',
  },
  { // Step 4
    targetId: 'test',
    text: "Finally, this is your Test. It tells you exactly what code you must write to succeed.",
    position: 'right',
  },
  { // Step 5
    targetId: 'editor',
    text: "This is your scroll. Type your code here. Type exactly this and we will continue:\nmangoes = 5",
    position: 'top',
    waitForCode: 'mangoes = 5',
  },
  { // Step 6
    targetId: 'editor',
    text: "Excellent! Now press Enter for a new line and type:\nprint(mangoes)",
    position: 'top',
    waitForCode: 'mangoes = 5\nprint(mangoes)',
  },
  { // Step 7
    targetId: 'run-button',
    text: "Shabash! Your code is complete. Now, click 'Run Code' to present it for evaluation.",
    position: 'top',
    waitForAction: 'run-success',
  },
  { // Step 8
    targetId: 'next-button',
    text: "Vijayi Bhava! You have succeeded! Click 'Next Level' to continue your great journey.",
    position: 'top',
    waitForAction: 'next',
  },
];