import { apiScore, userDto } from "./server/src/dtos";

var selectedDifficulty : number = 2;


function createElt(tag : string, className: string = "", innerHTML: string = "") {
    const elt = document.createElement(tag);
    if (className) elt.className = className;
    if (innerHTML) elt.innerHTML = innerHTML;
    return elt;
}

async function fetchData(){
    const response = await fetch("https://survivor.nerter.fr/api");
    if(!response.ok){
        return false;
    }
    const result = await response.json();
    return result;
}

function createScoreBoard(data: apiScore){
    const scoreboardDiv = document.getElementById("scoreboard");
    const scoreboardBlocDiv = document.getElementById("scoreboardBloc");
    if(scoreboardDiv == null || scoreboardBlocDiv == null){
        return;
    }
    const tabContainer = document.getElementById("tabContainer");
    if(tabContainer){
        tabContainer.innerHTML = "";
        for(const difficulty of data.difficulties){
            const tab = createElt("div", "tab", difficulty.label);
            tab.setAttribute("id", difficulty.id.toString());
            tabContainer?.append(tab)
            if(difficulty.id == selectedDifficulty){
                tab.classList.add("selected");
                scoreboardBlocDiv.dataset.theme = selectedDifficulty.toString();
            }
            tab.addEventListener("click", () =>{
                selectedDifficulty = parseInt(tab.id);
                for(const otherTab of tabContainer.children){
                    otherTab.classList.remove("selected");
                }
                scoreboardBlocDiv.dataset.theme = selectedDifficulty.toString();
                tab.classList.add("selected");
                refreshScoarboardTable(data);
            });
        }
    }
    
    refreshScoarboardTable(data);
}

function getPseudo(uid : string, users: userDto[]) : string | null{
    for(const user of users){
        if(user.uid == uid){
            return user.pseudo;
        }
    }
    return null;
}

function refreshScoarboardTable(data: apiScore) : void{

    const pseudoContent = document.getElementById("pseudoContent");
    const scoreContent = document.getElementById("scoreContent");
    const dateContent = document.getElementById("dateContent");
    if(pseudoContent == null || scoreContent == null || dateContent == null){
        return;
    }
    pseudoContent.innerHTML = "";
    scoreContent.innerHTML = "";
    dateContent.innerHTML = "";

    data.scores.sort((a, b) =>{
        return b.max_score - a.max_score
    })
    for(const score of data.scores){
        if(score.difficulty_id == selectedDifficulty){
            const pseudo = getPseudo(score.user_uid, data.users)
            if(!pseudo){
                continue
            }
            pseudoContent.appendChild(createElt("span", "", pseudo));
            scoreContent.appendChild(createElt("span", "", score.max_score.toString()));
            dateContent.appendChild(createElt("span", "", new Date(score.updated_at).toLocaleDateString("fr-FR")));
        }
    }

}
async function main(){
    const data = await fetchData();
    if(!data){
        return;
    }
    console.info(data);
    createScoreBoard(data);
}
main();