
function joinRoom(){
    //look for the input and redirect the user to the pong frontend url with the right parameters
    var roomId = -1;
    let inputRoomId = document.getElementById("roomIdInput").value;
    if(inputRoomId != "" && !isNaN(inputRoomId)){
    roomId = inputRoomId
    }
    window.open(`web/pong/index.html?room=${roomId}`, "_blank");
}

async function createRoomList(){
    //this function creates the room list by fetching the pong api and adding dynamic html to po.html

    const roomList = document.getElementById("room-list")


    //fetch the api and get data
    const res = await fetch('https://nerter.fr/pong/api/');
    const data = await res.json();

    //clear room list after fetching so there is not an offset where no list is visible
    roomList.innerHTML =""


    //travel data room
    for(const key in data.rooms){
        const room = data.rooms[key]
        console.log(room.id, room.playerNum)

        //determine the color and the active status of the future room item that will be created
        var playerNumColor = ""
        var buttonActive = ""
        if(room.playerNum == 1){
            playerNumColor = "green"
        }
        else if(room.playerNum == 2){
            playerNumColor = "red"
            buttonActive = "disabled"
        }

        //create room item, with the right informations
        const roomItemDiv = document.createElement("div");
        roomItemDiv.classList.add("room-item")
        roomItemDiv.innerHTML = `
            <ul>
                <li>Salle n°${room.id}</li>
                <li>Joueurs : <span id="${playerNumColor}">${room.playerNum}/2</span></li>
            </ul>
            <button ${buttonActive} class="project-button mini" onclick="joinRoom()">Rejoindre</button>
        `
        roomList.appendChild(roomItemDiv)
    }
    
}
setInterval(createRoomList, 5000)
createRoomList()