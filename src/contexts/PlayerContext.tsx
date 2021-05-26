import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    clearPlayerState: () => void;
    currentEpisodeId: string;
    episodes: Episode[];
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isPlaying: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], playId: string) => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    toggleLoop: () => void;
    togglePlay: () => void;
    toggleShuffle: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodes, setEpisodes] = useState([])
    const [currentEpisodeId, setCurrentEpisodeId] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function playList(list: Episode[], playId: string) {
        setEpisodes(list)
        setCurrentEpisodeId(playId)
        setIsPlaying(true)
    }

    function play(episode: Episode) {
        setEpisodes([episode])
        setCurrentEpisodeId(episode.id)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function clearPlayerState() {
        setEpisodes([])
        setCurrentEpisodeId("")
    }

    const currentIndex = episodes.findIndex(e => e.id === currentEpisodeId)

    const previousEpisodeIndex = currentIndex - 1
    const nextEpisodeIndex = currentIndex + 1

    const hasPrevious = previousEpisodeIndex > 0
    const hasNext = isShuffling || nextEpisodeIndex < episodes.length

    function playNext() {
        if (isShuffling) {
            const randomEpisodeIndex = Math.floor(Math.random() * episodes.length)
            setCurrentEpisodeId(episodes[randomEpisodeIndex].id)
        } else if (hasNext) {
            setCurrentEpisodeId(episodes[nextEpisodeIndex].id)
        }
    }

    function playPrevious() {
        if (!hasPrevious) {
            return
        }
        setCurrentEpisodeId(episodes[previousEpisodeIndex].id)
    }

    return (
        <PlayerContext.Provider value={{
            clearPlayerState,
            currentEpisodeId,
            episodes,
            hasNext,
            hasPrevious,
            isLooping,
            isPlaying,
            isShuffling,
            play,
            playList,
            playNext,
            playPrevious,
            setPlayingState,
            toggleLoop,
            toggleShuffle,
            togglePlay,
        }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext)
