


function joinRoom(){
    //look for the input and redirect the user to the pong frontend url with the right parameters
    var roomId = -1;
    let inputRoomId = document.getElementById("roomIdInput").value;
    inputRoomId = Number(inputRoomId)
    if(inputRoomId != "" && !isNaN(inputRoomId) && Number.isInteger(inputRoomId) && inputRoomId > 0 && inputRoomId < 1000){
        roomId = inputRoomId
    }
    openUrl(roomId)
}

function openUrl(roomId){
    window.open(`web/pong/index.html?room=${roomId}`, "_blank");
}

function addNotCreatedRooms(rooms, n){
    //adds n empty rooms to the list that returns (roomToDisplay)

    //make a copy of rooms
    var roomsToDisplay =  Object.assign({}, rooms)
    maxId = -1
    for(const key in rooms){
        var currentId = rooms[key].id
        if( currentId > maxId){
            maxId = currentId
        }
    }
    for (let i = 0; i < n ; i++){
        let currentId = maxId + 1 + i
        roomsToDisplay[currentId] = {
            id : currentId,
            playerNum : 0
        }
    }

    return roomsToDisplay
}


async function createRoomList(){
    //this function creates the room list by fetching the pong api and adding dynamic html to po.html

    const roomList = document.getElementById("room-list")


    //fetch the api and get data
    const res = await fetch('https://nerter.fr/pong/api/');
    const data = await res.json();

    //clear room list after fetching so there is not an offset where no list is visible
    roomList.innerHTML =""

    
    var roomsToDisplay = addNotCreatedRooms(data.rooms, 1)
    //travel data room
    for(const key in roomsToDisplay){
        const room = roomsToDisplay[key]

        //determine the color and the active status of the future room item that will be created
        var playerNumColor = ""
        var buttonActive = ""
        
        if(room.playerNum == 2){
            playerNumColor = "red"
            buttonActive = "disabled"
        }
        else if (room.playerNum == 1){
            playerNumColor = "green"
        }

        //create room item, with the right informations
        const roomItemDiv = document.createElement("div");
        roomItemDiv.classList.add("room-item")
        roomItemDiv.innerHTML = `
            <ul>
                <li>Salle n°${room.id}</li>
                <li>Joueurs : <span id="${playerNumColor}">${room.playerNum}/2</span></li>
            </ul>
            <button ${buttonActive} class="project-button mini" onclick="openUrl(${room.id})">Rejoindre</button>
        `
        roomList.appendChild(roomItemDiv)
    }
    
}
setInterval(createRoomList, 5000)
createRoomList()