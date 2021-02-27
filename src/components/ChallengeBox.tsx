import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/ChallengeBox.module.css';

export function ChallengeBox(){
    const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext);
    const { resetCountdown } = useContext(CountdownContext);
    function handleChallengeSucceded(){
        completeChallenge();
        resetCountdown();
    }
    function  handleChallengeFailed(){
        resetChallenge();
        resetCountdown();
    }
    return(
        <div className={styles.ChallengeBoxContainer}>
            {activeChallenge ? (
                <div className={styles.ChallengeActive}>
                    <header>Ganhe {activeChallenge.amount}</header>
                    <main>
                        <img src={`icons/${activeChallenge.type}.svg`} alt="Novo desafio"/>
                        <strong>Novo desafio</strong>
                        <p>{activeChallenge.description}</p>
                    </main>
                    <footer>
                        <button 
                        type="button"
                        onClick={handleChallengeFailed}
                        >
                            Falhei
                            </button>
                        <button 
                        type="button"
                        onClick={handleChallengeSucceded}
                        >
                            Completei
                        </button>
                    </footer>
                </div>
            ): (
                <div className={styles.ChallengeNotActive}>
                    <strong>Finalize um cilclo para receber um desafio</strong>
                    <p>
                        <img src="icons/level-up.svg" alt="Level Up"/>
                        Avance de level completando os desafios
                    </p>
                </div>
            )}
        </div>
    );
}