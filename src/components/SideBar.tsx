import styles from '../styles/components/SideBar.module.css';
import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useContext, useEffect } from 'react';
// import { ChallengesContext } from '../contexts/ChallengesContext';

export default function SideBar({selected}){
    // const { dataUser } = useContext(ChallengesContext);
    // const {push} = useRouter();
    // useEffect(()=>{
    //     if(dataUser.status !== 200){
    //         push('/');
    //     }
    // },[dataUser])
    //const dataUser = {data:{},status:0};
    return(
        <div className={styles.container}>
            <img src="/icon_logo.svg" alt="logo"/>
            <Link href="/home">
                <a style={selected !== 'home' ? {border: 'none'}: {}}>
                    <img src={ selected === 'home' ? '/home_selected.svg': '/home.svg'} alt="home"/>
                </a>
            </Link>
            <Link href="/award">
                <a style={selected === 'home' ? {border: 'none'} : {}}>
                    <img src={ selected === 'award' ? '/award_selected.svg': '/award.svg'} alt="home"/>
                </a>
            </Link>
        </div>
    );
}