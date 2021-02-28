(() => {

    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function hideSilencedComments(annoyingPeople) {
        const comments = getAllUserComments();
        for(const k in comments) {
            const c = comments[k];
            const n = c.children[1].innerText;
            if(n in annoyingPeople) {
                 c.style.display="none";
            }
        }
    }

    function getAllUserComments() {
        const userComments = [];
        const allBoxes = document.getElementsByClassName("box");
        for (let i = 0; i< allBoxes.length; i++) {
            if (allBoxes[i].id.includes("c")) {
                userComments.push(allBoxes[i]);
            }
        }
        return userComments;
    }

    function showSilencedComments() {
       const comments = getAllUserComments();
        for(const k in comments) {
            const c = comments[k];
            c.style.display="";
        }
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

    function storeInLocService(annoyingPeople) {
        let storeStr = "";
        let i = 0;
        for (const a in annoyingPeople) {
            storeStr += annoyingPeople[a];
            if (i < Object.keys(annoyingPeople).length - 1) storeStr += ";";
            i++;
        }
        if (storeStr == "") return;
        window.localStorage.setItem("annoyingPeople", storeStr);
    }

    browser.runtime.onMessage.addListener((message) => {
        switch (message.command) {
            case "stfu":
                hideSilencedComments(message.annoyingPeople);
                storeInLocService(message.annoyingPeople);
                break;

            case "store":
                storeInLocService(message.annoyingPeople);
                break;

            case "oktalk":
                showSilencedComments();
                break;

            default:
                break;
        }
    });

    hideSilencedComments(loadFromLocalStorage());

})();