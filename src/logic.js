fetch('/misc/banner.html')
.then(response => response.text())  
.then(data => {
  document.getElementById('banner-container').innerHTML = data;
});


setDescriptionContent('/assets/images/ss/description.txt', 'ss');
setDescriptionContent('/assets/images/sad/description.txt', 'sad');
setDescriptionContent('/assets/images/ps/description.txt', 'ps');
setDescriptionContent('/assets/images/mp/description.txt', 'mp');
setDescriptionContent('/assets/images/mg/description.txt', 'mg');
setDescriptionContent('/assets/images/mv/description.txt', 'mv');



function setDescriptionContent(descriptionPath, id){
  fetch(descriptionPath)
  .then(response => {
    if (!response.ok) {
      throw new Error('Fichier introuvable');
    }
    return response.text();
  })
  .then(data => {
    if(document.getElementById(id))
    document.getElementById(id).textContent = data;
  })
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
if(fileName == "ss.html"){
  getLastUpdateDate('61285052');
}
else if(fileName == "mp.html"){
  getLastUpdateDate('61286686');
}
else if(fileName == "sad.html"){
  getLastUpdateDate('61286493');
}
else if(fileName == "mv.html"){
  getLastUpdateDate('62698256');
}
else if(fileName == "mg.html"){
  getLastUpdateDate('66064852');
}
else if(fileName == "ps.html"){
  getLastUpdateDate('69538029');
}


