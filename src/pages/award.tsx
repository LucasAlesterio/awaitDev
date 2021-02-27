import styles from '../styles/pages/Award.module.css';
import SideBar from '../components/SideBar';
import CardPerson from '../components/CardPerson';

export default function Award(){
    return(
    <div className={styles.container}>
        <SideBar selected="award"/>
        <section>
            <h1>Leaderboard</h1>
            <div className={styles.labels}>
                <div>
                    <h4 className={styles.position}>POSIÇÃO</h4>
                    <h4 className={styles.user}>USUÁRIO</h4>
                </div>
                <div>
                    <h4 className={styles.challenges}>DESAFIOS</h4>
                    <h4 className={styles.xp}>EXPERIÊNCIA</h4>
                </div>
            </div>
            <div>
                <CardPerson
                position={1}
                photo="https://github.com/LucasAlesterio.png"
                name="Lucas Alesterio"
                level={2}
                challenges={23}
                xp={12324}
                />
            </div>
        </section>
    </div>
    )
}