
const $input = document.querySelector('#input');
let currentTab = null;
let qrcode = null;

function generator(url) {
  const $qrcode = document.querySelector('#qrcode');
  if (!qrcode) {
    qrcode = new QRCode($qrcode, {
      text: url,
      width: 170,
      height: 170,
      colorDark: '#000',
      colorLight: '#fff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  } else {
    $qrcode.style.opacity = 0;
    qrcode.clear();
    setTimeout(() => {
      $qrcode.style.opacity = 1;
      qrcode.makeCode(url);
    }, 100);
  }
}

function generatorTab() {
  const { url } = currentTab;
  generator(url);
  $input.value = url;
}

chrome.tabs.query({ active: true }, tabList => {
  currentTab = tabList[0];
  generatorTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.id === currentTab.id) {
    currentTab = tab;
    generatorTab();
  }
});

document.querySelector('#btn').addEventListener('click', () => {
  const url = $input.value.trim();
  if (url) {
    generator(url);
  } else {
    $input.classList.add('error');
  }
});

$input.addEventListener('focus', () => {
  $input.classList.remove('error');
});
