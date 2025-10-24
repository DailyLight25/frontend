"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";

export default function AIPanel() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    // Placeholder logic — will connect to backend AI endpoint later
    setTimeout(() => {
      setResponse(
        "✨ *In the beginning was the Word...* This could be your AI-generated devotional intro. Customize it as you wish!"
      );
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faRobot} className="text-faith-purple text-xl" />
        <h2 className="text-xl font-semibold text-gray-700">Faith AI Assistant</h2>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Faith AI to help you write about love, prayer, or hope..."
        className="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-faith-blue outline-none"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-3 bg-faith-blue hover:bg-faith-purple text-white font-semibold py-2 px-5 rounded-lg transition-all"
      >
        {loading ? "Generating..." : "Generate with AI"}
        <FontAwesomeIcon icon={faMagicWandSparkles} className="ml-2" />
      </button>

      {response && (
        <div className="mt-5 bg-faith-cream p-4 rounded-lg text-gray-700 border-l-4 border-faith-gold whitespace-pre-line">
          {response}
        </div>
      )}
    </div>
  );
}
