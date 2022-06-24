/*
for js used across multiple pages
 */

let apiHeaders = {headers: {'Content-Type': 'application/json'}};

function initWs() {
    /*
    Handles all web socket comm for all sync pages
     */
    $('.modal').modal('show');

    // reset current bids each time user gets to page
    sentBids = [];

    const socketUrl = wsPrefix + window.location.host + "/ws/";
    console.log("ws:// Connecting to " + socketUrl);

    socket = new WebSocket(socketUrl);

    socket.onopen = function(e) {
        console.log("ws:// Socket open!");
        $('.modal').modal('hide') }

    socket.onclose = function (e) {
        console.error("ws:// socket closed unexpectedly") }

    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        const bid = data.bid;
        const btnId = `btn+${bid}`;

        console.log("On Message: BID: " + bid);

        // first check if bid is accessible from current page (because SyncConsumer spans multiple pages)
        if (!document.getElementById(btnId)) {
            console.warn(`button with BID: ${bid} not in DOM`);
            return }

        const status = data.status;
        const progress = data.progress;
        const notification = data.notification;

        console.log(`ws:// returned data: Status ${status}, Progress: ${progress}, Notification: ${notification}`);

        let glyph = document.getElementById(bid);

        // if user is getting news of sync run by other user
        if (!glyph) {
            glyph = document.createElement("span");
            glyph.id = bid;
            glyph.setAttribute("class", "glyphicon glyphicon-refresh spinning");
            document.getElementById(`btn+${bid}`).append(glyph) }
        else if (status === "SUCCESS") {
            glyph.setAttribute("class", "glyphicon glyphicon-ok") }
        else if (status === "FAIL") {
            glyph.setAttribute("class", "glyphicon glyphicon-remove") }
        else if (status.includes("RUNNING")) {
            glyph.setAttribute("class", "glyphicon glyphicon-refresh spinning") }

        if (progress) {
            let progressBar = document.getElementById(`progress+${bid}`);
            progressBar.hidden = false;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute("aria-valuenow", progress) }

         // only notify if a diff user started sync that is pushing the ws alert
        if (
            notification
            // && !(sentBids.includes(bid) && notification.level === "info")
        ) {
            notify(notification.text, notification.level) } } }


function startSync(that) {
/*
Push data to server after user clicks or interacts with UI

Manages state of spinners and whatever other UI elements are being used to show info to user

that.id = element+bid_key+args -> btn+bot~autocomm~pws+az~new
 */

    // BID ops
    let bidList = that.id.split("+").slice(1);  // length of 1 or 2 (2 if args)
    let bid;
    if (bidList.length === 1) {
        bid = bidList[0] }
    else {
        bid = bidList[0] + "+" + bidList[1] }  // concatenate back into 1 str
    sentBids.push(bid);

    // CHECK: ensure user can't run the same sync twice, otherwise create or use existing success/fail glyph
    let spans = that.getElementsByTagName("span");
    let span;
    if (spans && spans.length > 0) {
        span = spans[0];
        if (span.classList.contains("spinning")) {
            console.log("Bot is already running... returning early")
            return } }

    // create a spinner element with id=bid
    else {
        span = document.createElement("span");
        span.id = bid }

    span.setAttribute("class", "glyphicon glyphicon-refresh spinning");
    that.append(span);

     // send data to consumer
    let data = {bid: bid}
    console.log(`ws:// Sending BID: ${bid}`);
    socket.send(JSON.stringify(data)) }


function notify(msg, level="success") {
    /*
    levels: "success", "info", "warn", "error"
     */
    $.notify(msg, level) }


function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) ) }


function getTodaysDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}` }


function doSomething() {
    let dict = {grades: 1, obj: [1, 2, 3]}
    dict["grades"]
}