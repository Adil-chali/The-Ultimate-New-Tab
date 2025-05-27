document.getElementById("btn").addEventListener("click",searchDaGame)
const ul =document.querySelector("ul")
let num=localStorage.length>0?localStorage.length/4:0
num!==0?window.addEventListener('DOMContentLoaded', loadSavedGames):console.log("some error in lclstorage");
;

function searchDaGame() {
    let gameName= encodeURIComponent(document.getElementById("searchedGame").value);
      if (!gameName) return;    
    fetch(`http://localhost:3000/api/steam-search?term=${gameName}`)
      .then(res => res.json())
      .then(data => {
        //getting data from the api
        const gama=data.items[0]
        if (!gama) return;
        //checking if the game is free or not
        const price = gama?.price?.final ?? "free";
        const priceFormated= typeof price==="number" ?`$${(price / 100).toFixed(2)}` : price;
        

        //add our data to our localStorage
        localStorage.setItem(`img${num}`,gama.tiny_image)
        localStorage.setItem(`name${num}`,gama.name)
        localStorage.setItem(`gameID${num}`,gama.id)
        localStorage.setItem(`price${num}`,priceFormated)

        // Add searched game to UI
      addGameToUI(gama, priceFormated);

      }) 
      .catch(err => console.error(`error: ${err}`));
    }
    
    //add our game to the ui
  function addGameToUI(gama,priceFormated) {
        const li=document.createElement("li")
        li.className = "game-card"
        li.innerHTML=`
        <a href="https://store.steampowered.com/app/${gama.id}">
        <h3>${gama.name}</h3>
        <img src="${gama.tiny_image}" alt="${gama.name}">
        <h1>${priceFormated}</h1>
        </a>`;
        ul.appendChild(li)
        num++;
       }
       
       //load stuff from the DOM
       function loadSavedGames() {
         for (let i = 1; i <=num; i++) {
           const li=document.createElement("li")
           li.classList="game-card"
            li.innerHTML=`
               <a href=https://store.steampowered.com/app/${localStorage.getItem(`gameID${i-1}`)}>
              <h3>${localStorage.getItem(`name${i-1}`)}</h3>
              <img src="${localStorage.getItem(`img${i-1}`)}" alt=">${localStorage.getItem(`name${i-1}`)}">
              <h1>${localStorage.getItem(`price${i-1}`)}</h1>
              </a>`;
              ul.appendChild(li)
              
        }
      }

