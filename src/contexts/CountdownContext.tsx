import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData{
    minutes: number;
    seconds: number;
    timePercent: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: ()=>void;
    resetCountdown: ()=>void;
}

interface CountdownProviderProps{
    children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }: CountdownProviderProps){
    const totalTime = 25;
    const { startNewChallenge } = useContext(ChallengesContext);
    const [time, setTime] = useState(totalTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timePercent = (((time/(totalTime * 60)) - 1) * (-1)) * 100;

    function startCountdown(){
        setIsActive(true);
    }
    function resetCountdown(){
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(totalTime * 60);
    }
    useEffect(()=>{
        if(isActive && time > 0 ){
            countdownTimeout = setTimeout(()=>{
                setTime(time - 1);

            },1000)
        }else if(isActive && time === 0){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    },[isActive,time])

    return(
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            timePercent,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown,
        }}>
            <div style={{display: 'flex',height: '100%',width:'100%'}}>
                {children}
            </div>
        </CountdownContext.Provider>
    );
}