import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import CardPerson from "./CardPerson";

export function ListCards(){
    const { usersRegistered } = useContext(ChallengesContext);
    return(
        <div>
            {
                usersRegistered.length > 0 ?
                usersRegistered.map((user , index) => (
                    <CardPerson
                    key={index}
                    position={index + 1}
                    photo={user.photo}
                    name={user.user}
                    level={user.level}
                    challenges={user.challengesCompleted}
                    xp={user.totalExp}
                    />
                ))
                : null
            }
        </div>
    )
}