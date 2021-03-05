import styles from '../styles/components/CardPerson.module.css';

export default function CardPerson({position,photo,name,level, challenges,xp}){

    return(
        <div className={styles.container}>
            <div className={styles.position}>
                <strong> {position} </strong>
            </div>
            <div className={styles.data}>
                <div className={styles.tag}>
                    <img src={photo} alt="Lucas"/>
                    <div className={styles.nameLevel}>
                        <strong>{name}</strong>
                        <p>
                            <img src="icons/level.svg" alt="level"/>
                            Level {level}
                        </p>
                    </div>
                </div>
                <div className={styles.numbers}>
                    <div className={styles.challenges}>
                        <p><strong>{challenges}</strong> desafios</p>
                    </div>
                    <div className={styles.xp}>
                        <p><strong>{xp}</strong> xp</p>
                    </div>
                </div>
            </div>
        </div>
    );
}