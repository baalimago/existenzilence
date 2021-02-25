(() => {
    console.log("CLIICK");
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function hideSilencedComments(people) {
        console.log("Hiding silenced people:");
        console.log(people);
    }

    function showSilencedComments() {
        console.log("Reseting silence");
    }

    browser.runtime.onMessage.addListener((message) => {
        switch (message.command) {
            case "stfu":
                hideSilencedComments(message.annoyingPeople);
                break;

            case "oktalk":
                showSilencedComments();
                break;

            default:
                break;
        }
        if (message.command === "stfu") {} else if (message.command === "oktalk") {}
    });

})();