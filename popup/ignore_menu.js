arrayRem = (arr, i) => {
  arr.splice(arr.indexOf(i), 1);
}


function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute ExistenZilence content script: ${error.message}`);
}

function loadFromLocalStorage() {
  const storeStr = window.localStorage.getItem("annoyingPeople");
  if (storeStr == null) return [];
  userArr = storeStr.split(";");
  const userMap = {};
  for (const k in userArr) {
    userMap[userArr[k]] = userArr[k];
  }
  return userMap;
}

function storeInLocService() {
  let storeStr = "";
  let i = 0;
  for (const a in annoyingPeople) {
    storeStr += annoyingPeople[a];
    if (i < Object.keys(annoyingPeople).length - 1) storeStr += ";";
    i++;
  }
  if (storeStr == "") return;
  window.localStorage.setItem("annoyingPeople", storeStr);
  sendStoreQuery(annoyingPeople);
}

function updateHttp() {
  const span = document.getElementById("span-ignoreList");
  span.innerHTML = "";
  let i = 0;
  for (const n in annoyingPeople) {
    span.innerHTML += n;
    if (i < Object.keys(annoyingPeople).length - 1) span.innerHTML += ", ";
    i++;
  }
  document.getElementById("inp-field-add").value = "";
  document.getElementById("inp-field-remove").value = "";
}

function addUser() {
  const newName = document.getElementById("inp-field-add").value.trim();
  if (newName == "") return;
  annoyingPeople[newName] = newName;
  storeInLocService();
  updateHttp();
  sendMuteQuery();
}

function removeUser() {
  const remName = document.getElementById("inp-field-remove").value;
  delete(annoyingPeople[remName])
  storeInLocService();
  updateHttp();
  sendResetQuery();
  sendMuteQuery();
}

function sendSilenceQuery(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {
    command: "stfu",
    annoyingPeople: annoyingPeople
  });
}

function reset(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {
    command: "oktalk",
  });
}
/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "btn-stfu":
        addUser();
        break;
      case "btn-reset":
        removeUser();
        break;
      case "btn-mute":
        sendMuteQuery();
        break;
      case "btn-unmute":
        sendResetQuery();
        break;
    }
  });
}

function reportError(error) {
  console.error(`Could not beastify: ${error}`);
}

function sendMuteQuery() {
  browser.tabs.query({
      active: true,
      currentWindow: true
    })
    .then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "stfu",
        annoyingPeople: annoyingPeople
      });
    })
    .catch(reportError);

}

function sendResetQuery() {
  browser.tabs.query({
      active: true,
      currentWindow: true
    })
    .then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "oktalk",
      });
    })
    .catch(reportError);

}

function sendStoreQuery(_annoyingPeople) {
  browser.tabs.query({
      active: true,
      currentWindow: true
    })
    .then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "store",
        annoyingPeople: _annoyingPeople
      });
    })
    .catch(reportError);
}

browser.tabs.executeScript({
    file: "/content_scripts/existenzilence.js"
  })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);

// Load annoying people from local storage
let annoyingPeople = loadFromLocalStorage();
setTimeout(() => {
  updateHttp();
  sendMuteQuery();
}, 1);