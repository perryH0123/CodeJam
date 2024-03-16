import { useEffect, useState } from "react";
import Team from "../Models/Team";

const Teams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            let rawTeams: Team[] = [];
            try {
                const payload = await fetch("https://script.google.com/macros/s/14rRnSaW8tqm7KOWt_XF7QyrhqKCT8ZGyeP1dMHRAieDsZ-Jr-V2eQ-jH/exec", {
                    method: "GET",
                });
                rawTeams = await payload.json() as Team[];
            } catch (e) {
            } finally{
                setTeams(rawTeams);
                if(rawTeams.length){
                    window.localStorage.setItem("teams", JSON.stringify(rawTeams));
                    window.localStorage.setItem("teamsLastUpdated", new Date().valueOf().toString())
                }
            }

        }
        if(Date.now()-parseInt(window.localStorage.getItem("teamsLastUpdated") ?? "0") > 60000){
            fetchData()
        } else {
            setTeams(JSON.parse(window.localStorage.getItem("teams") ?? "[]"))
        }
    },[])

    return (<section id="teams">
        <h2>Teams</h2>
        <div className="scrollableTable">
            <table id="teamtable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Members</th>
                    </tr>
                </thead>
                <tbody>
                    {!teams.length && <tr>
                        <td colSpan={2} style={{textAlign: "center"}}>Loading...</td>    
                    </tr>}
                    {teams.map(team => (
                        <tr key={team.name+team.members.join("_")}>
                            <td>{team.name}</td>
                            <td>{team.members.join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>)
}

export default Teams;