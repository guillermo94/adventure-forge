export type Theme = {
    typeKey: string;
    music: string;
    className: string;
};

export const availableTypes: Theme[] = [
    {
        "typeKey": "fantasy",
        "music": "/music/fantasyMusic.mp3",
        "className": "fantastTheme"
    },
    {
        "typeKey": "scifi",
        "music": "/music/scifiMusic.mp3",
        "className": "fantastTheme"
    },
    {
        "typeKey": "horror",
        "music": "/music/horrorMusic.mp3",
        "className": "fantastTheme"
    }
];
