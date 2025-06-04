var speed = 200; // Time between changes, in milliseconds
var ends = ["$", "\\", "|", "/", "!"];

window.addEventListener("DOMContentLoaded", () => {
  var title = document.title;

  var titles = [];

  for (var i = 0; i < title.length + 1; i++) {
    for (var v = 0; v < ends.length; v++) {
      titles.push(title.substring(0, i) + ends[v]);
    }
  }

  console.log("got title frames: " + titles);

  var k = 0;
  setInterval(() => {
    document.title = titles[k];

    k++;

    if (k >= titles.length) {
      k = 0;
    }
  }, speed);
});