import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import axios from 'axios';
export default function Callback({client_id,client_secret}){
    
    //Cookies.set('level',String(level));
    const route = useRouter();

    async function getToken(code){
        await axios.post('api/authenticate',{
            client_id,
            client_secret,
            code
        }).then((response)=>{
            const {data} = response;
            Cookies.set('token',String(data))
            route.push('/home');
        }).catch((err)=>console.log(err));
    }

    useEffect(()=>{
        if(route.query.code){
            getToken(route.query.code)
        }else{
            route.push('/');
        }
    },[])

    return(<div>Loading</div>)
}
export const getServerSideProps: GetServerSideProps = async () =>{
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    return{
        props:{
            client_id,
            client_secret
        }
    }
}