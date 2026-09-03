async function fetchData(){
    const response = await fetch("https://survivor.nerter.fr/api");
    if(!response.ok){
        return false;
    }
    const result = await response.json();
    return result;
}

async function main(){
    const data = await fetchData();
    if(data){
        console.info(data);
    }
}
main();