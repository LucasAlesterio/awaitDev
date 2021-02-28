import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ChallengeBox } from '../components/ChallengeBox';
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import SideBar from '../components/SideBar';
import { ChallengesProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';
import styles from '../styles/pages/Home.module.css';
import { useRouter } from 'next/router';

interface HomeProps{
  level: number;
  currentExperience: number;
  challengesCompleted: number;

}
export default function Home(
  {level,
  currentExperience,
  challengesCompleted
  }) {

  const {query} = useRouter();
  console.log(query.code);

  return (
  <ChallengesProvider
  level={level}
  currentExperience={currentExperience}
  challengesCompleted={challengesCompleted}
  >
    <div className={styles.container}>
      <Head>
        <title>inicio | move.it</title>
      </Head>
      <SideBar selected="home"/>
      <ExperienceBar />
      <CountdownProvider>
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
      </CountdownProvider>
    </div>
  </ChallengesProvider>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) =>{
  const { level,currentExperience, challengesCompleted } = ctx.req.cookies;

  return{
    props:{
      level: Number(level),
      currentExperience:Number(currentExperience),
      challengesCompleted:Number(challengesCompleted)
    }
  }
}
