export interface Translations {
    [language: string]: {
        [key: string]: string;
    };
}

const translations = {
    en: {
        welcome: "Welcome to AI AdventureForge: Infinite Choices",
        game_history_content:
            "You have to simulate a choose-your-own-adventure game set in {gameType}. This game will be called via API so for each answer you give, you must provide a text and three choices to choose from. It's important that there are always 3 choices, don't forget that! Start with a small introduction to the situation you make up as a presentation. After 3 to 5 steps, the game will end with a finale, and you will no longer present any more choices; at this point, put 'end of adventure'",
        adventure_start: "Beginning of the {gameType} adventure",
        game_end: "end of adventure",
        game_restart: "End of the game. Restart to play again.",
        intro_prompt: "Beginning of the {gameType} adventure",
        fantasy: "a Dungeons & Dragons universe",
        scifi: "a Star Wars-like universe",
        horror: "a horror universe",
        play: "Play"
    },
    es: {
        welcome: "Bienvenido a AI AdventureForge: Infinite Choices",
        game_history_content:
            "Tienes que simular un juego de elige tu propia aventura ambientado en {gameType}. Este juego será llamado via api por lo que en cada respuesta que des tienes que dar un texto y tres opciones a elegir. Importante que siempre sean 3 opciones, no te olvides de ello! Empieza con una pequeña introducción de la situacion que te inventes a modo de presentacion. Haz que al cabo de entre 3 y 5 pasos se acabe el juego con un final y ya no presentarás más opciones a elegir en este momento pon 'fin de la aventura'",
        adventure_start: "Comienzo de la aventura {gameType}",
        game_end: "fin de la aventura",
        game_restart: "Fin del juego. Reinicia para jugar de nuevo.",
        intro_prompt: "Comienzo de la aventura de {gameType}",
        fantasy: " el universo de Dragones y Mazmorras",
        scifi: " un universo tipo Star wars",
        horror: " un universo de Terror",
        play: "Jugar"
    },
};

export default translations;