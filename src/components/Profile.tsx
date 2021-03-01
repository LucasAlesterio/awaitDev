import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
export function Profile(){
    const {level,dataUser} = useContext(ChallengesContext);
    const {push} = useRouter();
    function logOut(){
        Cookie.remove('token');
        push('/');
    }
    return(
        <div className={styles.profileContainer}>
            <img src={dataUser.data? dataUser.data.avatar_url: 'https://image.flaticon.com/icons/png/512/44/44948.png'} alt="Lucas" />
            <div>
                <strong>{dataUser.data ? dataUser.data.login : ''}
                    <button onClick={logOut} title="Sair">
                        <img src="/exit.svg" alt="Log out"/>
                    </button>
                </strong>
                <p>
                    <img src="icons/level.svg" alt="level"/>
                    Level {level}
                </p>
            </div>
        </div>
    )
}