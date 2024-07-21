fetch('banner.html')
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
     
async function getLastUpdateDate(keyWord) {
  const projectId = '57722436';
  const response = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/commits`)

  const data = await response.json();
  const result = extractString(data, keyWord);

  const outputDiv = document.getElementById('lastUpdateDate');
  outputDiv.textContent = `Dernière Mise à Jour : ${result}`;

}

function extractString(data, keyWord) {

  for (let h = 0; h < Object.getOwnPropertyNames(data).length; h++) {
    const key = Object.keys(data)[h];  
    const entry = data[key]; 
    message =  entry.message

    var j = 0;
    var k = 0;
    let isOnFirstLetter = true;
    for (let i = 0; i < message.length; i++) {
      if(j < keyWord.length){
        if(message[i] == keyWord[j] && (i == k + 1 || isOnFirstLetter)){
          isOnFirstLetter = false;
          j++;
          k = i;
        }
        else{
          j=0;
          isOnFirstLetter = true;
        }
      }
      else{
        let dateArray = entry.committed_date.substring(0, 10).split('-');
        return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
      }
    }
  }
}

// Extraire le nom du fichier de l'URL
let fileName = window.location.pathname.split('/').pop();
if(fileName == "geometry-death.html"){
  getLastUpdateDate("jeu");
}
else if(fileName == "metronome.html"){
  getLastUpdateDate("Metronome");
}
else if(fileName == "sorting.html"){
  getLastUpdateDate("Sorting");
}

