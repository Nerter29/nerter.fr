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
setDescriptionContent('/assets/images/miv/description.txt', 'miv');


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

if(fileName == "ss.html"){setLastUpdateDate('shape-survivor');}
else if(fileName == "mp.html"){setLastUpdateDate('metronome-programmable');}
else if(fileName == "sad.html"){setLastUpdateDate('sorting-algorithm-deluxe');}
else if(fileName == "mv.html"){setLastUpdateDate('mandelbrot-visualizer');}
else if(fileName == "mg.html"){setLastUpdateDate('maze-generator');}
else if(fileName == "ps.html"){setLastUpdateDate('particles-simulator');}
else if(fileName == "fc.html"){setLastUpdateDate('fireworks-cli');}
else if(fileName == "miv.html"){setLastUpdateDate('mic-viz');}



     
async function setLastUpdateDate(repoName) {
  const response = await fetch(`https://api.github.com/repos/Nerter29/${repoName}/commits`);

  if (!response.ok) {
    console.error('Erreur lors de la récupération des commits GitHub');
    return;
  }

  const commits = await response.json();

  //we want to avoid commits that are edit of readmes
  let commit_num =0
  for (let i = 0; i < commits.length; i++){
    if(!commits[i].commit.message.toLowerCase().includes("readme")){
      commit_num = i
      break
    }
  }

  const date = getCommitDate(commits, commit_num);
  const outputDiv = document.getElementById('lastUpdateDate');
  outputDiv.textContent = `Dernière Mise à Jour : ${date}`;
}

function getCommitDate(data, commit_num) {
  const entry = data[commit_num];
  const dateISO = entry.commit.committer.date;

  const dateArray = dateISO.substring(0, 10).split('-');
  return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

