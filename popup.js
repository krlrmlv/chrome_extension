
const {
  connection,
  cookieEnabled,
  credentials,
  deviceMemory,
  doNotTrack,
  geolocation,
  hardwareConcurrency,
  hid,
  keyboard,
  language,
  languages,
  locks,
  managed,
  maxTouchPoints,
  mediaCapabilities,
  mediaDevices,
  mediaSession,
  mimeTypes,
  MimeTypeArray,
  onLine,
  permissions,
  platform,
  plugins,
  presentation,
  product,
  productSub,
  scheduling,
  serial,
  serviceWorker,
  storage,
  usb,
  userActivation,
  userAgent,
  userAgentData,
  vendor,
  vendorSub,
  wakeLock,
  webdriver,
  webkitPersistentStorage,
  webkitTemporaryStorage,
  xr
} = window.navigator;

const table = document.getElementById("table");

function template(name, value) {
  let t = document.createElement("div");
  t.classList.add("table-row");
  t.innerHTML = `<div class="table-cell">${name}</div><div class="table-cell">${value}</div>`
  return t
}

let arr = [];
let bat = navigator.getBattery();


Promise.all([bat]).then(values => {

  console.log(values);

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
      name: "Battery charging",
      value: values[0].charging
    }
  ];

  arr.forEach((element, index) => {
    table.appendChild(template(element.name, element.value))
  });

})