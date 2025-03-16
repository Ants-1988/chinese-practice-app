import { useState, useEffect } from "react";

export default function ChinesePracticeApp() {
  const [cards, setCards] = useState([]);
  const [englishWord, setEnglishWord] = useState("");
  const [chineseCharacter, setChineseCharacter] = useState("");
  const [currentCard, setCurrentCard] = useState(null);
  const [strokeOrderSvg, setStrokeOrderSvg] = useState(null);

  useEffect(() => {
    if (currentCard) {
      fetchStrokeOrder(currentCard.chinese);
    }
  }, [currentCard]);

  const addCard = () => {
    if (englishWord && chineseCharacter) {
      setCards([...cards, { english: englishWord, chinese: chineseCharacter }]);
      setEnglishWord("");
      setChineseCharacter("");
    }
  };

  const startPractice = () => {
    if (cards.length > 0) {
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
          placeholder="Chinese Character"
          value={chineseCharacter}
          onChange={(e) => setChineseCharacter(e.target.value)}
        />
        <button onClick={addCard}>Add Flashcard</button>
      </div>
      {currentCard ? (
        <div>
          <h2>{currentCard.english}</h2>
          <div style={{ fontSize: "2rem" }}>{currentCard.chinese}</div>
          {strokeOrderSvg ? (
            <div dangerouslySetInnerHTML={{ __html: strokeOrderSvg }} />
          ) : (
            <p>No stroke order found.</p>
          )}
        </div>
      ) : (
        <button onClick={startPractice} disabled={cards.length === 0}>
          Start Practice
        </button>
      )}
    </div>
  );
}
