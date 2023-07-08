let timeoutId;
let endTime;

import gambareAudio from "url:./assests/gambare.mp3";
import onichanAudio from "url:./assests/onichan.mp3";
import bakaAudio from "url:./assests/baka.mp3";

const start_alert = new Audio(gambareAudio);
const end_alert = new Audio(onichanAudio);
const reset_alert = new Audio(bakaAudio);

main();

let microQ = Promise.prototype.then.bind(Promise.resolve());

function main() {
  window.addEventListener("focus", () => {
    toast("Loading next background");
    microQ(() => randomizeBackground());
  });

  const focusBtn = document.getElementById("focuss");
  const recussBtn = document.getElementById("recuss");
  const breakBtn = document.getElementById("break");

  focusBtn.addEventListener("click", () => {
    pomodoro(25);
  });

  recussBtn.addEventListener("click", () => {
    resetTimer();
  });

  breakBtn.addEventListener("click", () => {
    takeBreak(5);
  });
}

//user input for the time
// function startpomodoro(){
//     let durationInput = document.getElementById("duration");
//     let duration = parseInt(durationInput.value);
//     if(!NaN(duration) && duration > 0){
//         pomodoro(duration);
//     }
//     else{
//         alert("Enter valid number like 69");
//     }
// }

function pomodoro(mins) {
  start_alert.play();
  clearTimeout(timeoutId); // Clear any previously scheduled updates
  let duration = mins * 60 * 1000; // Duration in milliseconds
  endTime = new Date().getTime() + duration;
  updateTimerDisplay();
}

function takeBreak(mins) {
  clearTimeout(timeoutId); // Clear any previously scheduled updates
  let duration = mins * 60 * 1000; // Duration in milliseconds
  endTime = new Date().getTime() + duration;
  updateTimerDisplay();
}

function resetTimer() {
  reset_alert.play();
  clearTimeout(timeoutId); // Clear any previously scheduled updates
  endTime = null;
  let timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = "00:00";
}

function updateTimerDisplay() {
  if (endTime !== null) {
    let now = new Date().getTime();
    let remainingTime = endTime - now;

    if (remainingTime >= 0) {
      let remainingSeconds = Math.floor(remainingTime / 1000);
      let minutes = Math.floor(remainingSeconds / 60);
      let seconds = remainingSeconds % 60;
      let timerDisplay = document.getElementById("timer");
      timerDisplay.textContent =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

      // Schedule the next update
      timeoutId = setTimeout(updateTimerDisplay, 100);
    } else {
      end_alert.play();
      alert("Yay! You have successfully fo-cussed!");
    }
  }
}

async function randomizeBackground() {
  const wallpaperDetails = await getRandomWallpaper();

  if (!wallpaperDetails) {
    return;
  }

  const img = new Image();
  img.src = wallpaperDetails.path;
  img.onload = function () {
    document.body.style.background = `url(${wallpaperDetails.path})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    toast("Loaded");
  };
  img.onerror = function (err) {
    microQ(() => randomizeBackground());
  };
}

async function getRandomWallpaper() {
  try {
    const response = await fetch("/api/random").then((d) => d.json());
    return response;
  } catch (err) {
    console.error(err);
    // digest error
    return false;
  }
}

function toast(message) {
  const elm = document.getElementById("toast");
  Object.assign(elm.style, {
    opacity: 1,
  });

  elm.textContent = message;

  setTimeout(() => {
    Object.assign(elm.style, {
      opacity: 0,
    });
  }, 2500);
}
