
let annoyingPeople = loadFromLocalStorage();

console.log("Hello??");

function loadFromLocalStorage() {
  const storeStr = window.localStorage.getItem("annoyingPeople");
  return storeStr.split(";");
}

function storeInLocService() {
  let storeStr = "";
  for (const a in annoyingPeople) {
    storeStr += a + ";";
  }
  window.localStorage.setItem("annoyingPeople", "storeStr");
}

function updateHttp() {
  const span = document.getElementById("span-ignoreList");
  span.innerHTML = "";
  for(let i = 0; i < annoyingPeople.length; i++) {
    span.innerHTML = annoyingPeople[i];
    if(i < annoyingPeople.length-1) {
      span.innerHTML += ".";
    } else {
      span.innerHTML += ", ";
    }
  }
}

function addUser() {
  const newName = document.getElementById("inp-field-add").value;
  annoyingPeople.add(newName);
  storeInLocService();
  updateHttp();
}

function removeUser() {
  const remName = document.getElementById("inp-field-remove").value;
  annoyingPeople.remove(remName);
  storeInLocService();
  updateHttp();
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    console.log("Click!");

    function sendSilenceQuery(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "stfu",
        annoyingPeople: annoyingPeople
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "oktalk",
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not existenzilence: ${error}`);
    }

    browser.tabs.query({
        active: true,
        currentWindow: true
      })
      .then(sendSilenceQuery)
      .catch(reportError);
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute ExistenZilence content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({
    file: "/content_scripts/existenzilence.js"
  })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);