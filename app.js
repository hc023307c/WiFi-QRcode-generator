// app.js
// Wi-Fi QR Code 產生器（手動輸入 SSID / 加密方式 / 密碼）

(function () {
  const ssidInput = document.getElementById("ssidInput");
  const encryptionSelect = document.getElementById("encryptionSelect");
  const passwordField = document.getElementById("passwordField");
  const passwordInput = document.getElementById("passwordInput");
  const generateBtn = document.getElementById("generateBtn");
  const formError = document.getElementById("formError");

  const qrContainer = document.getElementById("qrcode");
  const wifiStringPreview = document.getElementById("wifiStringPreview");

  let qrInstance = null;

  // Wi-Fi 字串格式：
  // WIFI:T:WPA;S:SSID;P:PASSWORD;;
  // T = WEP / WPA / nopass
  // S = SSID
  // P = password

  // 針對 SSID / 密碼做必要跳脫
  function escapeWifiText(text) {
    if (!text) return "";
    // 依 QR 標準，要跳脫 \ ; , : "
    return text.replace(/([\\;,:"])/g, "\\$1");
  }

  function buildWifiString(ssid, encryption, password) {
    const escSsid = escapeWifiText(ssid);
    const escPassword = escapeWifiText(password || "");

    if (encryption === "nopass") {
      return `WIFI:T:nopass;S:${escSsid};;`;
    }

    // 預設 WPA / WEP
    return `WIFI:T:${encryption};S:${escSsid};P:${escPassword};;`;
  }

  function renderQr(text) {
    qrContainer.innerHTML = "";
    qrInstance = new QRCode(qrContainer, {
      text,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // 當加密方式改成 nopass → 密碼欄位灰掉
  encryptionSelect.addEventListener("change", () => {
    if (encryptionSelect.value === "nopass") {
      passwordField.classList.add("disabled");
      passwordInput.disabled = true;
      passwordInput.value = "";
    } else {
      passwordField.classList.remove("disabled");
      passwordInput.disabled = false;
    }
    formError.textContent = "";
  });

  generateBtn.addEventListener("click", () => {
    formError.textContent = "";

    const ssid = ssidInput.value.trim();
    const enc = encryptionSelect.value;
    const pwd = passwordInput.value;

    if (!ssid) {
      formError.textContent = "請輸入 Wi-Fi 名稱（SSID）。";
      return;
    }

    if (enc !== "nopass" && !pwd) {
      formError.textContent = "請輸入 Wi-Fi 密碼。";
      return;
    }

    const wifiString = buildWifiString(ssid, enc, pwd);

    renderQr(wifiString);
    wifiStringPreview.textContent = wifiString;
  });
})();