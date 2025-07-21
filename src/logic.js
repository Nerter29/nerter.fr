//----------BANNER-----------

fetch('/misc/banner.html')
.then(response => response.text())  
.then(data => {
  document.getElementById('banner-container').innerHTML = data;
});


//----------DESCRIPTION-----------

setDescriptionContent('/assets/images/ss/description.txt', 'ss');
setDescriptionContent('/assets/images/sad/description.txt', 'sad');
setDescriptionContent('/assets/images/ps/description.txt', 'ps');
setDescriptionContent('/assets/images/mp/description.txt', 'mp');
setDescriptionContent('/assets/images/mg/description.txt', 'mg');
setDescriptionContent('/assets/images/mv/description.txt', 'mv');
setDescriptionContent('/assets/images/fc/description.txt', 'fc');


function setDescriptionContent(descriptionPath, id){ //set project description from a description file
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


//----------LAST UPDATE DATE-----------

let fileName = window.location.pathname.split('/').pop();

if(fileName == "ss.html"){setLastUpdateDate('61285052');}
else if(fileName == "mp.html"){setLastUpdateDate('61286686');}
else if(fileName == "sad.html"){setLastUpdateDate('61286493');}
else if(fileName == "mv.html"){setLastUpdateDate('62698256');}
else if(fileName == "mg.html"){setLastUpdateDate('66064852');}
else if(fileName == "ps.html"){setLastUpdateDate('69538029');}
else if(fileName == "fc.html"){setLastUpdateDate('71778732');}


     
async function setLastUpdateDate(projectId) { // set the date of the last gitlab commit from a project 
  const response = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/commits`)

  const commit = await response.json();
  const date = getCommitDate(commit);

  const outputDiv = document.getElementById('lastUpdateDate');
  outputDiv.textContent = `Dernière Mise à Jour : ${date}`;
}

function getCommitDate(data) {//extract the date from the last commit of commits.json
  const entry = data[0]; //last commit
  let dateArray = entry.committed_date.substring(0, 10).split('-');
  return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]; // jj/mm/aaaa french format lets go
  
}


