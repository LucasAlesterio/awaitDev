import { useContext } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css';

export function Countdown(){
    const { 
        minutes, 
        seconds,
        timePercent,
        hasFinished, 
        isActive, 
        resetCountdown, 
        startCountdown
    } = useContext(CountdownContext);

    const [minuteLeft,minuteRight] = String(minutes).padStart(2,'0').split('');
    const [secondLeft,secondRight] = String(seconds).padStart(2,'0').split('');

    return(
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>
            { hasFinished ? (
                <button
                disabled
                type="button" 
                className={styles.countdownButton}
                >
                    Ciclo encerrado
                </button>
            ):(
                <>
                    {isActive ? (
                        <div className={styles.containerCountdownButton}>
                            <button 
                            type="button" 
                            className={styles.countdownButtonActive}
                            onClick={resetCountdown}
                            >
                                Abandonar ciclo
                            </button>
                            <div style={{width:`${timePercent}%`}} className={styles.progressBar}/>
                        </div>
                        ):(
                        <button 
                        type="button" 
                        className={styles.countdownButton}
                        onClick={startCountdown}
                        >
                            Iniciar um ciclo
                        </button>
                    )}
                </>
            )}
        </div>
    );
}