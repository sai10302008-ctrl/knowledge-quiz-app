import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const questions = [
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Venus', 'Jupiter', 'Mercury'],
    answer: 'Mars',
  },
  {
    question: 'What is the capital city of Japan?',
    options: ['Seoul', 'Tokyo', 'Kyoto', 'Osaka'],
    answer: 'Tokyo',
  },
  {
    question: 'Which gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    answer: 'Carbon dioxide',
  },
  {
    question: 'Who wrote the play Hamlet?',
    options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Jane Austen'],
    answer: 'William Shakespeare',
  },
  {
    question: 'Which language is primarily used for styling web pages?',
    options: ['Python', 'HTML', 'CSS', 'SQL'],
    answer: 'CSS',
  },
  {
    question: 'Which animal is known as the fastest land mammal?',
    options: ['Horse', 'Cheetah', 'Lion', 'Leopard'],
    answer: 'Cheetah',
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    answer: 'Pacific Ocean',
  },
  {
    question: 'Which element has the chemical symbol O?',
    options: ['Gold', 'Oxygen', 'Silver', 'Hydrogen'],
    answer: 'Oxygen',
  },
  {
    question: 'How many sides does a hexagon have?',
    options: ['5', '6', '7', '8'],
    answer: '6',
  },
  {
    question: 'Which country is famous for the pyramids of Giza?',
    options: ['Mexico', 'Greece', 'Egypt', 'Italy'],
    answer: 'Egypt',
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const glow1 = useRef(new Animated.Value(0)).current;
  const glow2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(glow1, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow1, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const animation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(glow2, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow2, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    animation1.start();
    animation2.start();

    return () => {
      animation1.stop();
      animation2.stop();
    };
  }, [glow1, glow2]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option) => {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(option);

    setTimeout(() => {
      if (option === currentQuestion.answer) {
        setScore((prev) => prev + 1);
      }

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 650);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  const orb1Translate = glow1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const orb2Translate = glow2.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -10],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <View style={styles.backgroundLayer}>
          <Animated.View
            style={[
              styles.orb,
              styles.orbOne,
              { transform: [{ translateY: orb1Translate }] },
            ]}
          />
          <Animated.View
            style={[
              styles.orb,
              styles.orbTwo,
              { transform: [{ translateY: orb2Translate }] },
            ]}
          />
          <View style={styles.gridOverlay} />
        </View>

        {!showResult ? (
          <View style={styles.quizCard}>
            <View style={styles.headerRow}>
              <Text style={styles.badge}>Ninja Quiz</Text>
              <Text style={styles.scoreText}>{score}/{questions.length}</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <Text style={styles.questionNumber}>Question {currentIndex + 1}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsWrap}>
              {currentQuestion.options.map((option) => {
                const isCorrect = option === currentQuestion.answer;
                const isSelected = option === selectedAnswer;
                const isAnswered = selectedAnswer !== null;

                let optionStyle = styles.optionButton;
                let optionTextStyle = styles.optionText;

                if (isAnswered && isCorrect) {
                  optionStyle = { ...styles.optionButton, ...styles.correctOption };
                  optionTextStyle = { ...styles.optionText, ...styles.correctOptionText };
                } else if (isAnswered && isSelected && !isCorrect) {
                  optionStyle = { ...styles.optionButton, ...styles.wrongOption };
                  optionTextStyle = { ...styles.optionText, ...styles.wrongOptionText };
                }

                return (
                  <TouchableOpacity
                    key={option}
                    style={optionStyle}
                    onPress={() => handleAnswer(option)}
                    activeOpacity={0.85}
                  >
                    <Text style={optionTextStyle}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Quiz Complete</Text>
            <Text style={styles.resultScore}>{score} / {questions.length}</Text>
            <Text style={styles.resultMessage}>
              {score >= 7
                ? 'Excellent! You are a knowledge master.'
                : score >= 4
                  ? 'Good job! Keep sharpening your mind.'
                  : 'Nice start! Try again and improve your score.'}
            </Text>

            <TouchableOpacity style={styles.restartButton} onPress={resetQuiz}>
              <Text style={styles.restartButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06080d',
  },
  container: {
    flex: 1,
    backgroundColor: '#070b12',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0b1017',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.65,
  },
  orbOne: {
    width: 320,
    height: 320,
    left: -60,
    top: 40,
    backgroundColor: '#8c0909',
    shadowColor: '#ff3d3d',
    shadowOpacity: 0.55,
    shadowRadius: 40,
  },
  orbTwo: {
    width: 360,
    height: 360,
    right: -70,
    bottom: 70,
    backgroundColor: '#274f48',
    shadowColor: '#5de7d7',
    shadowOpacity: 0.45,
    shadowRadius: 36,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  quizCard: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: 'rgba(12, 17, 22, 0.76)',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.38,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    backgroundColor: '#1b2c3a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  scoreText: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: 22,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  questionNumber: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  questionText: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 20,
  },
  optionsWrap: {
    gap: 12,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionText: {
    color: '#e2e8f0',
    fontSize: 17,
    fontWeight: '700',
  },
  correctOption: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22c55e',
  },
  correctOptionText: {
    color: '#dcfce7',
  },
  wrongOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: '#ef4444',
  },
  wrongOptionText: {
    color: '#fee2e2',
  },
  resultCard: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: 'rgba(12, 17, 22, 0.8)',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  resultTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  resultScore: {
    color: '#fbbf24',
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 12,
  },
  resultMessage: {
    fontSize: 17,
    textAlign: 'center',
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 22,
  },
  restartButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});

"use strict";
