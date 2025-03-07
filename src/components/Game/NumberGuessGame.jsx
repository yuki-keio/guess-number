import React, { useState, useEffect, useRef } from "react";
import "./NumberGuessGame.css";

function NumberGuessGame() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("1～100の数字を当ててください！");
  const [hintMessage, setHintMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(1000);
  const maxAttempts = 7;
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);

  // Helper function to convert full-width numbers to half-width
  const toHalfWidth = (str) => {
    return str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 65248));
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(0);
    setScore(1000);
    setMessage("1～100の数字を当ててください！");
    setHintMessage("");
    setGameOver(false);
    setGuess("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleGuess = () => {
    if (gameOver) return; // 入力受付停止

    // Convert full-width input to half-width
    const convertedGuess = toHalfWidth(guess);
    if (!convertedGuess || isNaN(convertedGuess)) {
      setMessage("有効な数字を入力してください。");
      setHintMessage("");
      return;
    }

    const num = parseInt(convertedGuess, 10);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (num === targetNumber) {
      setMessage(`🎉 正解！スコア: ${score}点（${newAttempts}回で正解）`);
      setHintMessage("");
      setGameOver(true);
    } else if (newAttempts >= maxAttempts) {
      setMessage(`😢 失敗… 正解は ${targetNumber} でした！`);
      setHintMessage("");
      setGameOver(true);
    } else {
      // フィードバック
      let feedback = "";
      if (Math.abs(num - targetNumber) <= 5) {
        feedback = "🔥 すごく近いです！";
      } else if (num > targetNumber) {
        feedback = "🔽 もっと小さい数字です！";
      } else {
        feedback = "🔼 もっと大きい数字です！";
      }
      setMessage(feedback);

      // ヒント
      let hint = "";
      if (Math.random() < 0.5) {
        hint = targetNumber % 2 === 0 ? "正解は偶数かも？" : "正解は奇数かも？";
      } else {
        const lowerOffset = Math.floor(Math.random() * 6); // 0～5
        const lowerBound = Math.max(1, targetNumber - lowerOffset);
        const upperBound = Math.min(100, targetNumber + 5 - lowerOffset);
        hint = `正解は ${lowerBound}～${upperBound} のどこかかも？`;
      }
      setHintMessage(hint);

      // スコア減点
      setScore(score - 100);
    }

    setGuess("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  };

  return (
    <div className="game-container">
      <h1>数字当てゲーム</h1>
      {/* フィードバックメッセージ */}
      <p className="feedback-text">{message}</p>
      {/* ヒントメッセージ */}
      {hintMessage && <p className="hint-text">💡ヒント: {hintMessage}</p>}

      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        placeholder="数字を入力"
        disabled={gameOver}
      />
      <button onClick={handleGuess} disabled={gameOver}>送信</button>

      <p>試行回数: {attempts} / {maxAttempts}</p>
      <p>スコア: {score} 点</p>
      {gameOver && (
        <button onClick={startNewGame}>新規ゲーム</button>
      )}
    </div>
  );
}

export default NumberGuessGame;