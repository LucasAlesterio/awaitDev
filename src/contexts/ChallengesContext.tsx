import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useEffect, useState } from "react";
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
        avatar_url: string;
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
    idUser: string;
    usersRegistered: UserRegistered[];
}

interface UserRegistered{
    photo: string;
    user: string;
    level: number;
    challengesCompleted: number;
    currentExperience: number;
    totalExp: number;
}

interface ChallengesProviderProps{
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children}: ChallengesProviderProps){

    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    const [dataUser, setDataUser] = useState({data:{login:"",avatar_url:""},status:-1});
    const [page, setPage] = useState('home');
    const [idUser, setIdUser] = useState("");
    const [followers, setFollowers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [usersRegistered, setUsersRegistered] = useState([]);

    const token = Cookies.get('token');

    const { push } = useRouter();
    const experienceToNextLevel = Math.pow(((level + 1) * 4), 2 );

    function changePage(page:'home'|'award'){
        setPage(page);
    }

    async function getUser(){
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

    useEffect(() => {
        Notification.requestPermission();
        getUser();
    }, [])

    const getFollowers  = async() => {
        const {data} = await axios.get('https://api.github.com/user/followers',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        setFollowers(data);
    }
    
    const getAllUsers = async() =>{
        const {data} = await axios.get('api/users');
        setAllUsers(data.allUsers.data);
    }
    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    function calcTotalExp(level, xp){
        let totalExp = 0;
        for(let lvl = 1; lvl < level; lvl++){
            totalExp += Math.pow(((level + 1) * 4), 2 );
        }
        totalExp += xp;
        return totalExp;
    }
    useEffect(()=>{
        if(followers.length > 0
            && allUsers.length > 0
            && usersRegistered.length === 0
            && dataUser.data.login
            && idUser){
            let awards = followers.map((follow)=>{
                let thisUser = (allUsers.find((user) => user.user === follow.login)) ;
                if(thisUser){
                    thisUser.photo = follow.avatar_url;
                    thisUser.totalExp = calcTotalExp(thisUser.level, thisUser.currentExperience);
                }
                return thisUser;
            })
            awards = awards.filter((award)=>{return award !== undefined});
            awards.push({
                _id: idUser,
                user: dataUser.data.login,
                challengesCompleted:challengesCompleted,
                currentExperience:currentExperience,
                level: level,
                photo: dataUser.data.avatar_url,
                totalExp: calcTotalExp(level, currentExperience)

            })
            awards = awards.sort(dynamicSort("totalExp"));
            console.log(awards);
            setUsersRegistered(awards);
        } 
    },[followers,allUsers,dataUser])

    useEffect(()=>{
        if(dataUser.data.login){
            axios.get(`api/users?user=${dataUser.data.login}`).then(({data})=>{
                if(data.findUserByUser){
                    setChallengesCompleted(data.findUserByUser.challengesCompleted);
                    setLevel(data.findUserByUser.level);
                    setCurrentExperience(data.findUserByUser.currentExperience);
                    setIdUser(data.findUserByUser._id);
                }else{
                    axios.post(`api/users`,{
                        user: dataUser.data.login,
                        currentExperience:0,
                        challengesCompleted:0,
                        level:1
                    }).then((response)=>{
                        if(response.status !== 200){
                            push('/');
                        }
                    }).catch((err)=>{
                        console.log(err);
                        push('/')
                    })
                }
            }).catch((err)=>{
                console.log(err);
                push('/')
            })
        }
        getAllUsers();
        getFollowers();
    },[dataUser]);

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
            await axios.put('api/users',body)
        }
    }
    useEffect(()=>{
        updateData();
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
            changePage,
            idUser,
            usersRegistered
        }}>
            <div style={{display: 'flex',height: '100%',width:'100%'}}>
                {children}
            </div>
            {isLevelUpModalOpen &&
                <LevelUpModal/> 
            }
        </ChallengesContext.Provider>
    )
}
