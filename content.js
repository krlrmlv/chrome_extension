const ppId = "getInfo";
const ppTable = "getInfo-table";
const styles = `
<style>
.getInfo-popup {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 99999999;
  height: 100%;
  display: flex;
}

.getInfo-popup * {
  box-sizing: border-box;
}

.getInfo-popup__bg {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgb(26 26 26 / 70%);
  cursor: pointer;
}

.getInfo-popup__content {
  padding: 40px 60px;
  background-color: papayawhip;
  font-family: monospace;
  width: 700px;
  height: auto;
  position: relative;
  margin: auto;
  z-index: 99999999;
  max-height: 90%;
  overflow-y: auto;
  animation: showPP .5s cubic-bezier(0, 0, 0.2, 1) 0s 1;
}

@keyframes showPP {
  from{
    clip-path: inset(50%);
    opacity: 0;
  }
  to{
    clip-path: inset(0%);
    opacity: 1;
  }
}

.getInfo-popup__close {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: none;
  border: none;
}

.getInfo-popup__close span {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: black;
  transform: rotate(45deg);
  transition: .3s linear;
}

.getInfo-popup__close span:last-child {
  transform: rotate(-45deg);
}

.getInfo-popup__close::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0);
  transform: scale(0);
  transition: .7s cubic-bezier(0, 0, 0.2, 1);
}


.getInfo-popup__close:hover:before {
  transform: scale(1) rotate(90deg);
  border-radius: 50%;
}


.getInfo-popup__close:hover span {
  background-color: white;
  width: 50%;
}


.table {
  margin: 20px 0;
}

.table-head {
  font-weight: 600;
  font-size: 18px;
}

.table-body {
  font-size: 15px;
}

.table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-cell {
  width: 50%;
  padding: 10px;
  border-bottom: 1px solid #adadad;
}

.table-body .table-row:last-child .table-cell {
  border-bottom: none;
}
</style>
`;

function closePP() {
  let pp = [].slice.call(document.querySelectorAll(`#${ppId}`));
  pp.forEach(e => e.remove())
}


function template(name, value) {
  let t = document.createElement("div");
  t.classList.add("table-row");
  t.innerHTML = `<div class="table-cell">${name}</div><div class="table-cell">${value}</div>`
  return t
}

function drawPp(valuesArray) {

  var popup = document.createElement("div");
  popup.setAttribute("id", ppId)
  popup.className = "getInfo-popup"
  popup.innerHTML =
    `
    ${styles}
    <div class="getInfo-popup__bg"></div>
    <div class="getInfo-popup__content">
      <button type="button" class="getInfo-popup__close">
        <span></span>
        <span></span>
      </button>
      <div class="getInfo-popup__header">
        <h1>GetInfo</h1>
        <p>Extension that shows data from window.navigator to the user</p>
      </div>
      <div class="getInfo-popup__main">
        <div class="table">
          <div class="table-head">
            <div class="table-row">
              <div class="table-cell">Name</div>
              <div class="table-cell">Value</div>
            </div>
          </div>
          <div class="table-body" id="${ppTable}">
          </div>
        </div>
      </div>
      <div class="getInfo-popup__footer">
        author: @krlrmlv
      </div>
    </div>
    `
  document.body.appendChild(popup);
  let closeElements = [document.querySelector(".getInfo-popup__bg"), document.querySelector(".getInfo-popup__close")];

  closeElements.forEach((e, i) => {
    e.addEventListener("click", closePP, false);
  });

  let table = document.getElementById(ppTable)
  valuesArray.forEach(e => table.appendChild(template(e.name, e.value)))

}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      // var firstHref = document.querySelector("a[href]");
      // firstHref = firstHref.getAttribute("href");
      // console.log(firstHref);
      // chrome.runtime.sendMessage({ "message": "open_new_tab", "url": firstHref });\

      if (!document.getElementById(ppId)) {
        const {
          connection,
          language,
          languages,
          onLine,
          platform,
          userAgentData,
        } = window.navigator;


        let arr = [];
        let bat = navigator.getBattery();


        Promise.all([bat]).then(values => {

          arr = [
            {
              name: "Window width",
              value: window.innerWidth
            },
            {
              name: "Window height",
              value: window.innerHeight
            },
            {
              name: "Connection",
              value: connection.effectiveType
            },
            {
              name: "Language",
              value: language
            },
            {
              name: "System languages",
              value: languages.filter((e, i) => !(i % 2)).join(" ")
            },
            {
              name: "Are you online",
              value: onLine
            },
            {
              name: "Platform",
              value: platform
            },
            {
              name: "User agent",
              value: `${userAgentData.brands[0].brand}, version:${userAgentData.brands[0].version}`
            },
          ];

          drawPp(arr);

        });
      }
    }
  }
);