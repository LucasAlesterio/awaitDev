import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';
export function Profile(){
    const {level,dataUser} = useContext(ChallengesContext);
    return(
        <div className={styles.profileContainer}>
            <img src={dataUser.data? dataUser.data.avatar_url: 'https://image.flaticon.com/icons/png/512/44/44948.png'} alt="Lucas" loading="lazy"/>
            <div>
                <strong>{dataUser.data ? dataUser.data.login : ''}</strong>
                <p>
                    <img src="icons/level.svg" alt="level"/>
                    Level {level}
                    </p>
            </div>
        </div>
    )
}