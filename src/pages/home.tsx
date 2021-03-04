import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext, useState } from 'react';
import CardPerson from '../components/CardPerson';
import { ChallengeBox } from '../components/ChallengeBox';
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { ListCards } from '../components/ListCards';
import { Profile } from "../components/Profile";
import SideBar from '../components/SideBar';
import { ChallengesProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';
import stylesAwards from '../styles/pages/Award.module.css';
import styles from '../styles/pages/Home.module.css';

export default function Home(){

  const [page,setPage] = useState('home');

  return (
  <ChallengesProvider >
  <CountdownProvider>
    <SideBar selected={page} changePage={setPage}/>
    <Head>
      <title>Await Dev</title>
    </Head>
    {page === 'home' ? 
    <div className={styles.container}>
      <ExperienceBar />
      
        <section>
          <div>
            <Profile />
            <CompletedChallenges />
            <Countdown />
          </div>
          <div>
            <ChallengeBox /> 
          </div>
        </section>
      
    </div>:
    <div className={stylesAwards.container}>
    <section>
        <h1>Leaderboard</h1>
        <div className={stylesAwards.labels}>
            <div>
                <h4 className={stylesAwards.position}>POSIÇÃO</h4>
                <h4 className={stylesAwards.user}>USUÁRIO</h4>
            </div>
            <div>
                <h4 className={stylesAwards.challenges}>DESAFIOS</h4>
                <h4 className={stylesAwards.xp}>EXPERIÊNCIA</h4>
            </div>
        </div>
        <ListCards />
        {/* <div>
          cards
        </div> */}
    </section>
  </div>
    }</CountdownProvider>
  </ChallengesProvider>
  )
}