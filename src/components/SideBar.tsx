import styles from '../styles/components/SideBar.module.css';

export default function SideBar({selected,changePage}){

    return(
        <div className={styles.container}>
            <img src="/icon_logo.svg" alt="logo"/>
            <div>
                <button style={selected !== 'home' ? {border: 'none'}: {}} onClick={()=>changePage('home')}>
                    <img src={ selected === 'home' ? '/home_selected.svg': '/home.svg'} alt="home"/>
                </button>

                <button style={selected === 'home' ? {border: 'none'} : {}} onClick={()=>changePage('award')}>
                    <img src={ selected === 'award' ? '/award_selected.svg': '/award.svg'} alt="home"/>
                </button>
            </div>
        </div>
    );
}