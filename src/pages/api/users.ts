import { gql } from 'graphql-request';
import { NextApiRequest, NextApiResponse } from 'next';
import { graphQLClient } from '../../utils/graphql-client';

export default async (req: NextApiRequest , res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case 'POST':{
            let {body: { 
                user,
                currentExperience,
                challengesCompleted,
                level
                }} = req;

                const query = gql`
                mutation CreateAUser($user: String!, $currentExperience: Int!, $challengesCompleted: Int!, $level: Int!){
                    createUser(data: { 
                        user: $user, 
                        currentExperience: $currentExperience,
                        challengesCompleted: $challengesCompleted,
                        level: $level
                        }) {
                            _id
                            user
                            currentExperience
                            challengesCompleted
                            level
                    }
                }
                `;

                currentExperience = parseInt(currentExperience);
                challengesCompleted = parseInt(challengesCompleted);
                level = parseInt(challengesCompleted);

                try {
                    const response = await graphQLClient.request(query, { user, currentExperience, challengesCompleted, level });
                    return res.json(response);
                } catch (error) {
                    return res.status(500).json(error);
                }
        }
        case 'GET':{
            try{
                const { user } = req.query;
                let query = gql``;
                let data = {};
                if(user){
                    query = gql`
                        query FindOne($user: String!){
                            findUserByUser(user: $user){
                                _id
                                user
                                challengesCompleted
                                currentExperience
                                level
                                
                            }
                        }
                    `;
                data = await graphQLClient.request(query,{user});
                }else{
                    query = gql`{
                    allUsers {
                            data {
                                _id
                                user
                                challengesCompleted
                                currentExperience
                                level
                            }
                        }
                    }`;
                    data = await graphQLClient.request(query);
                }

                return res.json(data);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        case 'DELETE':{
            const { body: { id }} = req;
            try{
                const mutation = gql`
                mutation DeleteUser($id: ID!){
                    deleteUser(id: $id){
                        user
                    }
                }`;
                const data = await graphQLClient.request(mutation,{id});
                return res.json(data);
            }catch(error){
                return res.status(500).json(error);
            }
        }
        case 'PUT':{
            const { body:{id,user,level,currentExperience,challengesCompleted}} = req;
            try{
                const mutation = gql`
                    mutation UpdateUser($id: ID!,$user: String!,$level: Int!,$currentExperience: Int!, $challengesCompleted: Int!){
                        updateUser(id: $id,
                        data:{
                            level: $level
                            user: $user
                            currentExperience: $currentExperience
                            challengesCompleted: $challengesCompleted
                        }){
                            _id
                            user
                            level
                            currentExperience
                            challengesCompleted
                        }
                    }
                `;
                const data = await graphQLClient.request(mutation,{id,user,level,challengesCompleted,currentExperience});
                return res.json(data);
            }catch(error){
                return res.status(500).json(error);
            }
        }
        default:{
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
    }
}