const ppId = "getInfo";
const ppTable = "getInfo-table";
const closeElements = [document.querySelector(".getInfo-popup__close")];
const screenButton = document.querySelector(".get-sreen");

function template(name, value) {
  let t = document.createElement("div");
  t.classList.add("table-row");
  t.innerHTML = `<div class="table-cell">${name}</div><div class="table-cell">${value}</div>`
  return t
}

function drawPp(valuesArray) {
  let table = document.getElementById(ppTable)
  valuesArray.forEach(e => table.appendChild(template(e.name, e.value)))
}

function closePP(){
  window.close();
}

chrome.runtime.sendMessage({ "message": "popup_shown" });

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "content__info") {
      drawPp(request.arr);
    }
  }
);

closeElements.forEach((e, i) => {
  e.addEventListener("click", closePP, false);
});

screenButton.addEventListener("click", ()=>chrome.runtime.sendMessage({ "message": "take_screen" }), false);
