import { useState, useEffect, useRef } from "react";

export default function ChinesePracticeApp() {
  const [cards, setCards] = useState([]);
  const [englishWord, setEnglishWord] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [chineseCharacter, setChineseCharacter] = useState("");
  const [currentCard, setCurrentCard] = useState(null);
  const [strokeOrderSvg, setStrokeOrderSvg] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (currentCard) {
      fetchStrokeOrder(currentCard.chinese);
    }
  }, [currentCard]);

  const addCard = () => {
    if (englishWord && chineseCharacter) {
      setCards([...cards, { english: englishWord, pinyin, chinese: chineseCharacter }]);
      setEnglishWord("");
      setPinyin("");
      setChineseCharacter("");
    }
  };

  const startPractice = () => {
    if (cards.length > 0) {
      setQuizMode(false);
      setCurrentCard(cards[Math.floor(Math.random() * cards.length)]);
    }
  };

  const startQuiz = () => {
    if (cards.length > 0) {
      setQuizMode(true);
      setCurrentCard(cards[Math.floor(Math.random() * cards.length)]);
    }
  };

  const fetchStrokeOrder = async (character) => {
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/skishore/makemeahanzi/graphics/${character.charCodeAt(0)}.svg`
      );
      if (response.ok) {
        const svgText = await response.text();
        setStrokeOrderSvg(svgText);
      } else {
        setStrokeOrderSvg(null);
      }
    } catch (error) {
      console.error("Error fetching stroke order:", error);
      setStrokeOrderSvg(null);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chinese Character Practice</h1>
      <div>
        <input
          type="text"
          placeholder="English Word"
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pinyin"
          value={pinyin}
          onChange={(e) => setPinyin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chinese Character"
          value={chineseCharacter}
          onChange={(e) => setChineseCharacter(e.target.value)}
        />
        <button onClick={addCard}>Add Flashcard</button>
      </div>
      {currentCard ? (
        <div>
          {!quizMode ? (
            <>
              <h2>{currentCard.english} ({currentCard.pinyin})</h2>
              <div style={{ fontSize: "2rem" }}>{currentCard.chinese}</div>
              {strokeOrderSvg ? (
                <div dangerouslySetInnerHTML={{ __html: strokeOrderSvg }} />
              ) : (
                <p>No stroke order found.</p>
              )}
              <canvas ref={canvasRef} width={300} height={300} style={{ border: "1px solid black" }}></canvas>
              <button onClick={clearCanvas}>Clear</button>
            </>
          ) : (
            <>
              <h2>{currentCard.english} ({currentCard.pinyin})</h2>
              <canvas ref={canvasRef} width={300} height={300} style={{ border: "1px solid black" }}></canvas>
              <button onClick={clearCanvas}>Clear</button>
              <button onClick={startQuiz}>Next Question</button>
            </>
          )}
        </div>
      ) : (
        <div>
          <button onClick={startPractice} disabled={cards.length === 0}>
            Start Practice
          </button>
          <button onClick={startQuiz} disabled={cards.length === 0}>
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
}
