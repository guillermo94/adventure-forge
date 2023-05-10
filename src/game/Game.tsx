import React, { useRef, useEffect, useState } from "react";
import { useLanguage, useTranslation } from "../language/LanguageContext";
import "./Game.css";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


interface GameProps {
  userToken: string;
}


function splitTextIntoChunks(text, maxChunkSize) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  words.forEach(word => {
    if (currentChunk.length + word.length <= maxChunkSize) {
      currentChunk += ' ' + word;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const speak = (text: string, voice: SpeechSynthesisVoice) => {
  // Limpiar el array de utterances
  window.utterances = [];

  // Dividir el texto en fragmentos, sin dividir las palabras a la mitad
  const maxChunkSize = 120;
  const textChunks = splitTextIntoChunks(text, maxChunkSize);

  // Función para hablar un fragmento y programar el siguiente fragmento
  const speakChunk = (index: number) => {
    if (index < textChunks.length) {
      const utterance = new SpeechSynthesisUtterance(textChunks[index]);
      utterance.voice = voice; // Establecer la voz en la instancia de SpeechSynthesisUtterance
      window.utterances.push(utterance);

      utterance.onend = () => {
        speakChunk(index + 1);
      };

      speechSynthesis.speak(utterance);
    }
  };

  // Iniciar la narración
  speakChunk(0);
};


const Game: React.FC<GameProps> = ({ userToken }): React.ReactElement => {

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const spinner = useRef(null);
  const options = useRef(null);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [gameContent, setGameContent] = useState<string[]>([]);

  const updateVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      setVoicesLoaded(true);
    }
  };

  useEffect(() => {
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    updateVoices(); // Llama a updateVoices una vez al inicio

    return () => {
      // Limpia el eventListener al desmontar el componente
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  const selectedVoice = voices.find((voice) => voice.lang.startsWith(language));

  const getRandomType = () => {
    const generos = [t("fantasy"), t("scifi"), t("horror")];
    const index = Math.floor(Math.random() * generos.length);
    return generos[index];
  };

  const [gameType, setGameType] = useState(getRandomType());

  const [gameHistory, setGameHistory] = useState([
    {
      role: "system",
      content: t("game_history_content", { gameType: gameType }),
    },
  ]);



  function toggleSpinner(visible) {
    spinner.current.classList.toggle("hidden", !visible);
  }

  function toggleOptions(visible: boolean) {
    if (options.current) {
      options.current.classList.toggle("hidden", !visible);
    } else {
      console.error("No se encontró el elemento 'options'.");
    }
  }


  function extractOptions(text) {
    const lines = text.split('\n');
    const options = [];
    let newText = "";

    for (const line of lines) {
      const lowerCaseLine = line.toLowerCase();
      if (lowerCaseLine.startsWith('opción') || lowerCaseLine.startsWith('Opción')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const optionText = line.slice(colonIndex + 1).trim();
          options.push(optionText);
        }
      } else if (/^\d+\./.test(lowerCaseLine)) {
        const dotIndex = line.indexOf('.');
        if (dotIndex !== -1) {
          const optionText = line.slice(dotIndex + 1).trim();
          options.push(optionText);
        }
      } else if (/^\d+\)/.test(lowerCaseLine)) {
        const closeParenIndex = line.indexOf(')');
        if (closeParenIndex !== -1) {
          const optionText = line.slice(closeParenIndex + 1).trim();
          options.push(optionText);
        }
      } else {
        newText += line + "\n";
      }
    }
    console.log('Opciones extraídas:', options);

    return { options, newText: newText.trim() };
  }


  async function startGame() {
    toggleSpinner(true);
    toggleOptions(false);

    const introPrompt = t("intro_prompt", { gameType: gameType });
    const introText = await fetchChatGPTResponse(introPrompt, false);
    setGameHistory((prevHistory) =>
      prevHistory.concat(
        { role: "user", content: introPrompt },
        { role: "assistant", content: introText }
      )
    );

    const { options: introOptions, newText } = extractOptions(introText);
    setGameContent((prev) => [...prev, newText]);

    if (!voicesLoaded) {
      const checkVoicesInterval = setInterval(() => {
        if (voicesLoaded) {
          clearInterval(checkVoicesInterval);
          speak(newText, selectedVoice);
        }
      }, 100);
    } else {
      speak(newText, selectedVoice);
    }
    for (let i = 0; i < 3; i++) {
      const optionButton = [option1, option2, option3][i].current;
      if (introOptions[i]) {
        optionButton.textContent = introOptions[i];
      } else {
        optionButton.textContent = `Opción ${i + 1}`;
      }
      optionButton.disabled = false;
    }

    toggleSpinner(false);
    toggleOptions(true);
  }

  async function sendChoice(choice) {
    toggleOptions(false);
    toggleSpinner(true);

    const prompt = `Elegiste la opción ${choice}. ¿Qué sucede a continuación?`;

    const response = await fetchChatGPTResponse(prompt);

    const { options: responseOptions, newText } = extractOptions(response);

    if (responseOptions.length === 3) {
      option1.current.textContent = responseOptions[0];
      option2.current.textContent = responseOptions[1];
      option3.current.textContent = responseOptions[2];
    } else {
      console.error('No se encontraron exactamente 3 opciones en la respuesta de ChatGPT');
    }

    setGameContent((prev) => [...prev, newText]);
    speak(newText, selectedVoice)

    setGameHistory((prevHistory) =>
      prevHistory.concat(
        { role: "user", content: prompt },
        { role: "assistant", content: response }
      )
    );
    toggleSpinner(false);

    if (response.toLowerCase().includes("fin de la aventura")) {
      setGameContent((prev) => [...prev, `<p>Fin del juego. Reinicia para jugar de nuevo.</p>`]);
      option1.current.disabled = true;
      option2.current.disabled = true;
      option3.current.disabled = true;
    } else {
      toggleOptions(true);
    }
  }

  async function fetchChatGPTResponse(prompt, addToHistory = true) {
    const token = userToken;

    // const token = "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";
    const model = "gpt-3.5-turbo";
    const messages = gameHistory.concat({ role: "user", content: prompt });
    const url = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    };
    try {
      // const data = { "id": "chatcmpl-7Dty0ia7TwnFjzH0qS5tYqp4vev1A", "object": "chat.completion", "created": 1683547756, "model": "gpt-3.5-turbo-0301", "usage": { "prompt_tokens": 155, "completion_tokens": 112, "total_tokens": 267 }, "choices": [{ "message": { "role": "assistant", "content": "Te encuentras en una nave espacial en el año 2050, eres parte de una misión para explorar nuevos planetas y encontrar posibles lugares donde puedan vivir los humanos. De pronto, la nave empieza a sacudirse y escuchas una alarma sonar. Tienes que tomar una decisión:\n\n1) Ir a investigar el origen de la alarma\n2) Pedir ayuda al equipo\n3) Permanecer en tu lugar y esperar a que alguien te diga qué hacer" }, "finish_reason": "stop", "index": 0 }] }

      // Uncomment this to make the proper call
      const response = await fetch(url, requestOptions);
      if (response.status === 429) {
        console.error("Error 429: Límite de velocidad alcanzado");
        return "Lo siento, se ha alcanzado el límite de solicitudes permitidas en este momento. Por favor, intenta de nuevo más tarde.";
      }
      const data = await response.json();
      const output = data.choices[0].message.content.trim();

      if (addToHistory) {
        setGameHistory((prevHistory) =>
          prevHistory.concat({ role: "assistant", content: output })
        );
      }

      return output;
    } catch (error) {
      console.error("Error al obtener respuesta de ChatGPT:", error);
      return "Lo siento, hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde.";
    }
  }

  function resetGame() {
    window.speechSynthesis.cancel(); // Detiene cualquier habla en curso
    toggleOptions(false);
    setGameContent([]);
    setGameType(getRandomType());
    setGameHistory([
      {
        role: "system",
        content: t("game_history_content", { gameType: gameType }),
      },
    ]);

    option1.current.disabled = false;
    option2.current.disabled = false;
    option3.current.disabled = false;
    startGame();
  }

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    initializeGame();
  }, [voicesLoaded]);

  const initializeGame = () => {
    if (voicesLoaded) {
      startGame();
    }
  };
  return (
    <>
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        infiniteLoop={false}
        selectedItem={gameContent.length - 1}

      >
        {gameContent.map((item, index) => (
          <div id="game-content" key={index}>
            <p >{item}</p>
          </div>
        ))}
      </Carousel>
      <div ref={spinner} className="spinner">Forjando...</div>
      <div ref={options} id="options" className="hidden">
        <button ref={option1} onClick={() => sendChoice(1)}>Opción 1</button>
        <button ref={option2} onClick={() => sendChoice(2)}>Opción 2</button>
        <button ref={option3} onClick={() => sendChoice(3)}>Opción 3</button>
        <button onClick={resetGame}>Reiniciar</button>
      </div>
    </>
  );

}
export default Game;
