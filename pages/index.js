import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ChinesePracticeApp() {
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("categories")) || {};
  });
  const [currentCategory, setCurrentCategory] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [chineseCharacter, setChineseCharacter] = useState("");
  const [currentCard, setCurrentCard] = useState(null);
  const [strokeOrderSvg, setStrokeOrderSvg] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);
  
  useEffect(() => {
    if (currentCard) {
      fetchStrokeOrder(currentCard.chinese);
    }
  }, [currentCard]);

  const addCategory = () => {
    if (!categories[currentCategory]) {
      setCategories({ ...categories, [currentCategory]: [] });
    }
  };

  const addCard = () => {
    if (englishWord && chineseCharacter && currentCategory) {
      const newCard = { english: englishWord, pinyin, chinese: chineseCharacter };
      setCategories({
        ...categories,
        [currentCategory]: [...(categories[currentCategory] || []), newCard],
      });
      setEnglishWord("");
      setPinyin("");
      setChineseCharacter("");
    }
  };

  const startQuiz = () => {
    if (categories[currentCategory]?.length > 0) {
      setQuizMode(true);
      setCurrentCard(
        categories[currentCategory][Math.floor(Math.random() * categories[currentCategory].length)]
      );
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
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Chinese Character Practice</h1>
      <div className="space-y-2">
        <Input
          placeholder="New Category"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
        />
        <Button onClick={addCategory}>Add Category</Button>
        <select onChange={(e) => setCurrentCategory(e.target.value)}>
          <option value="">Select a category</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Input placeholder="English Word" value={englishWord} onChange={(e) => setEnglishWord(e.target.value)} />
        <Input placeholder="Pinyin" value={pinyin} onChange={(e) => setPinyin(e.target.value)} />
        <Input placeholder="Chinese Character" value={chineseCharacter} onChange={(e) => setChineseCharacter(e.target.value)} />
        <Button onClick={addCard}>Add Flashcard</Button>
      </div>
      {currentCard ? (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">{currentCard.english} ({currentCard.pinyin})</h2>
            <div className="border p-4 text-4xl text-center">{currentCard.chinese}</div>
            {strokeOrderSvg ? (
              <div dangerouslySetInnerHTML={{ __html: strokeOrderSvg }} />
            ) : (
              <p>No stroke order found.</p>
            )}
            <canvas ref={canvasRef} width={300} height={300} className="border w-full h-64"></canvas>
            <Button onClick={clearCanvas}>Clear</Button>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={startQuiz} disabled={!categories[currentCategory]?.length}>
          Start Quiz
        </Button>
      )}
    </div>
  );
}
