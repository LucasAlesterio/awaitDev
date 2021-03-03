import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import challenges from '../../challenges.json';
import { LevelUpModal } from "../components/LevelUpModal";

interface Challenge{
    type: 'body' | 'eye';
    description: string;
    amount: number;
}
interface DataUser{
    data:{
        login:string;
    }
    status: number;
}
interface ChallengesContextData{
    level: number; 
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: ()=>void;
    startNewChallenge: ()=>void;
    resetChallenge: ()=>void;
    experienceToNextLevel: number;
    completeChallenge: ()=>void;
    closeLevelUpModal: ()=>void;
    dataUser: DataUser;
    page: string;
    changePage: (args: 'home' | 'award')=>void;
}

interface ChallengesProviderProps{
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children}: ChallengesProviderProps){

    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    const [dataUser, setDataUser] = useState({data:{login:""},status:-1});
    const [page, setPage] = useState('home');
    const [idUser, setIdUser] = useState("");

    async function userExists(){
        const {data} = await axios.get(`api/users?user=${dataUser.data.login}`)
        if(data.findUserByUser){
            setLevel(data.findUserByUser.level);
            setChallengesCompleted(data.findUserByUser.challengesCompleted);
            setCurrentExperience(data.findUserByUser.currentExperience);
            setIdUser(data.findUserByUser._id);
        }else{
            const response = await axios.post(`api/users`,{
                user: dataUser.data.login,
                currentExperience:0,
                challengesCompleted:0,
                level:1
            })
            if(response.status !== 200){
                push('/');
            }
        }
    }

    const { push } = useRouter();
    const experienceToNextLevel = Math.pow(((level + 1) * 4), 2 );
    async function getToken(){
        const token = await Cookies.get('token');
        try{
            const response = await axios.get('https://api.github.com/user',{headers:{
                Authorization: `Bearer ${token}`
            }});
            if(response.status !== 200){
                push('/');
            }
            setDataUser(response);
        }catch(error){
            console.log(error);
            push('/');
        }
    }

    function changePage(page:'home'|'award'){
        setPage(page);
    }

    useEffect(()=>{
        if(dataUser.data.login){
            userExists();
        }
    },[dataUser])

    useEffect(() => {
        Notification.requestPermission();
        getToken();
        if(dataUser.data.login){
            userExists();
        }
    }, [])


    async function updateData(){
        if(dataUser.data.login && idUser){
            console.log("Update database")
            const body = {
                id: idUser,
                user: dataUser.data.login,
                currentExperience: currentExperience,
                challengesCompleted: challengesCompleted,
                level:level
            }
            console.log(body);
            await axios.put('api/users',body)
        }
    }
    useEffect(()=>{
        updateData();
        //console.log('Start');
        // Cookies.set('level',String(level));
        // Cookies.set('currentExperience',String(currentExperience));
        // Cookies.set('challengesCompleted',String(challengesCompleted));
    },[level,currentExperience,challengesCompleted])

    function levelUp(){
        setLevel( level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge(){
        const randomChallengerIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengerIndex];
        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio!',{
                body: `Valendo ${challenge.amount}xp!`,
                silent: true,
                icon: '/favicon.png',
                //image: `/icons/${challenge.type}.svg`
            }).onclick = () => {
                window.focus();
            };
        }

    }
    function resetChallenge(){
        setActiveChallenge(null);
    }
    function completeChallenge(){
        if(!activeChallenge){
            return;
        }
        const {amount} = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience>= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp()
        }
        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }
    return(
        <ChallengesContext.Provider value={{ 
            level, 
            levelUp, 
            currentExperience,
            challengesCompleted,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            experienceToNextLevel,
            completeChallenge,
            closeLevelUpModal,
            dataUser,
            page,
            changePage
        }}>
            {children}
            {isLevelUpModalOpen &&
                <LevelUpModal/> 
            }
        </ChallengesContext.Provider>
    )
}