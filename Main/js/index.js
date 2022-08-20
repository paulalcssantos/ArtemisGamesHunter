/***Variáveis***/
const genres = [];
var genresConcat = "";
const button = document.getElementById("btnSubmit");
const gameName = document.getElementById("gameName");
const gameLink = document.getElementById("gameLink");
const gameImage = document.getElementById("imgStart");
const ram = document.getElementById("ram");

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '94c5c74304msh6b060db7c2a4341p1f01ecjsnddcc11168a4b',
        'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
    }
};

/***Funções***/

function selectCheckbox(){
    let genres = [];
    let checkboxes = document.querySelectorAll("input[name=genre]:checked");    

    checkboxes.forEach((checkbox) => {
        genres.push(checkbox.value)
    });

    genresConcat = genres.join(".");
};

function selectPlatform(){
    let pc = document.getElementById("pc");  
    let browser = document.getElementById("browser");  
    
    if(pc.checked){
        genresConcat = genresConcat.concat("&platform=pc");
    }
    else if(browser.checked){
        genresConcat = genresConcat.concat("&platform=browser");
    }
    console.log(genresConcat);
};


function selectGame(bit){  
    selectCheckbox();
    selectPlatform();
 
    if(bit){
        GetData(genresConcat);
    }
    else{
        gameImage.src = "../img/Logotipo-Transparente.png";
        gameImage.style.width = "360px";
        gameName.innerHTML = "";
        gameLink.innerHTML = "";
    }
};


function GetData(param){
            
    fetch("https://free-to-play-games-database.p.rapidapi.com/api/filter?tag="+param, options)
            .then(response => response.json())
            .then(response => {
                const values = Object.values(response)
                const randomValue = values[parseInt(Math.random() * values.length)];

                if(randomValue.title == undefined){
                    gameName.innerHTML = "Não foram encontrados jogos com estes filtros, tente novamente!";
                    gameName.style.fontSize = "large";
                    gameLink.innerHTML = "";
                    gameImage.src = "../img/warning.png";
                    gameImage.style.width = "160px";
                }
                else{
                    if(ram.value.length == 0){
                        gameName.innerHTML = randomValue.title;
                        gameLink.innerHTML = randomValue.game_url;
                        gameLink.href = randomValue.game_url;
                        gameImage.src = randomValue.thumbnail;
                        gameImage.style.width = "460px";
                    }
                    else{
                        verifyRam(randomValue);
                    }   
                }  
            })
            .catch(err => console.error(err));
};

function loadGame(){
    if(genresConcat.length == 0){
        alert("Selecione pelo menos um gênero!");
        selectGame(false);
    }
    else{
        selectGame(true);;
    }
};

function verifyRam(randomValue){
    const opt = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'cac17fa31bmshff34043afa7e34ep18a2f1jsn1c4b67302fd4',
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    
    fetch('https://free-to-play-games-database.p.rapidapi.com/api/game?id='+randomValue.id, opt)
        .then(response => response.json())
        .then(response => {
            
            if("minimum_system_requirements" in response){
                const values = response.minimum_system_requirements;

                if(values.memory != null){

                    /*Verifica se na tag "memory" a capacidade está em GB*/
                    const memoryGb = values.memory.match(/\gb/i);

                    if(memoryGb != null){
                        if(memoryGb.input[0].match(/\d/g) <= ram.value){
                            gameName.innerHTML = randomValue.title;
                            gameLink.innerHTML = randomValue.game_url;
                            gameLink.href = randomValue.game_url;
                            gameImage.src = randomValue.thumbnail;
                            gameImage.style.width = "460px";
                        }
                    }
                    else{
                        gameName.innerHTML = randomValue.title;
                        gameLink.innerHTML = randomValue.game_url;
                        gameLink.href = randomValue.game_url;
                        gameImage.src = randomValue.thumbnail;
                        gameImage.style.width = "460px";
                    }       
                }                          
            }
            else{
                gameName.innerHTML = randomValue.title;
                gameLink.innerHTML = randomValue.game_url;
                gameLink.href = randomValue.game_url;
                gameImage.src = randomValue.thumbnail;
                gameImage.style.width = "460px";
            }
            
        })
        .catch(err => console.error(err));        
};

function cancelFilters(){
    window.location.reload();
};