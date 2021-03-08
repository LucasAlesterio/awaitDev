import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styles from '../styles/pages/Landing.module.css';

export default function Landing({client_id}){
    const router = useRouter();
    if (router.isFallback) {
        return <h1 >Loading...</h1>
    }
    function login(){
        router.push(`https://github.com/login/oauth/authorize?scope=user:email&client_id=${client_id}`);
    }
    return(
        <div className={styles.container}>
            <div className={styles.logo}>
                <h1 className={styles.await}>Await</h1>
                <h1 className={styles.dev}>Dev</h1>
                <h1 className={styles.bracket}>()</h1>
                <div className={styles.cursor}/>
            </div>
            <section>
                <div>
                    <h2>Bem-vindo</h2>
                    <button
                    onClick={login}
                    >
                        <img src="/github.svg" alt="logo github"/>
                        <p>Faça login com seu GitHub para começar</p>
                    </button>
                </div>
            </section>
        </div>
    );
}
export const getServerSideProps: GetServerSideProps = async () =>{
    const client_id = process.env.CLIENT_ID;
    return{
        props:{
            client_id
        }
    }
}