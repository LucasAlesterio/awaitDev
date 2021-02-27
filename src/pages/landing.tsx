import styles from '../styles/pages/Landing.module.css';
import { useRouter } from 'next/router';

export default function Landing(){
    const router = useRouter();
    if (router.isFallback) {
        return <h1 >Loading...</h1>
    }
    function login(){
        router.push('/');
    }
    return(
        <div className={styles.container}>
            <img src="/landing.svg" alt="Water Mark"/>
            <section>
                <img src="/logo.svg" alt="logo"/>
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