document.getElementById("btn").addEventListener("click",searchDaGame)
const gameList =document.getElementById("game-list")
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
        gameList.appendChild(li)
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
              gameList.appendChild(li)
              
        }
      }

/////////////////////////////////2nd version ////////////////////////////////////////

//todo list
//1) make f1 schedule with the rest of the season also its automatically working with next seasson @@rest we can even devlope it even more and show the drivers standing and the current session and lot of other stuffs

//2) a cool clock that shows time and a pomodoro timer 
//3)a classic featuristic todo list

fetch("https://api.jolpi.ca/ergast/f1/2025/races/")
.then(res=>res.json())
.then(data=>{
  const raceList = document.getElementById('race-List')
  const upcomingEvents = data.MRData.RaceTable.Races.filter((x)=>x.date>=getFormattedDateUTC())
  console.log(upcomingEvents);
  
  //create an LU for each Race and give it an id
  upcomingEvents.forEach(race => {
    const li= document.createElement("li")
    li.id = `race-${race.round}`; // Unique ID for each race
    raceList.appendChild(li);
  });
  //interval that updates each race each second
  setInterval(() => {
    upcomingEvents.forEach(race=>{
  upadateRaceCountDown(race)
})
}, 1000);
})

// func thatcount how many days second hours .. left for the event
function upadateRaceCountDown(biggy) { 
  function lasqDlmasq(zmamra) {
    
   return getSessionTimes(zmamra).map(session=>{
      const sessionDateTime=new Date(`${session.date}T${session.time}`) 
      const diffTime= sessionDateTime-new Date()
      const days= Math.floor(diffTime/(1000*60*60*24))
      const hours= Math.floor(diffTime%(1000*60*60*24)/(1000*60*60))
      const minutes= Math.floor(diffTime%(1000*60*60)/(1000*60))
      const seconds= Math.floor(diffTime%(1000*60)/1000)      
    return `<h4>${session.type}</h4>
    <h1> ${days} days  ${hours} hours ${minutes} minutes  ${seconds} seconds </h1>`
    
    
  }).join("")
} 
  const sessionDateTime=new Date(`${biggy.date}T${biggy.time}`) 
  const diffTime= sessionDateTime-new Date()
  const days= Math.floor(diffTime/(1000*60*60*24))
  const hours= Math.floor(diffTime%(1000*60*60*24)/(1000*60*60))
  const minutes= Math.floor(diffTime%(1000*60*60)/(1000*60))
  const seconds= Math.floor(diffTime%(1000*60)/1000)
  // console.log(lasqDlmasq(biggy));
  
  const li=document.getElementById(`race-${biggy.round}`)
  li.innerHTML=`
  <h4>Round: ${biggy.round}</h4>
  <h3>The ${biggy.raceName}</h3>
  <h1> ${days} days  ${hours} hours ${minutes} minutes  ${seconds} seconds </h1>
  ${lasqDlmasq(biggy)}
  `
  
}
function getSessionTimes(race) {
  return [
    { type: "Practice 1", date: race.FirstPractice.date, time: race.FirstPractice.time },
    { type: "Practice 2", date: race.SecondPractice?.date, time: race.SecondPractice?.time },
    { type: "Practice 3", date: race.ThirdPractice?.date, time: race.ThirdPractice?.time }, // Optional (not all races have FP3)
    { type: "Qualifying", date: race.Qualifying.date, time: race.Qualifying.time },
    { type: "Sprint", date: race.Sprint?.date, time: race.Sprint?.time }, // Optional
    { type: "SprintQualifying", date: race.SprintQualifying?.date, time: race.SprintQualifying?.time }, // Optional
    { type: "Race", date: race.date, time: race.time }
  ].filter(session => session.date); // Remove undefined sessions (like missing FP3/Sprint)
}

//current date func
function getFormattedDateUTC() {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Outputs in YYYY-MM-DD format
}