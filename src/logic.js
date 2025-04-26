fetch('/src/banner.html')
.then(response => response.text())  
.then(data => {
  document.getElementById('banner-container').innerHTML = data;
});

function downloadFile(filePath) {
    var link = document.createElement('a');
    link.href = filePath; 
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
}
     
async function getLastUpdateDate(projectId) {
  const response = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/commits`)

  const data = await response.json();
  const date = extractDate(data);

  const outputDiv = document.getElementById('lastUpdateDate');
  outputDiv.textContent = `Dernière Mise à Jour : ${date}`;
}

function extractDate(data) {

  const entry = data[0]; 
  message =  entry.message
  let dateArray = entry.committed_date.substring(0, 10).split('-');
  return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
  
}

let fileName = window.location.pathname.split('/').pop();
if(fileName == "shape-survivor.html"){
  getLastUpdateDate('61285052');
}
else if(fileName == "metronome.html"){
  getLastUpdateDate('61286686');
}
else if(fileName == "sorting.html"){
  getLastUpdateDate('61286493');
}
else if(fileName == "mandelbrot.html"){
  getLastUpdateDate('62698256');
}
else if(fileName == "mazeGenerator.html"){
  getLastUpdateDate('66064852');
}


