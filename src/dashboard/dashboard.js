function getUpTime(seconds){
    seconds = Math.floor(seconds);

    var days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60)
    var hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60)
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;


    return `${days}d ${hours}h ${minutes}m ${seconds}s `
}

function getProgressBar(proportion, length){
    const blocks = ["", "▏","▎","▍","▌","▋","▊","▉","█"];
    const emptyChar = "░"
    const fullChar = "█"

    var bar = ""
    var fullness = proportion * length
    var fullBlocksNum = Math.floor(fullness)
    for(var i = 0; i < fullBlocksNum; i++){
        bar += fullChar;
    }
    blockIndex = Math.floor((fullness - fullBlocksNum) * blocks.length);
    bar += blocks[blockIndex];
    for(var i = 0; i < length - (fullBlocksNum + 1); i++){
        bar += emptyChar;
    }

    return bar
}

async function loadData() {
    //this function fetches the dashboard api and extract the data from the raw json file to the html components


    //const res = await fetch('/dashboard/api');
    const res = await fetch('https://nerter.fr/dashboard/api/');
    const data = await res.json();

    //uptime
    var seconds = parseFloat(data.uptime.split(" ")[0]);
    document.getElementById("uptime").innerHTML ="<strong>Uptime :</strong> " + getUpTime(seconds);

    //temperature
    document.getElementById("temperature").innerHTML =`<strong>Temperature :</strong> ${data.temp / 1000}°C`;

    //cpu
    var cpuValue = parseFloat(data.cpu).toFixed(2);
    document.getElementById("cpu").innerHTML =`<strong>CPU :</strong> ${cpuValue}%`;

    //ram
    var ram = data.ram.split(" ");
    document.getElementById("ram").innerHTML =`<strong>RAM :</strong> ${parseFloat(ram[1] / 1000).toFixed(2)} / ${parseFloat(ram[0] / 1000).toFixed(2)} Go`;

    //docker : we get the docker data of the json file and compare it with the desired services 
    var dockerServices = data.docker.split("\n");
    var desiredServices = ["nerter.fr", "dashboard", "pong"];

    //to have a display name different from the docker container name, for esthetic purpose
    var serviceNamesToDisplay = ["Nerter.fr", "Dashboard-API", "Pong"];


    //get the names and status of the docker services
    var dockerNames = [];
    var dockerStatus = [];
    for(var i = 0; i < dockerServices.length; i++){
        var dockerService = dockerServices[i].split("|");
        dockerNames.push(dockerService[0]);
        dockerStatus.push(dockerService[1]);
    }
    
    var servicesUl = document.getElementById("services-list")
    //clear the ul
    while (servicesUl.firstChild) {
        servicesUl.removeChild(servicesUl.firstChild);
    }
    //we compare the desiredServices with the docker response that we have
    for(var i = 0; i < desiredServices.length; i++){
        var currentDesiredService = desiredServices[i];
        var currentLi = document.createElement("li");
        var liText = "<strong>" +serviceNamesToDisplay[i] + " :</strong> ";
    
        //we search for the current desired service in the docker Names
        //if we don't find it (dockerIndex = -1), we consider it to be down, because we have no info
        var dockerIndex = dockerNames.indexOf(currentDesiredService)
        if(dockerIndex != -1){
            liText += dockerStatus[dockerIndex];
            //only if the 2 first letters of the status are "up", we put the class up, in other cases, it will be "down"
            //it allows to put a color to the element with css marker
            if(String(dockerStatus).substring(0, 2) == "Up"){
                currentLi.classList.add("up");
            }
            else{
                currentLi.classList.add("down");
            }
            
        }
        else{
            liText += "Down";
            currentLi.classList.add("down");
        }
        currentLi.innerHTML = liText;

        servicesUl.append(currentLi);
    }
}

setInterval(loadData, 5000);
loadData();