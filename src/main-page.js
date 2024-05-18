function downloadFile(filePath) {
    var link = document.createElement('a');
    link.href = filePath; 
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
}

