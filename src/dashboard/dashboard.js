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

async function loadData() {
    //const res = await fetch('/dashboard/api');
    const res = await fetch('https://nerter.fr/dashboard/api/');
    const data = await res.json();

    var seconds = parseFloat(data.uptime.split(" ")[0]);
    document.getElementById("uptime").innerText ="Uptime : " + getUpTime(seconds);
    document.getElementById("temperature").innerText =`Temperature : ${data.temp / 1000}°C`;
    document.getElementById("cpu").innerText =`CPU : ${parseFloat(data.cpu).toFixed(2)}%`;
    var ram = data.ram.split(" ");
    document.getElementById("ram").innerText =`RAM : ${parseFloat(ram[1] / 1000).toFixed(2)} / ${parseFloat(ram[0] / 1000).toFixed(2)} Go`;
}

setInterval(loadData, 10000);
loadData();