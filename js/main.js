// *******************IMPORTENT FIX COMMENTS BEFORE PUSHING THE CODE TO GITHUB*****************************************


//this button fired up the function searchDaGame 
document.getElementById("btn").addEventListener("click",searchDaGame);

const gameList =document.getElementById("game-list")
//this looks if there is a localStorage and if there is we devide the length by 4 because we have 4 proprieties in local Storage and we fired up the loadSavedgames function
let num=localStorage.length>0?localStorage.length/4:0;

num!==0?window.addEventListener('DOMContentLoaded', loadSavedGames):console.log("some error in lclstorage");

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
;
// this func use the steam api to get and show information about the game searched  and it added to the localstorage
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

/////////////////////////////////2nd version ////////////////////////////////////////

//todo list
//1) make f1 schedule with the rest of the season also its automatically working with next seasson @@rest we can even devlope it even more and show the drivers standing and the current session and lot of other stuffs

//2) a cool clock that shows time and a pomodoro timer 
//3)a classic featuristic todo list

fetch("https://api.jolpi.ca/ergast/f1/2025/races/")
.then(res=>res.json())
.then(data=>{
  //raceList is a ul in our html that we will add to it the remaining races and sessions
  const raceList = document.getElementById('race-List')
  //this conditional that shows only races remaining in the saison
  const upcomingEvents = data.MRData.RaceTable.Races.filter((x)=>x.date>=getFormattedDateUTC())
  console.log(upcomingEvents.date);
  
  //create an li for each Race and give it unique id to each race and add it to the raceList
  upcomingEvents.forEach(race => {
    const li= document.createElement("li")
    li.id = `race-${race.round}`; // Unique ID for each race
    raceList.appendChild(li);
  });
  //interval that updates each race each second
  setInterval(() => {
    upcomingEvents.forEach(race=>{
  updateRaceCountDown(race)
})
}, 1000);
})


// Helper function to convert milliseconds to countdown parts(days,minutes,seconds)
const now = new Date();
function calculateCountdown(diffTime) {
  const MS_PER_SEC = 1000;
  const MS_PER_MIN = MS_PER_SEC * 60;
  const MS_PER_HOUR = MS_PER_MIN * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  const diff = Math.max(0, diffTime);
  const days = Math.floor(diff / MS_PER_DAY);
  const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MIN);
  const seconds = Math.floor((diff % MS_PER_MIN) / MS_PER_SEC);

  return { days, hours, minutes, seconds };
}

// Unified function to get all countdowns for main event and sessions
function getAllCountdowns(event) {
  // Get main event Date & time
  const mainEventDateTime = new Date(`${event.date}T${event.time}`);

  // Get all session times of the other session in the event
  const sessions = getSessionTimes(event);

  // Create array of all event times (main event + sessions)
  const allTimes = [
    { type: 'Main Event', dateTime: mainEventDateTime }
  ];

  sessions.forEach(session => {
    allTimes.push({
      type: session.type,
      dateTime: new Date(`${session.date}T${session.time}`)
    });
  });

  // Calculate countdowns for allTimes
  const countdowns = allTimes.map(item => {
    const diffTime = item.dateTime - now;
    const countdown = calculateCountdown(diffTime);
    return { type: item.type, countdown };
  });

  return countdowns;
}

// main func that get invoked every second and updates our app
function updateRaceCountDown(event) {
  const countdowns = getAllCountdowns(event);
  const li = document.getElementById(`race-${event.round}`);

  // Build HTML string for all countdowns even already finished seassions
  const countdownHtml = countdowns.map(({type, countdown}) =>{ 
    console.log(countdown.days===0);
    //conditionary to check if the session is passed or not
   if (countdown.days===0&&countdown.hours===0&&countdown.minutes===0&&countdown.seconds===0) {
   return ` <h4>${type}</h4>
    <h1>Already passed</h1>`
  }else{
return`
    <h4>${type}</h4>
    <h1>${countdown.days} days ${countdown.hours} hours ${countdown.minutes} minutes ${countdown.seconds} seconds</h1>
  `
  }
}).join("");

  li.innerHTML = `
    <h4>Round: ${event.round}</h4>
    <h3>The ${event.raceName}</h3>
    ${countdownHtml}
  `;
}

  
// }
//this function return the data as an array of objects used to sort and organize the data coming from the api as it sort of what type the session is
function getSessionTimes(race) {
  return [
    { type: "Practice 1", date: race.FirstPractice.date, time: race.FirstPractice.time },
    { type: "Practice 2", date: race.SecondPractice?.date, time: race.SecondPractice?.time },
    { type: "Practice 3", date: race.ThirdPractice?.date, time: race.ThirdPractice?.time }, // Optional (not all races have FP3)
    { type: "SprintQualifying", date: race.SprintQualifying?.date, time: race.SprintQualifying?.time }, // Optional
    { type: "Sprint", date: race.Sprint?.date, time: race.Sprint?.time }, // Optional
    { type: "Qualifying", date: race.Qualifying.date, time: race.Qualifying.time },
  ].filter(session => session.date); // Remove undefined sessions (like missing FP3/Sprint)
}

//current date func
function getFormattedDateUTC() {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Outputs in YYYY-MM-DD format
}
/////////////////////////////////// Da pomodoro//////////////////////////////////
class TimerHost {
  constructor() {
    this.workTime=30 * 5
    this.shortBreak=30 * 5
    this.longBreak=30 * 5
    this.currentTime=30 * 5
    this.isRunning=false
    this.isWorkSession=30 * 5
    this.workTime=30 * 5
  }
}
// *******************IMPORTENT FIX COMMENTS BEFORE PUSHING THE CODE TO GITHUB****************************************