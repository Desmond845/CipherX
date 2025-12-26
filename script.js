let isLogging = false; // ← LOOP KILLER

async function logErrorToEmail(errorData) {
  // PREVENT RECURSIVE CALLS
  if (isLogging) {
    console.warn("Error logger already running. Skipping.");
    return;
  }
  isLogging = true;
  console.log(isLogging);
  // Console fallback (always safe)
  try {
    console.error("CipherX ERROR:", {
      time: new Date().toISOString(),
      ...errorData,
      url: location.href,
    });
  } catch (e) {}

  const payload = {
    _subject: "CipherX Error Report",
    _captcha: "false",
    App: "CipherX",
    Version: "1.4",
    User: "daxtech",
    Time: new Date().toISOString(),
    Error: errorData.message || "Unknown",
    Location: errorData.location || "Unknown",
    UserAgent: navigator.userAgent,
    URL: location.href,
    Type: errorData.type || "unknown",
  };

  // Try AJAX
  try {
    const res = await fetch(
      "https://formsubmit.co/ajax/akugbedesmond845@gmail.com",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      isLogging = false;
      return;
    }
  } catch (err) {
    // Silent fail
  }

  // Fallback: sendBeacon (in try/catch)
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      formData.append(k, String(v));
    });
    formData.append("_template", "table");

    const sent = navigator.sendBeacon(
      "https://formsubmit.co/akugbedesmond845@gmail.com",
      formData
    );
    if (sent) console.log("Beacon sent");
  } catch (err) {
    console.warn("Beacon failed too");
  } finally {
    isLogging = false; // Always reset
  }
}

// === ERROR HANDLERS (ONE EACH) ===
function setupGlobalErrorHandler() {
  // Global JS errors
  window.onerror = function (msg, url, line, col, error) {
    logErrorToEmail({
      message: error?.message || String(msg),
      location: `${url}:${line}:${col}`,
      type: "js_error",
    });
    return true;
  };

  // Promise rejections
  window.addEventListener("unhandledrejection", function (event) {
    logErrorToEmail({
      message: event.reason?.message || String(event.reason),
      location: "promise",
      type: "promise_rejection",
    });
    event.preventDefault();
  });
}

// DOM Ready
document.addEventListener("DOMContentLoaded", setupGlobalErrorHandler());

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  },
  { threshold: 0.1 }
);
// Observe all details in grid
document.querySelectorAll(".details-grid details").forEach((detail) => {
  observer.observe(detail);
});
class CreateModal {
  constructor() {
    this.modal = null;
    this.callback = null;
  }

  show(callback) {
    this.callback = callback;
    this.createModal();
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.className = "modal-overlay";
    this.modal.innerHTML = `
            <div class="modal-content">
                <h3>Welcome to CipherX <br>What's your name</h3>
                <input type="text" id="aspectNameInput" placeholder="e.g., James, Joshua" maxlength="20">
                <p class="char-count"><span id="charCount">0</span>/20 characters</p>
                <div class="modal-actions">
                <button class="create-btn">OK</button>
                </div>
                </div>
                `;
    document.body.appendChild(this.modal);
    this.addEventListeners();
  }

  // <button class="cancel-btn">Cancel</button>
  addEventListeners() {
    // const cancelBtn = this.modal.querySelector(".cancel-btn");
    const createBtn = this.modal.querySelector(".create-btn");
    const input = this.modal.querySelector("#aspectNameInput");
    const charCount = this.modal.querySelector("#charCount");
    input.addEventListener("input", () => {
      charCount.textContent = input.value.length;
    });
    // cancelBtn.onclick = () => this.close();

    createBtn.onclick = () => {
      const name = input.value.trim();
      const formattedname = TextFormatter.formatAspectName(name);
      if (name.length >= 2 && name.length <= 20) {
        if (formattedname) {
          this.callback(formattedname);
          this.close();
        } else {
          toast.error("Please enter an appropriate name!");
        }
      } else {
        toast.error("Your name should be between 2 and 20 characters long");
      }
    };

    // Close on overlay click
    // this.modal.onclick = (e) => {
    //   if (e.target === this.modal) this.close();
    // };

    // Enter key to create
    input.onkeypress = (e) => {
      if (e.key === "Enter") createBtn.click();
    };

    input.focus();
  }

  close() {
    if (this.modal) {
      document.body.removeChild(this.modal);
      this.modal = null;
    }
  }
}

class TextFormatter {
  static formatAspectName(text) {
    return format(text); // Your proven function
  }

  static formatUserName(text) {
    return format(text); // Same or different function
  }
}
class ConfirmModal {
  constructor() {
    this.modal = null;
    this.callback = null;
  }

  show(message, callback, func) {
    this.callback = callback;
    this.createModal(message, func);
  }

  createModal(message, func) {
    this.modal = document.createElement("div");
    this.modal.className = "modal-overlay";
    if (func === "Delete") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm Delete</h3>
            <p class="confirm-text">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-delete-btn">Delete Forever</button>
            </div>
            </div>
            `;
    } else if (func === "Copy") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm ${func}</h3>
            <p class="confirm-text"">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-copy-btn">Agree</button>
            </div>
            </div>
            `;
    } else if (func === "Name") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm ${func}</h3>
            <p class="confirm-text">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-name-btn">OK</button>
            </div>
            </div>
            `;
    } else if (func === "Reset") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm ${func}</h3>
            <p class="confirm-text">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-reset-btn">OK</button>
            </div>
            </div>
            `;
    } else if (func === "Share") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm ${func}</h3>
             <p class="confirm-text">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-share-btn">OK</button>
            </div>
            </div>

            `;
    } else if (func === "Option") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm ${func}</h3>
            <p class="confirm-text">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-option-btn">OK</button>
            </div>
            </div>
            `;
    } else if (func === "Download") {
      this.modal.innerHTML = `
            <div class="modal-content">
            <h3>Confirm ${func}</h3>
            <p class="confirm-text">${message}</p>
            <br>
            <div class="modal-actions">
            <button class="cancel-btn">Cancel</button>
            <button class="confirm-download-btn">OK</button>
            </div>
            </div>
            `;
    }
    document.body.appendChild(this.modal);
    this.addEventListeners(func);
  }

  addEventListeners(func) {
    const cancelBtn = this.modal.querySelectorAll(".cancel-btn");
    const deleteBtn = this.modal.querySelector(".confirm-delete-btn");
    const shareBtn = this.modal.querySelector(".confirm-share-btn");
    const nameBtn = this.modal.querySelector(".confirm-name-btn");
    const resetBtn = this.modal.querySelector(".confirm-reset-btn");
    const optionBtn = this.modal.querySelector(".confirm-option-btn");
    const downloadBtn = this.modal.querySelector(".confirm-download-btn");
    const copyBtn = this.modal.querySelector(".confirm-copy-btn");

    cancelBtn.forEach((btn) => {
      btn.onclick = () => this.close();
    });
    if (func === "Delete") {
      deleteBtn.onclick = () => {
        this.callback();
        // toast.success("Deleted Aspect");
        this.close();
      };
    }
    if (func === "Share") {
      shareBtn.onclick = () => {
        this.callback();
        this.close();
      };
    }
    if (func === "Copy") {
      copyBtn.onclick = () => {
        this.callback();
        this.close();
      };
    }
    if (func === "Name") {
      nameBtn.onclick = () => {
        this.callback();
        this.close();
      };
    }
    if (func === "Reset") {
      resetBtn.onclick = () => {
        this.callback();
        this.close();
      };
    }
    if (func === "Option") {
      optionBtn.onclick = () => {
        this.callback();
        this.close();
      };
    }
    if (func === "Download") {
      downloadBtn.onclick = () => {
        this.callback();
        this.close();
      };
    }
    this.modal.onclick = (e) => {
      if (e.target === this.modal) this.close();
    };
  }

  close() {
    if (this.modal) {
      document.body.removeChild(this.modal);
      this.modal = null;
    }
    if (!localStorage.getItem("userName")) {
      getUserName();
    }
  }
}

class Toast {
  constructor() {
    this.container = null;
    this.createContainer();
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.className = "toast-container";
    document.body.appendChild(this.container);
  }

  show(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = ` 
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
       `;

    this.container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  // Shortcut methods
  success(message, duration = 3000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "success", duration);
  }

  error(message, duration = 4000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "error", duration);
  }

  info(message, duration = 3000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "info", duration);
  }

  warning(message, duration = 4000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "warning", duration);
  }
  success(message, duration = 3000) {
    // Check if message contains countdown pattern
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "success", duration);
    }
    return this.show(message, "success", duration);
  }

  // Do the same for other types if you want
  error(message, duration = 4000) {
    if (typeof message === "string" && message.includes("{countdown}")) {
      return this._showWithCountdown(message, "error", duration);
    }
    return this.show(message, "error", duration);
  }

  // PRIVATE METHOD: Handle countdown replacement
  _showWithCountdown(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} countdown-toast`;
    let time = duration / 1000;
    let count = time; // Default 5-second countdown

    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message.replace(
                  "{countdown}",
                  count
                )}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    this.container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);

    const messageElement = toast.querySelector(".toast-message");
    let currentCount = count;

    const countdownInterval = setInterval(() => {
      currentCount--;

      if (currentCount > 0) {
        // Update just the countdown number in the message
        messageElement.innerHTML = message.replace("{countdown}", currentCount);
      } else {
        clearInterval(countdownInterval);
        if (message.includes("in {countdown}")) {
          messageElement.innerHTML = message.replace("in {countdown}", "now");
        } else {
          messageElement.innerHTML = message.replace("{countdown}", "0");
        }
        // Remove toast
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
        }, 1000);
      }
    }, 1000);

    return toast;
  }
}

class PinModal {
  constructor() {
    this.modal = null;
    this.callback = null;
    this.history = []; // Array to store previous values
  }

  show(message, defaultValue = "", callback) {
    this.callback = callback;
    this.createModal(message, defaultValue);
  }

  createModal(message, defaultValue) {
    if (message.includes("new name")) {
      this.modal = document.createElement("div");
      this.modal.className = "modal-overlay";
      this.modal.innerHTML = `
            <div class="modal-content">
                <h3>${message}</h3>
                <input type="text" id="pinEntryInput" placeholder="Enter new name" value="${defaultValue}" maxlength="20">
                 <p class="char-count"><span id="charCount">0</span>/20 characters</p>

                <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="create-btn">OK</button>
                </div>
                ${
                  this.history.length > 0
                    ? `
                    <div class="modal-history">
                        <p>Recent values:</p>
                        <div class="history-list">
                            ${this.history
                              .map(
                                (item) =>
                                  `<span class="history-item" data-value="${item}">${item}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                 `
                    : ""
                }
            </div>
            `;
    } else if (message.includes("new message pin")) {
      this.modal = document.createElement("div");
      this.modal.className = "modal-overlay";
      this.modal.innerHTML = `
            <div class="modal-content">
                <h3>${message}</h3>
                <input type="text" id="pinEntryInput" placeholder="Enter pin" value="${defaultValue}" maxlength="8">
                 <p class="char-count"><span id="charCount">0</span>/8 characters</p>
                <div class="modal-actions">
                                <button class="cancel-btn">Cancel</button>

                <button class="create-btn">OK</button>
                </div>
                ${
                  this.history.length > 0
                    ? `
                    <div class="modal-history">
                        <p>Recent values:</p>
                        <div class="history-list">
                            ${this.history
                              .map(
                                (item) =>
                                  `<span class="history-item" data-value="${item}">${item}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                 `
                    : ""
                }
            </div>
            `;
    } else if (message.includes("expired")) {
      this.modal = document.createElement("div");
      this.modal.className = "modal-overlay";
      this.modal.innerHTML = `
      <div class="modal-content">
      <input style="display: none;" type="text" id="pinEntryInput" placeholder="Enter pin" value="${defaultValue}" maxlength="8">
      <p class="char-count" style="display: none;"><span id="charCount">0</span>/8 characters</p>
      <h3>Expired Link</h3>

                <p>Dear user,</p>
                <p>The owner of this message set an expiry</p>
                <p>It ${message}</p>
                <p>It's no longer valid.</p>
                <p>Please tell them to recreate it.</p> 
                <div class="modal-actions">

                <button class="create-btn">OK</button>
                </div>
                ${
                  this.history.length > 0
                    ? `
                    <div class="modal-history">
                        <p>Recent values:</p>
                        <div class="history-list">
                            ${this.history
                              .map(
                                (item) =>
                                  `<span class="history-item" data-value="${item}">${item}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                 `
                    : ""
                }
            </div>
            `;
    } else if (message.includes("view limit")) {
      this.modal = document.createElement("div");
      this.modal.className = "modal-overlay";
      this.modal.innerHTML = `
      <div class="modal-content">
      <input style="display: none;" type="text" id="pinEntryInput" placeholder="Enter pin" value="${defaultValue}" maxlength="8">
      <p class="char-count" style="display: none;"><span id="charCount">0</span>/8 characters</p>
      <h3>Reached Limit</h3>

                <p>Dear user,</p>
                <p>${message}.</p>
                <div class="modal-actions">

                <button class="create-btn">OK</button>
                </div>
                ${
                  this.history.length > 0
                    ? `
                    <div class="modal-history">
                        <p>Recent values:</p>
                        <div class="history-list">
                            ${this.history
                              .map(
                                (item) =>
                                  `<span class="history-item" data-value="${item}">${item}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                 `
                    : ""
                }
            </div>
            `;
    } else {
      this.modal = document.createElement("div");
      this.modal.className = "modal-overlay";
      this.modal.innerHTML = `
      <div class="modal-content">
      <h3>${message}</h3>
      <input type="text" id="pinEntryInput" placeholder="Enter pin" value="${defaultValue}" maxlength="8">
      <p class="char-count"><span id="charCount">0</span>/8 characters</p>
                <div class="modal-actions">
                <button class="create-btn">OK</button>
                </div>
                ${
                  this.history.length > 0
                    ? `
                    <div class="modal-history">
                        <p>Recent values:</p>
                        <div class="history-list">
                            ${this.history
                              .map(
                                (item) =>
                                  `<span class="history-item" data-value="${item}">${item}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                 `
                    : ""
                }
            </div>
            `;
    }

    document.body.appendChild(this.modal);
    this.addEventListeners(message);
  }

  addEventListeners(message) {
    const cancelBtn = this.modal.querySelectorAll(".cancel-btn");
    const createBtn = this.modal.querySelector(".create-btn");
    const input = this.modal.querySelector("#pinEntryInput");
    const historyItems = this.modal.querySelectorAll(".history-item");
    const charCount = this.modal.querySelector("#charCount");
    input.addEventListener("input", () => {
      charCount.textContent = input.value.length;
    });
    charCount.textContent = input.value.length;
    cancelBtn.forEach((btn) => {
      btn.onclick = () => this.close();
    });
    cancelBtn.onclick = () => this.close();
    createBtn.onclick = () => this.handleCreate(input);

    // History item clicks
    historyItems.forEach((item) => {
      item.onclick = () => {
        input.value = item.dataset.value;
        this.handleCreate(input, message);
      };
    });

    // Close on overlay click
    // this.modal.onclick = (e) => {
    //     if (e.target === this.modal) this.close();
    // };

    // Enter key to create
    input.onkeypress = (e) => {
      if (e.key === "Enter") this.handleCreate(input);
    };

    input.focus();
    input.select();
  }

  handleCreate(input, message) {
    const value = input.value.trim();

    if (value) {
      // Add to history (limit to last 5)
      this.history.unshift(value);
      this.history = this.history.slice(0, 5);
      this.callback(value);
      this.close();
    } else {
      this.history.unshift(value);
      this.history = this.history.slice(0, 5);
      toast.error("Please enter a valid pin");
    }
  }

  close() {
    if (this.modal) {
      document.body.removeChild(this.modal);
      this.modal = null;
    }
  }

  // Method to manually set history (for pin prompts)
  setHistory(newHistory) {
    this.history.unshift(newHistory);
    this.history = this.history.slice(0, 5);
  }
}

const pinModal = new PinModal();

function collectPin() {
  const pin = localStorage.getItem("userPin") || "dXt@1111";
  pinModal.show("Enter new message pin", `${pin}`, (newPin) => {
    if (newPin === pin) {
      toast.info("No change detected");
      return;
    }
    localStorage.setItem("userPin", newPin);
    document.getElementById("pinDisplay").textContent = `"${newPin}"`;
    toast.success(`Pin set to ${newPin}`, "1500");
  });
}

// collectPin()
function editName() {
  const username = localStorage.getItem("userName");
  pinModal.show("Enter new name", `${username}`, (newname) => {
    const formattedname = TextFormatter.formatAspectName(newname);
    if (newname.length >= 2 && newname.length <= 20) {
      if (formattedname === username) {
        toast.info("No change detected");
        return;
      }

      if (formattedname) {
        localStorage.setItem("userName", formattedname);
        toast.success(`Name  set to ${formattedname}`, "1500");
        updateUserIcon();
        getUserName();
      } else {
        toast.error("Please enter an appropriate name!");
      }
    } else {
      toast.error("Your name should be between 2 and 20 characters long");
    }
  });
}

const toast = new Toast();

const confirmModal = new ConfirmModal();

const createModal = new CreateModal();

function getUserName() {
  let userName = localStorage.getItem("userName");
  // If no username exists, prompt for one

  const timeGreeting = getTimeBasedGreeting();

  if (!userName) {
    createModal.show((name) =>
      confirmModal.show(
        `Is "${name}" your name? Click OK to confirm, or Cancel to edit.`,
        () => grabName(name),
        `Name`
      )
    );
    function grabName(name) {
      localStorage.setItem("userName", name);
      document.querySelector(".cam-btn").style.display = "none";
      firstvisual();
      updateUserIcon();
      ciphers.open = true;
      document.getElementById("firsttime").style.display = "block";
      const userGreeting = document.getElementById("userGreeting");
      const greetingText = `${timeGreeting} ${name}<br>Welcome to CipherX`;
      userGreeting.innerHTML = greetingText;
      toast.success(
        `${timeGreeting}<br>Welcome to CipherX ${localStorage
          .getItem("userName")
          .trim()}<br>We're excited to have you here!`
      );
      nameDisplay.innerHTML = `${name}`;
      acthome()
    }
    localStorage.setItem("theme", "dark");
    localStorage.getItem("ultxExpiry", "0");
    localStorage.setItem("allowPinInMessage", "true");
    viauto();
    document.getElementById("nightmode").checked = true;
  } else {
    const timeGreeting = getTimeBasedGreeting();
    // Return visitor greeting
    nameDisplay.innerHTML = `${userName}`;

    const userGreeting = document.getElementById("userGreeting");
    const greetingText = `${timeGreeting} <br>Welcome back ${userName}`;
    userGreeting.innerHTML = greetingText;
  }
  return userName;
}
function alertSomething(message) {
  setTimeout(() => {
    alert(`${message}`);
  }, 2000);
}
setInterval(() => {
  if (localStorage.getItem("userName")) {
    // getUserName();
  }
  const userPin = localStorage.getItem("userPin") || "dXt@1111";
  document.getElementById("pinDisplay").textContent = `"${userPin}"`;
}, 3000);

const ciphheading = document.getElementById("ciphheading");
const ciphers = document.getElementById("ciphers");
const autoatbash = document.getElementById("autoatbash");
const autoreverse = document.getElementById("autoreverse");
const automorse = document.getElementById("automorse");
const autobinary = document.getElementById("autobinary");
const autobase64 = document.getElementById("autobase64");
const autoasci = document.getElementById("autoasci");
const autoa1z26 = document.getElementById("autoa1z26");
const autohex = document.getElementById("autohex");
const toasci = document.getElementById("toasci");
const toa1z26 = document.getElementById("toa1z26");
const tohex = document.getElementById("tohex");
const copy = document.getElementById("cpybtn");
const inputfield = document.getElementById("text");
const tomorse = document.getElementById("tomorse");
const tobinary = document.getElementById("tobinary");
const tobase64 = document.getElementById("tobase64");
const tocaesar = document.getElementById("tocaesar");
const keyblock = document.getElementById("keyblock");
const caesarblock = document.getElementById("caesarblock");
const caesarencode = document.getElementById("caesarencode");
const caesardecode = document.getElementById("caesardecode");
const keyfield = document.getElementById("key");
const cipher = document.getElementById("cipher");
const toatbash = document.getElementById("toatbash");
const reverse = document.getElementById("reverse");
const translators = document.querySelectorAll('input[name="translator"]');
const autotranslators = document.querySelectorAll(
  'input[name="autotranslator"]'
);
const nameDisplay = document.getElementById("nameDisplay");
const learnmorelink = document.getElementById("learn-more-link");
const ciphernamespan = document.getElementById("cipher-name");
const cipherlink = document.getElementById("cipher-link");
const cancelbtn = document.getElementById("cancel");
const themeToggle = document.getElementById("themetoggle");
const body = document.body;
const username = localStorage.getItem("userName");
const ppic = document.getElementById("avatar");
const preview = document.querySelectorAll(".preview");
const view = document.getElementById("preview");
const userIcon = document.querySelectorAll(".user-icon");
const avatar = document.querySelectorAll(".user-avatar");
const zoomOverlay = document.getElementById("imageZoomOverlay");
const zoomedImage = document.getElementById("zoomedImage");
const zoomlevel = document.getElementById("zoomLevel");
let modeChangeTimer;

let debounceTimer;
let lastInput = "";
let input;
// Emergency nav fix - run this every second to ensure nav stays fixed
setInterval(() => {
  const nav = document.querySelector(".cont1");
  if (nav) {
    nav.style.display = "flex";
    nav.style.position = "fixed";
    nav.style.bottom = "0";
    nav.style.left = "0";
    nav.style.zIndex = "9999";
    nav.style.width = "100%";
  }
}, 1000);

// Also fix on page load
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".cont1");
  if (nav) {
    nav.style.display = "flex";
    nav.style.position = "fixed";
    nav.style.bottom = "0";
    nav.style.left = "0";
  }
});
function showBottomNav() {
  const nav = document.querySelector(".cont1");
  if (nav) {
    nav.style.display = "flex";
    // Force reflow and positioning
    nav.style.position = "fixed";
    nav.style.bottom = "0";
    nav.style.left = "0";
    nav.style.zIndex = "9999";
  }
}
function rageMode() {
  let intensity = 0;
  const originalTitle = document.title;

  const rageInterval = setInterval(() => {
    // Make the page shake
    document.body.style.transform = `translate(${
      Math.random() * intensity
    }px, ${Math.random() * intensity}px)`;
    document.body.style.transition = "transform 0.1s";

    // Flash the title
    document.title =
      document.title === "☠️☠️☠️☠️☠️" ? originalTitle : "☠️☠️☠️☠️☠️";

    // Increase intensity
    intensity += 2;

    // Stop after 5 seconds
    if (intensity > 100) {
      clearInterval(rageInterval);
      document.body.style.transform = "none";
      document.title = originalTitle;
    }
  }, 100);
}

document.getElementById("resetpage").addEventListener("click", function () {
  document.getElementById("ciphheading").textContent = `Ciphers`;
  document.getElementById("learn-more-link").style.display = `none`;
  typeEffect2(``);
  ultxclear2();
  document
    .querySelectorAll(
      "input[name='caesar']" &&
        "input[name='translator']" &&
        "input[name='super']"
    )
    .forEach((radio) => {
      radio.checked = false;
    });
  // });
  document.getElementById("inputText").value = "";
  document.getElementById("outputText").value = "";
  document.getElementById("output").value = "";

  document.getElementById("text").value = "";
  const tracker = document.querySelectorAll(".tracker");
  tracker.forEach((tracker) => {
    tracker.style.display = "none";
    tracker.textContent = ``;
  });
});
setInterval(() => {
  netCheck();
}, 180000);
function netCheck() {
  if (!navigator.onLine) {
    toast.error("Connection lost!<br>Some features might not work", "1500");
  } else {
    toast.success("Online", "1500");
  }
}
const speechbtn = document.getElementById("stt");
speechbtn.addEventListener("click", testspeech());
const speechbtn2 = document.getElementById("stt2");
speechbtn2.addEventListener("click", testspeech2());
function testspeech() {
    // const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  // recognition.onresult = (e) => {
    //  document.getElementById("output").value = "You said: " + e.results[0][0].transcript;
    //  console.log( "You said: " + e.results[0][0].transcript);
  // }
  // recognition.start();
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (typeof SpeechRecognition === "undefined") {
    alert("Your browser doesn't support speech recognition.");
  } else {
    try {
      // Function to handle connectivity changes
      if (!navigator.onLine) {
        return;
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening
        recognition.lang = "en-US";
        recognition.interimResults = true; // Show partial results
        recognition.maxAlternatives = 1;

        const button = document.getElementById("stt");
        const output = document.getElementById("text");
        let isListening = false;
        button.onclick = function () {
          if (!isListening) {
            // Start listening
            recognition.start();
            toast.success("Listening...<br>Tap icon again to stop");
            isListening = true;
            button.style.color = "rgba(40, 167, 69, 0.9)";
          } else {
            // Stop listening
            if (localStorage.getItem("theme") === "dark") {
              button.style.color = "white";
            } else {
              button.style.color = "black";
            }
            toast.info("Speech recongnition ended");
            recognition.stop();
            isListening = false;
          }
        };

        recognition.onresult = (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Only update with final results to avoid duplicates
          if (finalTranscript) {
            output.value += finalTranscript;
          } else if (interimTranscript) {
            output.value += interimTranscript;
          }
        };

        recognition.onerror = (event) => {
          let err = event.error;
          toast.error(`Typing ended due to ${err} error:`);
          isListening = false;
          if (localStorage.getItem("theme") === "dark") {
            button.style.color = "white";
          } else {
            button.style.color = "black";
          }
        };

        recognition.onend = () => {
          toast.info("Typing ended");
          if (localStorage.getItem("theme") === "dark") {
            button.style.color = "white";
          } else {
            button.style.color = "black";
          }
          isListening = false;
        };
      }
    } catch (error) {}
  }
}
function testspeech2() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  try {
    // Function to handle connectivity changes
    if (!navigator.onLine) {
      return;
    } else {
      // Set up event listeners for future changes

      if (typeof SpeechRecognition === "undefined") {
        alert("Your browser doesn't support speech recognition.");
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening
        recognition.lang = "en-US";
        recognition.interimResults = true; // Show partial results
        recognition.maxAlternatives = 1;

        const button = document.getElementById("stt2");
        const output = document.getElementById("inputText");
        let isListening = false;

        button.onclick = () => {
          if (!isListening) {
            // Start listening
            recognition.start();
            toast.success("Listening...<br>Tap icon again to stop");
            isListening = true;
            button.style.color = "rgba(40, 167, 69, 0.9)";
          } else {
            // Stop listening
            if (localStorage.getItem("theme") === "dark") {
              button.style.color = "white";
            } else {
              button.style.color = "black";
            }
            toast.info("Speech recongnition ended");
            recognition.stop();

            isListening = false;
          }
        };

        recognition.onresult = (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Only update with final results to avoid duplicates
          if (finalTranscript) {
            output.value += finalTranscript;
          } else if (interimTranscript) {
            output.value += interimTranscript;
          }
        };

        recognition.onerror = (event) => {
          let err = event.error;
          toast.error(`Typing ended due to ${err} error`);
          isListening = false;
          if (localStorage.getItem("theme") === "dark") {
            button.style.color = "white";
          } else {
            button.style.color = "black";
          }
        };

        recognition.onend = () => {
          toast.info("Typing ended");
          if (localStorage.getItem("theme") === "dark") {
            button.style.color = "white";
          } else {
            button.style.color = "black";
          }
          isListening = false;
        };
      }
    }
  } catch (error) {}
}

function saveOnModeChange(selectedCipher, operation) {
  clearTimeout(modeChangeTimer);
  modeChangeTimer = setTimeout(() => {
    const input = inputfield.value.trim();
    const output = document.getElementById("output").value;
    if (
      output === "" ||
      output === "Select a Cipher!" ||
      output === "Select an Operation!" ||
      output === "[object HTMLTextAreaElement]"
    ) {
      return;
    } else {
      // if (input && output && output !== "Select a Cipher!") {
    const history = validateHistory(); // ← Always starts with valid data!

      const lastItem = history[0];

      if (!lastItem || lastItem.output !== output) {
        saveToHistory(input, output, selectedCipher, operation);
      }
    }
  }, 1000); // 1 second delay
}

function settings() {
  history.pushState(null, "", "#settings");
  const settab = document.getElementById("setting-tab");
  settab.style.display = "block";
  document.getElementById("homepage").style.display = "none";

  document.getElementById("info-sec").style.display = "none";
}
function shareopt() {
  history.pushState(null, "", "#share");
  const sharetab = document.getElementById("share-tab");
  sharetab.style.display = "block";
  document.getElementById("homepage").style.display = "none";
  document.getElementById("info-sec").style.display = "none";
}
function about() {
  history.pushState(null, "", "#about");
  document.getElementById("homepage").style.display = "none";

  const aboutab = document.getElementById("about-tab");
  aboutab.style.display = "block";
  document.getElementById("info-sec").style.display = "none";
}
function feedback() {
  history.pushState(null, "", "#f/s");
  document.getElementById("homepage").style.display = "none";

  const feedtab = document.getElementById("feedback-tab");
  feedtab.style.display = "block";
  document.getElementById("info-sec").style.display = "none";
}
function backhome() {
  // document.querySelector(".cont1").style.display = "flex";

  getUserName();
  const acttab = localStorage.getItem("activetab");
  if (acttab === "hist") {
    toggleHistory();
  }
  if (acttab === "stat") {
    toggleStats();
  }
  if (acttab === "ach") {
    toggleach();
  }
  if (acttab === "ultx") {
    toggleultx();
  }
  if (acttab === "home") {
    acthome();
  }
}
function back() {
  history.pushState(null, "", "#profile");
  document.getElementById("pic-nav2").classList.add("tab-active");

  document.getElementById("pic-nav").classList.add("tab-active");
  document.getElementById("preview2").classList.add("tab-active");

  const settab = document.getElementById("setting-tab");
  settab.style.display = "none";
  const aboutab = document.getElementById("about-tab");
  aboutab.style.display = "none";
  const sharetab = document.getElementById("share-tab");
  document.getElementById("feedback-tab").style.display = "none";

  sharetab.style.display = "none";
  document.getElementById("info-sec").style.display = "flex";
}
window.addEventListener("popstate", function () {
  const hash = window.location.hash;
  if (hash === "#history") {
    toggleHistory();
  } else if (hash === "#f/s") {
    feedback();
  } else if (hash === "#about") {
    about();
  } else if (hash === "#settings") {
    settings();
  } else if (hash === "#ach") {
    toggleach();
  } else if (hash === "#stats") {
    toggleStats();
  } else if (hash === "#share") {
    shareopt();
  } else if (hash === "#ultx") {
    toggleultx();
  } else if (hash === "#profilephoto") {
    if (view.style.display !== "block") return; // Only if image exists
    history.pushState(null, "", "#profilephoto");

    zoomedImage.src = view.src;
    zoomOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  } else if (hash === "#profile") {
    icon();
  } else {
    acthome();
  }
});

function removeicon() {
  if (localStorage.getItem("profilePic")) {
    const preview = document.querySelectorAll(".preview");
    updateUserIcon();
    document.querySelector(".you-txt").style.display = "flex";
    document.querySelector(".img-txt").style.display = "none";

    const icons = document.querySelectorAll(".user-icon");
    icons.forEach((icon) => {
      icon.style.display = "flex";
    });

    localStorage.removeItem("profilePic");
    preview.forEach((preview) => {
      preview.style.display = "none";
      preview.src = "#";
    });
    document.getElementById("pic-nav").style.display = "flex";
    document.getElementById("pic-nav2").style.display = "flex";

    document.getElementById("pic-cont").style.display = "none";
    document.getElementById("prev-cont").style.display = "none";
    toast.info("Profile icon removed");
  } else {
    toast.info("No profile icon to remove", "1500");
  }
}
// Function to generate a random color (or use a consistent one based on name)
function getColorFromName(name) {
  const colors = [
    "#007bff",
    "#6f42c1",
    "#e83e8c",
    "#e93162",
    "#fd7e14",
    "#20c997",
    "#28a745",
    "#dc3545",
    "#00FF",
    "#00FF00",
    " #ffdf6b",
    "#00f0ff",
    "#0f1",
    "#1e2",
  ];
  const index =
    (name.charCodeAt(0) % Math.floor(Math.random() * colors.length)) + 1;
  return colors[index];
}

// Function to update the user icon
function updateUserIcon() {
  const userName = localStorage.getItem("userName") || "User";
  const firstLetter = userName.charAt(0).toUpperCase();
  const color = getColorFromName(userName);
  const avatar = document.querySelectorAll(".user-avatar");
  avatar.forEach((avatar) => {
    avatar.textContent = firstLetter;
  });
  const userIcon = document.querySelectorAll(".user-icon");
  userIcon.forEach((icon) => {
    icon.style.backgroundColor = color;
  });
}

// ✅ CHECK LOCAL STORAGE ON PAGE LOAD
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("theme") === "dark") {
    document.getElementById("nightmode").checked = true;
  } else {
    document.getElementById("nightmode").checked = false;
  }

  viauto();
  const savedImage = localStorage.getItem("profilePic");
  if (savedImage) {
    const icons = document.querySelectorAll(".user-icon");
    icons.forEach((icon) => {
      icon.style.display = "none";
    });

    document.querySelector(".img-txt").style.display = "flex";
    document.querySelector(".you-txt").style.display = "none";

    document.getElementById("pic-nav").style.display = "none";
    preview.forEach((preview) => {
      preview.style.display = "block";
      preview.src = savedImage;
    });
  } else {
    updateUserIcon();
    const icons = document.querySelectorAll(".user-icon");
    icons.forEach((icon) => {
      icon.style.display = "flex";
    });
    document.querySelector(".img-txt").style.display = "none";
    document.getElementById("prev-cont").style.display = "none";

    document.getElementById("pic-nav").style.display = "flex";
    document.getElementById("pic-cont").style.display = "none";
    preview.forEach((preview) => {
      preview.style.display = "none";
      preview.src = "#";
    });
  }
});
view.addEventListener("click", function () {
  if (view.style.display !== "block") return; // Only if image exists
  history.pushState(null, "", "#profilephoto");

  zoomedImage.src = view.src;
  zoomOverlay.style.display = "flex";
  document.body.style.overflow = "hidden"; // Prevent scrolling
});

// ✅ CLICK TO CLOSE ZOOM
zoomOverlay.addEventListener("click", function (e) {
  if (e.target === zoomOverlay) {
    history.pushState(null, "", "#profile");

    zoomOverlay.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  }
});
let scale = 1;
zoomedImage.addEventListener("dblclick", function () {
  zoomOverlay.style.display = "flex";
  document.body.style.overflow = "hidden"; // Restore scrolling
  scale = scale === 1 ? 2 : 1;
  this.style.transform = `scale(${scale})`;
  this.style.transition = "transform 300ms ease";
});
// ✅ CLOSE WITH ESC KEY
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    zoomOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
ppic.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    document.getElementById("prev-cont").style.display = "block";
    document.querySelector(".you-txt").style.display = "none";

    document.getElementById("pic-nav").style.display = "none";
    document.getElementById("pic-cont").style.display = "block";
    document.querySelector(".cam-btn").style.display = "flex";

    document.querySelector(".img-txt").style.display = "flex";
    document.getElementById("pic-nav2").style.display = "none";
    const icons = document.querySelectorAll(".user-icon");
    icons.forEach((icon) => {
      icon.style.display = "none";
    });

    const reader = new FileReader();
    reader.onload = function (e) {
      toast.success(`Profile icon added successfully`, "1500");
      preview.forEach((preview) => {
        preview.style.display = "block";
        preview.src = e.target.result;
      });
      // ✅ SAVE TO LOCAL STORAGE
      localStorage.setItem("profilePic", e.target.result);
    };

    reader.readAsDataURL(file);
  }
});
function firstvisual() {
  if (window.location.hash.includes("#share=")) {
    toggleultx();
    loadSharedData();
    loadURLParameters();
    return;
  } else {
    if (window.location.hash.includes("#share=")) {
      return;
    }
    document.getElementById("preview1").style.border = "none";
    document.getElementById("pic-nav2").classList.remove("tab-active");
    document.getElementById("preview2").style.border = "none";

    document.getElementById("homepage").style.display = "flex";
    document.getElementById("historySection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("info-sec").style.display = "none";
    // document.querySelector(".cont1").style.display = "flex";
    document.getElementById("ultx-sec").style.display = "none";

    if (document.getElementById("homepage").style.display === "block") {
      document.querySelector(".home-btn").classList.add("tab-active");

      document.getElementById("top-home").style.color = "#00f0ff";
      document.querySelector(".home-txt").classList.add("tab-active-text");
      document.getElementById("achievementsBoard").style.display = "none";
      document.querySelector(".super-btn").style.color = "white";
      document.querySelector(".super-txt").style.color = "white";
      if (localStorage.getItem("theme") === "dark") {
        document.querySelector(".stats-btn").style.color = "white";
        document.querySelector(".stats-txt").style.color = "white";
        document.getElementById("ach-btn").style.color = "white";
        document.querySelector(".ach-txt").style.color = "white";
        document.querySelector(".hist-btn").style.color = "white";
        document.querySelector(".hist-txt").style.color = "white";
      } else {
        document.querySelector(".super-btn").style.color = "black";
        document.querySelector(".super-txt").style.color = "black";
        document.querySelector(".stats-btn").style.color = "black";
        document.querySelector(".stats-txt").style.color = "black";
        document.getElementById("ach-btn").style.color = "black";
        document.querySelector(".ach-txt").style.color = "black";
        document.querySelector(".hist-btn").style.color = "black";
        document.querySelector(".hist-txt").style.color = "black";
      }
    }
  }
}

const rewarddet = document.getElementById("reward");
translators.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      ciphheading.textContent = this.value;
      ciphers.open = false;

      if (tocaesar.checked) {
        ciphers.open = true;
      }
    }
  });
});
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cipherIndex = 0;

// 🎯 PARTICLE SYSTEM (Feature #4)
const particles = [];
function createParticles() {
  for (let i = 0; i < 900; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
  });
  requestAnimationFrame(animateParticles);
}

let availableVoices = []; // This will hold all voices
let defaultVoice = null; // This will hold our chosen voice (Samantha!)

// This function runs when voices are loaded
function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();

  // NOW we try to find Samantha
  defaultVoice = findSamantha(availableVoices);

  if (defaultVoice) {
  } else {
    // If we can't find her, the system will use its default anyway
  }
}
function findSamantha(voices) {
  // Look for her by name across different systems
  return voices.find(
    (voice) =>
      voice.name.includes("Samantha") ||
      voice.name.includes("Google UK English Female") ||
      voice.name.includes("Google US English Female") || // Good fallback
      voice.name.includes("Microsoft Zira Desktop") // Good fallback
  );
}

// A dedicated function to find our queen

// CHECK IF VOICES ARE ALREADY LOADED (e.g., on a button click later)
if (window.speechSynthesis.getVoices().length > 0) {
  loadVoices();
}
// LISTEN FOR THE EVENT WHEN VOICES ARE LOADED
window.speechSynthesis.onvoiceschanged = loadVoices;

function testVoice() {
  window.speechSynthesis.cancel();

  // Check if browser supports speech
  if (!("speechSynthesis" in window)) {
    toast.error("Speech synthesis not supported in your browser");
    return;
  }
  const outputElement = document.getElementById("output");
  const textToSpeak = outputElement.value.trim(); // .value for textarea/input

  // 2. Check if there's anything to speak
  if (textToSpeak === "") {
    toast.info("No translation to speak");
    return;
  }

  // Create speech object
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // 1. FIRST PRIORITY: Use the pre-loaded global defaultVoice (Samantha!)
  if (defaultVoice) {
    utterance.voice = defaultVoice;
  } else {
    // 2. FALLBACK: Voices haven't loaded via the event yet, try to grab them now.
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = findSamantha(voices); // Use the same finder function

    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    } else {
      // 3. LAST RESORT: No Samantha found. Use fun tweaks on the default male voice.
      utterance.rate = 1.1;
      utterance.pitch = 1.4;
    }
  }

  // Apply base properties (these work on any voice)
  utterance.volume = 1;

  // Speak it!
  window.speechSynthesis.speak(utterance);

  // Callback when finished
  utterance.onend = function () {
    toast.success("Finished Speaking Output");
  };
}
function testVoice2() {
  window.speechSynthesis.cancel();

  // Check if browser supports speech
  if (!("speechSynthesis" in window)) {
    toast.error("Speech synthesis not supported in your browser");
    return;
  }
  const outputElement = document.getElementById("outputText");
  const textToSpeak = outputElement.value.trim(); // .value for textarea/input

  // 2. Check if there's anything to speak
  if (textToSpeak === "") {
    toast.info("No translation to speak");
    return;
  }

  // Create speech object
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // 1. FIRST PRIORITY: Use the pre-loaded global defaultVoice (Samantha!)
  if (defaultVoice) {
    utterance.voice = defaultVoice;
  } else {
    // 2. FALLBACK: Voices haven't loaded via the event yet, try to grab them now.
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = findSamantha(voices); // Use the same finder function

    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    } else {
      // 3. LAST RESORT: No Samantha found. Use fun tweaks on the default male voice.

      utterance.rate = 1.1;
      utterance.pitch = 1.4;
    }
  }

  // Apply base properties (these work on any voice)
  utterance.volume = 1;

  // Speak it!
  window.speechSynthesis.speak(utterance);

  // Callback when finished
  utterance.onend = function () {
    toast.success("Finished speaking output");
  };
}
function testVoice1() {
  if (!("speechSynthesis" in window)) {
    toast.error("Speech synthesis not supported in your browser");
    return;
  }

  window.speechSynthesis.cancel();
  // Get the username from localStorage or use default
  const userName = localStorage.getItem("userName");

  // Create the message
  const message = userName
    ? `${getTimeBasedGreeting()}, Welcome back ${userName}`
    : `${getTimeBasedGreeting()} ${userName}, Welcome to Cipher X`;

  // Create speech object
  const utterance = new SpeechSynthesisUtterance(message);

  // 1. FIRST PRIORITY: Use the pre-loaded global defaultVoice (Samantha!)
  if (defaultVoice) {
    utterance.voice = defaultVoice;
  } else {
    // 2. FALLBACK: Voices haven't loaded via the event yet, try to grab them now.
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = findSamantha(voices); // Use the same finder function

    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    } else {
      // 3. LAST RESORT: No Samantha found. Use fun tweaks on the default male voice.

      utterance.rate = 1.1;
      utterance.pitch = 1.4;
    }
  }

  // Apply base properties (these work on any voice)
  utterance.volume = 1;

  // Speak it!
  window.speechSynthesis.speak(utterance);

  // Callback when finished
  utterance.onend = function () {};
}

// Check if we already know the user

function resetUser() {
  // i/f (confirm("Reset all user data and start fresh?")) {
  // }
  function doTheReset() {
    toast.success("Redirecting in {countdown}", "3000");
    // ask dax to give you a timer function to learn from
    setTimeout(() => {
      localStorage.clear();
      callNotify("Welcome to CipherX");
      window.location.href = "index.html";
    }, 3000);
  }
  confirmModal.show(
    `Do you want to reset all user data and start afresh`,
    () => doTheReset(),
    `Reset`
  );
}
function format(str) {
  str = str
    .trim() // Remove leading/trailing spaces
    .replace(/ {2,}/g, " ") // First, combine multiple spaces into one
    .split(/\s+/) // Split into words by any whitespace
    .map((word) => {
      // Convert the entire word to lowercase first for consistency
      let cleanWord = word.toLowerCase();
      // Remove any remaining non-name characters (allow letters, numbers, hyphen, apostrophe, period)
      cleanWord = cleanWord.replace(/[^a-z0-9'.-]/g, "");
      // Remove any resulting double hyphens, apostrophes, or periods (e.g., from trying to use them consecutively)
      cleanWord = cleanWord.replace(/([.'-])[.'-]+/g, "$1"); // Replace 2+ consecutive punctuation with one
      // Finally, capitalize the first letter of the cleaned word
      return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    })
    .join(" ") // Join back with a single space
    // Final cleanup: Remove any leading/trailing punctuation that might have been created
    .replace(/^[.'-]+|[.'-]+$/g, "") // Remove punctuation from start/end of the whole name
    .replace(/(\s[.'-]+|[.'-]+\s)/g, " "); // Remove punctuation that is surrounded by spaces or vice versa
  return str;
}
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Set theme function
function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  // document.querySelector(".home-btn").classList.add("tab-active");
  // document.querySelector(".home-btn").style.color = "#00f0ff";
  // document.querySelector(".home-txt").style.color = "#00f0ff";
  setTheme(newTheme);
  if (localStorage.getItem("theme") === "dark") {
    document.getElementById("nightmode").checked = true;
    document.querySelector(".super-btn").style.color = "white";
    document.querySelector(".super-txt").style.color = "white";
    document.querySelector(".super-txt").style.color = "white";
    document.querySelector(".super-btn").style.color = "white";
    document.getElementById("ach-btn").style.color = "white";
    document.querySelector(".ach-txt").style.color = "white";
    document.querySelector(".hist-btn").style.color = "white";
    document.querySelector(".hist-txt").style.color = "white";
    document.querySelector(".img-txt").style.color = "white";
    document.querySelector(".you-txt").style.color = "white";

    document.querySelector(".stats-btn").style.color = "white";
    document.querySelector(".home-btn").style.color = "white";
    document.querySelector(".home-txt").style.color = "white";
    document.querySelector(".stats-txt").style.color = "white";
  } else {
    document.querySelector(".img-txt").style.color = "black";
    document.querySelector(".you-txt").style.color = "black";
    document.querySelector(".home-btn").style.color = "black";
    document.querySelector(".home-txt").style.color = "black";
    document.querySelector(".super-btn").style.color = "black";
    document.querySelector(".super-txt").style.color = "black";
    document.querySelector(".hist-btn").style.color = "black";
    document.querySelector(".hist-txt").style.color = "black";
    document.getElementById("ach-btn").style.color = "black";
    document.querySelector(".ach-txt").style.color = "black";
    document.querySelector(".stats-txt").style.color = "black";
    document.querySelector(".stats-btn").style.color = "black";
    document.getElementById("nightmode").checked = false;
  }
});
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}
document.getElementById("remember").addEventListener("click", function () {
  let checker;
  if (document.getElementById("remember").checked) {
    confirmModal.show(
      `This feaure is still experimental and under development<br>You might experience issues when using this feature!`,
      () => remember(),
      `Option`
    );
    function remember() {
      document.getElementById("autoDetectToggle").checked = false;
      localStorage.removeItem("autoassume");

      document.getElementById("remember").checked = true;
      localStorage.removeItem("allowautodetect");
      checker = "true";
      checksavestate(checker);

      return;
    }
    document.getElementById("remember").checked = false;
    checker = "false";
  } else {
    document.getElementById("remember").checked = false;
    checker = "false";
  }

  checksavestate(checker);
});

document.getElementById("personalload").addEventListener("click", function () {
  let checker;
  if (document.getElementById("personalload").checked) {
    confirmModal.show(
      `This feaure is still experimental and under development<br>You might experience issues when using this feature!`,
      () => personalLoad(),
      `Option`
    );

    function personalLoad() {
      document.getElementById("personalload").checked = true;
      checker = "true";
      checkloadstate(checker);
      return;
    }
    document.getElementById("personalload").checked = false;
    checker = "false";
  } else {
    document.getElementById("personalload").checked = false;
    checker = "false";
  }

  checkloadstate(checker);
});
document.getElementById("pintoggle").addEventListener("click", function () {
  let checker;
  if (document.getElementById("pintoggle").checked) {
    document.getElementById("pintoggle").checked = true;
    checker = "true";
  } else {
    document.getElementById("pintoggle").checked = false;
    checker = "false";
  }

  checkpinstate(checker);
});
document
  .getElementById("autoDetectToggle")
  .addEventListener("click", function () {
    let checker;

    if (document.getElementById("autoDetectToggle").checked) {
      confirmModal.show(
        `This feaure is still experimental and under development<br>You might experience issues when using this feature!`,
        () => autoDetection(),
        `Option`
      );
      function autoDetection() {
        document.getElementById("autoDetectToggle").checked = true;
        document.getElementById("remember").checked = false;
        localStorage.removeItem("allowsavestate");
        checker = "true";
        setupAutoSave();
        checkautodetect(checker);
        return;
      }
      document.getElementById("autoDetectToggle").checked = false;
      checker = "false";
    } else {
      document.getElementById("autoDetectToggle").checked = false;
      checker = "false";
    }

    checkautodetect(checker);
  });
function checkautodetect(check) {
  localStorage.setItem("allowautodetect", check);
}
function checkpinstate(check) {
  localStorage.setItem("allowPinInMessage", check);
}
function checksavestate(check) {
  localStorage.setItem("allowsavestate", check);
}
function checkloadstate(check) {
  localStorage.setItem("allowpersonalload", check);
}
function viauto() {
  if (localStorage.getItem("allowautodetect") === "true") {
    document.getElementById("autoDetectToggle").checked = true;
    localStorage.removeItem("allowsavestate");
    document.getElementById("remember").checked = false;
  }
  if (localStorage.getItem("allowsavestate") === "true") {
    document.getElementById("remember").checked = true;
    document.getElementById("autoDetectToggle").checked = false;
    localStorage.removeItem("allowautodetect");
    localStorage.removeItem("autoassume");
  }
  if (localStorage.getItem("allowpersonalload") === "true") {
    document.getElementById("personalload").checked = true;
  }
  if (localStorage.getItem("allowPinInMessage") === "true") {
    document.getElementById("pintoggle").checked = true;
  }
}

// Toggle theme on click
document.getElementById("nightmode").addEventListener("click", function () {
  if (document.getElementById("nightmode").checked) {
    const newTheme = (currentTheme = "dark");
    setTheme(newTheme);
  } else {
    const newTheme = (currentTheme = "light");
    setTheme(newTheme);
  }
  if (localStorage.getItem("theme") === "dark") {
    document.getElementById("nightmode").checked = true;
    document.querySelector(".super-btn").style.color = "white";
    document.querySelector(".super-txt").style.color = "white";
    document.querySelector(".super-txt").style.color = "white";
    document.querySelector(".super-btn").style.color = "white";
    document.getElementById("ach-btn").style.color = "white";
    document.querySelector(".ach-txt").style.color = "white";
    document.querySelector(".hist-btn").style.color = "white";
    document.querySelector(".hist-txt").style.color = "white";
    document.querySelector(".home-btn").style.color = "white";
    document.querySelector(".home-txt").style.color = "white";

    document.querySelector(".stats-btn").style.color = "white";

    document.querySelector(".stats-txt").style.color = "white";
  } else {
    document.querySelector(".super-btn").style.color = "black";
    document.querySelector(".super-txt").style.color = "black";
    document.querySelector(".hist-btn").style.color = "black";
    document.querySelector(".hist-txt").style.color = "black";
    document.getElementById("ach-btn").style.color = "black";
    document.querySelector(".home-btn").style.color = "black";
    document.querySelector(".home-txt").style.color = "black";

    document.querySelector(".ach-txt").style.color = "black";
    document.querySelector(".stats-txt").style.color = "black";
    document.querySelector(".stats-btn").style.color = "black";
    document.getElementById("nightmode").checked = false;
  }
});
// Load saved theme on start

function typeEffect2(text, color) {
  const info = document.getElementById("info");

  // Clear timeouts if rerunning
  if (info._typingTimeouts) {
    info._typingTimeouts.forEach(clearTimeout);
  }
  info._typingTimeouts = [];

  info.innerHTML = "";
  info.style.color = color || ` #00ffff`;

  let i = 0;

  function typeChar() {
    if (i < text.length) {
      const char = text.charAt(i);
      info.innerHTML += char === "\n" ? "<br>" : char;

      const timeout = setTimeout(typeChar, 100);
      info._typingTimeouts.push(timeout);
      i++;
    }
  }

  typeChar(); // 👈 Only call it ONCE here
}

copy.onclick = function () {
  let text1 = document.getElementById("output").value;
  if (text1 === "") {
    toast.info("Empty can not copy");
  } else {
    navigator.clipboard.writeText(text1).then(() => {
      toast.success("Copied to clipboard");
    });
  }
};
document.getElementById("cpybtn2").onclick = function () {
  let text1 = document.getElementById("outputText").value;
  if (text1 === "") {
    toast.info("Empty can not copy");
  } else {
    navigator.clipboard.writeText(text1).then(() => {
      toast.success("Copied to clipboard");
    });
  }
};
document.getElementById("cpybtn3").onclick = function () {
  let text1 = document.getElementById("shareLinkDisplay").textContent;
  if (text1 === "") {
    toast.info("Empty can not copy");
  } else {
    navigator.clipboard.writeText(text1).then(() => {
      toast.success("Copied to clipboard");
    });
  }
};
// A1Z26 ENCODE

//Letter → Morse?
const letterToMorse = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  " ": "/", // space → slash
};

// Morse → Letter
const morseToLetter = {};
for (let key in letterToMorse) {
  morseToLetter[letterToMorse[key]] = key;
}

// Encode: text → Morse
function encodeMorse(input) {
  return input
    .toUpperCase()
    .split("")
    .map((char) => letterToMorse[char] || "")
    .join(" ");
}

// Decode: Morse → text
function decodeMorse(input) {
  return input
    .trim()
    .split(" / ") // split words by slash
    .map((word) =>
      word
        .split(" ") // split letters
        .map((code) => morseToLetter[code] || "?")
        .join("")
    )
    .join(" ");
}

// Detect if it's Morse (dots, dashes, slashes, spaces only)
function isMorse(input) {
  return /^[.\-\/\s]+$/.test(input);
}

// 🎯 SUPER ENCODE FUNCTION

function encodeA1Z26(input) {
  return input
    .toUpperCase()
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        return (char.charCodeAt(0) - 64).toString(); // A=1, B=2, etc.
      } else if (char === " ") {
        return "0";
      }
      return char; // Keep spaces/punctuation as-is
    })
    .join(" ");
}

// A1Z26 DECODE
function decodeA1Z26(input) {
  return input
    .split(/\s+/)
    .map((item) => {
      // If it's a number 1-26, convert to letter
      const num = parseInt(item);
      if (!isNaN(num)) {
        if (num === 0) {
          return " ";
        }
        if (num >= 1 && num <= 26) {
          return String.fromCharCode(num + 64);
        }
      }
      return item; // Keep as-is if not 1-26
    })
    .join("");
}

// A1Z26 DETECTOR (is this encoded A1Z26?)
function isA1Z26(text) {
  if (!text.trim()) return false;
  // Check if it's numbers 1-26 separated by spaces
  return /^([1-9]|1\d|2[0-6])(\s+([1-9]|1\d|2[0-6]))*$/.test(text.trim());
}

// ASCII ENCODE
function encodeASCII(input) {
  return input
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString().padStart(3, "0");
    })
    .join(" ");
}

// ASCII DECODE
function decodeASCII(input) {
  return input
    .split(/\s+/)
    .map((code) => {
      return String.fromCharCode(parseInt(code));
    })
    .join("");
}

// ASCII DETECTOR (is this encoded ASCII?)
function isASCII(input) {
  if (!input.trim()) return false;
  // Check if it's groups of 2-3 digits separated by spaces
  return /^(?:\d{2,3}\s+)+\d{2,3}$/.test(input.trim());
}

function encodeHex(input) {
  let hex = "";
  for (let i = 0; i < input.length; i++) {
    const hexChar = input.charCodeAt(i).toString(16).toUpperCase();
    hex += hexChar.padStart(2, "0") + " ";
  }
  return hex.trim();
}
function decodeHex(input) {
  try {
    // Remove spaces and ensure proper format
    const cleanHex = input.replace(/\s/g, "").trim();

    // Validate hex format
    if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) {
      throw new Error("Invalid hexadecimal format");
    }

    // Hex pairs must be even length
    if (cleanHex.length % 2 !== 0) {
      throw new Error("Hex string must have even number of characters");
    }

    let text = "";
    for (let i = 0; i < cleanHex.length; i += 2) {
      const hexPair = cleanHex.substr(i, 2);
      const charCode = parseInt(hexPair, 16);

      // Validate character code range
      if (charCode < 0 || charCode > 1114111) {
        // Unicode max
        throw new Error("Invalid character code in hex");
      }

      text += String.fromCharCode(charCode);
    }
    return text;
  } catch (error) {
    throw new Error(`Hex decoding error: ${error.message}`);
  }
}
function isHex(input) {
  const cleanInput = input.replace(/\s/g, "").trim();
  return /^[0-9A-Fa-f]+$/.test(cleanInput) && cleanInput.length % 2 === 0;
}

function encodeBinary(input) {
  return input
    .split("") // 1. Break the string into individual characters
    .map(
      (char) =>
        char
          .charCodeAt(0) // 2. Get ASCII code of the character
          .toString(2) // 3. Convert that number to binary (base 2)
          .padStart(8, "0") // 4. Make sure it’s always 8 bits long
    )
    .join(" "); // 5. Join all the binary codes with a space between them
}

function decodeBinary(input) {
  return input
    .trim() // 1. Remove extra spaces at start/end
    .split(" ") // 2. Break the string into chunks (each 8-bit binary)
    .map(
      (bin) => String.fromCharCode(parseInt(bin, 2))
      // 3a. parseInt(bin, 2) → binary → decimal
      // 3b. fromCharCode(decimal) → back to a character
    )
    .join(""); // 4. Join the characters back into a word
}
function isbinary(input) {
  return /^[01\s]+$/.test(input);
}

function isBase64(input) {
  return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(
    input.trim()
  );
}

function encodecaesar() {
  let text = document.getElementById("text").value; // Keep original case
  let shift = parseInt(document.getElementById("key").value) || 0;
  let result = "";
  shift = Math.abs(shift);

  for (let char of text) {
    if (char >= "A" && char <= "Z") {
      // Uppercase letters
      let code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
      result += String.fromCharCode(code);
    } else if (char >= "a" && char <= "z") {
      // Lowercase letters
      let code = ((char.charCodeAt(0) - 97 + shift) % 26) + 97;
      result += String.fromCharCode(code);
    } else {
      // Non-letters (spaces, punctuation, etc.)
      result += char;
    }
  }

  // document.getElementById("output").value = result;
  return result;
}

function decodecaesar() {
  let text = document.getElementById("text").value; // REMOVE .toUpperCase()
  let shift = parseInt(document.getElementById("key").value) || 0;
  let result = "";
  shift = Math.abs(shift);

  for (let char of text) {
    if (char >= "A" && char <= "Z") {
      // Uppercase letters
      let code = ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65;
      result += String.fromCharCode(code);
    } else if (char >= "a" && char <= "z") {
      // Lowercase letters
      let code = ((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97;
      result += String.fromCharCode(code);
    } else {
      // Non-letters (spaces, punctuation, etc.)
      result += char;
    }
  }

  // document.getElementById("output").value = result;
  return result;
}
function decodeRot13(text) {
  let shift = 13;
  let result = "";
  shift = Math.abs(shift);

  for (let char of text) {
    if (char >= "A" && char <= "Z") {
      // Uppercase letters
      let code = ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65;
      result += String.fromCharCode(code);
    } else if (char >= "a" && char <= "z") {
      // Lowercase letters
      let code = ((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97;
      result += String.fromCharCode(code);
    } else {
      // Non-letters (spaces, punctuation, etc.)
      result += char;
    }
  }

  return result;
}
function encodeRot13(text) {
  // let text = message;
  let shift = 13;
  let result = "";
  shift = Math.abs(shift);
  for (let char of text) {
    if (char >= "A" && char <= "Z") {
      // Uppercase letters
      let code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
      result += String.fromCharCode(code);
    } else if (char >= "a" && char <= "z") {
      // Lowercase letters
      let code = ((char.charCodeAt(0) - 97 + shift) % 26) + 97;
      result += String.fromCharCode(code);
    } else {
      // Non-letters (spaces, punctuation, etc.)
      result += char;
    }
  }
  return result;
}

function atbashCipher(input) {
  return input
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "z") {
        return String.fromCharCode(219 - char.charCodeAt(0));
      } else if (char >= "A" && char <= "Z") {
        return String.fromCharCode(155 - char.charCodeAt(0)); // 155 = 65 + 90
      } else {
        return char; // non-alphabet characters stay as-is
      }
    })
    .join("");
}

function reversestring(input) {
  return input.split("").reverse().join("");
}

keyblock.style.display = "none";
learnmorelink.style.display = "none";

translators.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      const cipher = this.value;
      ciphernamespan.textContent = cipher;
      learnmorelink.style.display = "block";
    }
  });
});

// When the link is clicked, scroll and open the details
cipherlink.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default jump behavior
  const cipher = ciphernamespan.textContent;
  const detailselement = document.getElementById(`${cipher}info`);

  if (detailselement) {
    // Open the details
    detailselement.open = true;
    // Smooth scroll to it
    detailselement.scrollIntoView({ behavior: "smooth" });
  }
});

// Get all details elements in the info section
const detailselements = document.querySelectorAll("#info-section details");

// Add toggle event to each
detailselements.forEach((detail) => {
  detail.addEventListener("toggle", function () {
    // If this detail is opening, close others
    if (this.open) {
      detailselements.forEach((other) => {
        if (other !== this) {
          other.open = false;
        }
      });
    }
  });
});

keyfield.addEventListener("input", () => {
  translate();
});
inputfield.addEventListener("input", function () {
  // AUTO FULLSCREEN — MOBILE ONLY (phones & tablets)
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  // Wait a tiny bit so it still counts as user gesture
  setTimeout(() => {

 if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }

  }, 1000); // 1 second after load — feels natural
} else{
}
  const caesarradios = document.querySelector('input[name="caesar"]:checked');

  const activetranslators = document.querySelectorAll(
    'input[name="translator"]'
  );
  let selectedradio = null;
  for (const radio of activetranslators) {
    if (radio.checked) {
      selectedradio = radio.value;
    }
  }
  if (
    selectedradio === null &&
    localStorage.getItem("allowautodetect") === "true"
  ) {
    const savedCipher = localStorage.getItem("autoassume");
    if (savedCipher) {
      const radio = document.getElementById("auto" + savedCipher);
      if (radio) {
        autodetectcipher();
        radio.checked = true;
      }
      if (radio.checked) {
        let autocipher = radio.value;
        ciphheading.textContent = `Auto assuming ${autocipher}`;
      }
    } else {
      autodetectcipher();
    }
    if (inputfield.value === "") {
      document.getElementById("output").value = "";
      ciphheading.textContent = `Ciphers`;
      typeEffect2(``, "");
      const tracker = document.querySelectorAll(".tracker");
      tracker.forEach((tracker) => {
        tracker.style.display = "none";
        tracker.textContent = ``;
      });
    }
  } else {
   
  }
});
document.querySelectorAll("input[name='translator']").forEach((radio) => {
  radio.addEventListener("change", function (e) {
    translate();
    let operand = translate();
    if (operand) {
      saveOnModeChange(e.target.value, operand);
    } else {
    }
  });
});

document.querySelectorAll("input[name='caesar']").forEach((radio) => {
  radio.addEventListener("change", () => {
    translate();
  });
});

document.querySelectorAll("input[name='cipheroptions']").forEach((radio) => {
  radio.addEventListener("change", ciphertype);
});
function caesarrun() {
  if (caesarencode.checked) {
    // encodecaesar();
    keyblock.style.display = "block";
    typeEffect2(`Encoding...`);
    ciphers.open = false;
  } else if (caesardecode.checked) {
    // decodecaesar();
    keyblock.style.display = "block";
    ciphers.open = false;

    // typeEffect2(`Decoding...`);
  }
}

autotranslators.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      let autocipher = this.value;
      document.getElementById(
        "autodetinfo"
      ).textContent = `When typing without selecting a cipher option your input would be encoded or decoded in ${autocipher} cipher automatically until a cipher option is selected`;
      document.getElementById(
        "autodettit"
      ).textContent = `Auto assuming ${autocipher}`;
      document.getElementById("autodetciphers").open = false;
    }
  });
});

// Put this somewhere that runs when page loads
function getautodetect() {
  const savedCipher = localStorage.getItem("autoassume");
  if (savedCipher) {
    const radio = document.getElementById("auto" + savedCipher);
    if (radio) {
      radio.checked = true;
    }
    if (radio.checked) {
      let autocipher = radio.value;
      document.getElementById(
        "autodettit"
      ).textContent = `Auto assuming ${autocipher}`;

      document.getElementById(
        "autodetinfo"
      ).textContent = `When typing without selecting a cipher option your input would be encoded or decoded in ${autocipher} cipher automatically until a cipher option is selected`;
    }
  }
}

function autodetectcipher() {
  const startTime = performance.now();
  input = document.getElementById("text").value.trim();
  let operation = "Auto";
  let output = null;
  let selectedCipher = null;
  // 🏠 CALL THIS ON PAGE LOAD
  const autotranslators = document.querySelectorAll(
    'input[name="autotranslator"]'
  );

  document.getElementById("text").addEventListener("input", function () {
    autotranslators.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.checked) {
          let autocipher = this.value;
          document.getElementById(
            "autodetinfo"
          ).textContent = `When typing without selecting a cipher option your input would be encoded or decoded in ${autocipher} cipher automatically until a cipher option is selected`;
          ciphheading.textContent = `Auto assumiing ${autocipher}`;
        }
      });
    });
  });
  if (input === "") {
  }
  if (autohex.checked) {
    selectedCipher = autohex.value;
    localStorage.setItem("autoassume", "hex");
    if (isHex(input) && localStorage.getItem("autoassume") === "hex") {
      output = decodeHex(input);
      operation = "Decoding";
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeHex(input);

      operation = "Encoding";

      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autoasci.checked) {
    localStorage.setItem("autoassume", "asci");
    selectedCipher = autoasci.value;

    if (isASCII(input) && localStorage.getItem("autoassume") === "asci") {
      output = decodeASCII(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      output = encodeASCII(input);
      operation = "Encoding";
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autoa1z26.checked) {
    localStorage.setItem("autoassume", "a1z26");
    selectedCipher = autoa1z26.value;

    if (isA1Z26(input) && localStorage.getItem("autoassume") === "a1z26") {
      output = decodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      output = encodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
      operation = "Encoding";
    }
  }
  if (automorse.checked) {
    selectedCipher = automorse.value;

    localStorage.setItem("autoassume", "morse");

    if (isMorse(input) && localStorage.getItem("autoassume") === "morse") {
      output = decodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      operation = "Encoding";
      output = encodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autobinary.checked) {
    localStorage.setItem("autoassume", "binary");
    selectedCipher = autobinary.value;

    if (isbinary(input) && localStorage.getItem("autoassume") === "binary") {
      output = decodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      operation = "Encoding";
      output = encodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autobase64.checked) {
    localStorage.setItem("autoassume", "base64");
    selectedCipher = autobase64.value;

    if (isBase64(input) && localStorage.getItem("autoassume") === "base64") {
      output = atob(input); // decode
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      operation = "Encoding";
      output = btoa(input); // encode
      typeEffect2(`Encoding...`);
    }
    document.getElementById("output").value = output;
  }
  if (autoreverse.checked) {
    selectedCipher = autoreverse.value;

    localStorage.setItem("autoassume", "reverse");
    if (localStorage.getItem("autoassume") === "reverse") {
      output = reversestring(input);
      operation = "Encoding";
      document.getElementById("output").value = output;
    }
  }
  if (autoatbash.checked) {
    selectedCipher = autoatbash.value;

    localStorage.setItem("autoassume", "atbash");
    if (localStorage.getItem("autoassume") === "atbash")
      typeEffect2(`Encoding`);
    operation = "Encoding";
    output = atbashCipher(input);
    document.getElementById("output").value = output;
  }
  const endTime = performance.now();
  const processingTime = (endTime - startTime).toFixed(2); // Rounds to 2 decimal places
  if (input !== "" && document.getElementById("output").value !== "") {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "block";
      tracker.textContent = `Processed in ${processingTime}ms`;
    });
  } else {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "none";
      tracker.textContent = ``;
    });
  }
  input = inputfield.value.trim();
  output = document.getElementById("output").value;
  // Only save valid translations
  if (
    output === "" ||
    output === "Select a Cipher!" ||
    output === "Select an Operation!" ||
    output === "[object HTMLTextAreaElement]"
  ) {
    return;
  } else {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (
        output === "" ||
        output === "Select a Cipher!" ||
        output === "Select an Operation!" ||
        output === "[object HTMLTextAreaElement]"
      ) {
        return;
      }
      // Only save if input is different from last save
    const history = validateHistory(); // ← Always starts with valid data!

      const lastItem = history[0];

      if (!lastItem || lastItem.output !== output) {
        saveToHistory(input, output, operation, selectedCipher);
      }
    }, 2500); // 2 seconds delay
  }
}

input = inputfield.value.trim();

function translate() {
  const startTime = performance.now();
  let operation = "Auto";
  let output = null;
  let selectedCipher = null;
  // ... Your existing encoding
  input = document.getElementById("text").value.trim();
  if (tohex.checked) {
    selectedCipher = tohex.value;
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isHex(input)) {
      output = decodeHex(input);
      operation = "Decoding";
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeHex(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
      operation = "Encoding";
    }
  } else if (toasci.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    selectedCipher = toasci.value;
    if (isASCII(input)) {
      output = decodeASCII(input);
      operation = "Decoding";
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeASCII(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
      operation = "Encoding";
    }
  } else if (toa1z26.checked) {
    selectedCipher = toa1z26.value;
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isA1Z26(input)) {
      output = decodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      output = encodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
      operation = "Encoding";
    }
  } else if (tomorse.checked) {
    selectedCipher = tomorse.value;
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isMorse(input)) {
      output = decodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decodinb";
    } else {
      output = encodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
      operation = "Encoding";
    }
  } else if (tobinary.checked) {
    selectedCipher = tobinary.value;
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isbinary(input)) {
      output = decodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
      operation = "Decoding";
    } else {
      output = encodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
      operation = "Encoding";
    }
  } else if (tobase64.checked) {
    selectedCipher = tobase64.value;
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isBase64(input)) {
      operation = "Decoding";
      output = atob(input); // decode
      typeEffect2(`Decoding...`);
    } else {
      operation = "Encoding";
      output = btoa(input); // encode
      typeEffect2(`Encoding...`);
    }
    document.getElementById("output").value = output;
  } else if (reverse.checked) {
    selectedCipher = reverse.value;
    operation = "Encoding";
    typeEffect2(`Encoding...`);

    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    output = reversestring(input);
    document.getElementById("output").value = output;
  } else if (toatbash.checked) {
    selectedCipher = toatbash.value;
    operation = "Encoding";
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    caesarblock.style.display = "none";
    typeEffect2(`Encoding...`);
    keyblock.style.display = "none";
    output = atbashCipher(input);
    document.getElementById("output").value = output;
  } else if (tocaesar.checked) {
    selectedCipher = tocaesar.value;
    caesarblock.style.display = "block";
    if (!caesarencode.checked && !caesardecode.checked) {
      // output = "Select an Operation!";
    }
    // keyblock.style.display = "none";
    if (caesarencode.checked) {
      output = encodecaesar();
      operation = "Encoding";
      keyblock.style.display = "block";
      typeEffect2(`Encoding...`);
      ciphers.open = false;
    } else if (caesardecode.checked) {
      output = decodecaesar();
      operation = "Decoding";
      keyblock.style.display = "block";
      ciphers.open = false;

      typeEffect2(`Decoding...`);
    } else {
      output = "Select an Operation!";
    }
    document.getElementById("output").value = output;
  } else {
    if (input) {
      output = "Select a Cipher!";
      document.getElementById("output").value = output;
    } else {
      output = "";
      document.getElementById("output").value = output;
    }
  }
  const endTime = performance.now();
  const processingTime = (endTime - startTime).toFixed(2); // Rounds to 2 decimal places
  if (input !== "" && document.getElementById("output").value !== "") {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "block";
      tracker.textContent = `Processed in ${processingTime}ms`;
    });
  } else {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "none";
      tracker.textContent = ``;
    });
  }
  // }
  // ... Your existing encoding
  document.getElementById("output").value = output;

  input = inputfield.value.trim();
  output = document.getElementById("output").value;
  // Only save valid translations
  if (
    output === "" ||
    output === "Select a Cipher!" ||
    output === "Select an Operation!" ||
    output === "[object HTMLTextAreaElement]"
  ) {
    return;
  } else {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (
        output === "" ||
        output === "Select a Cipher!" ||
        output === "Select an Operation!" ||
        output === "[object HTMLTextAreaElement]"
      ) {
        return;
      }
          const history = validateHistory(); // ← Always starts with valid data!

      const lastItem = history[0];

      if (!lastItem || lastItem.output !== output) {
        saveToHistory(input, output, operation, selectedCipher);
      }
      // Only save if input is different from last save
    }, 2500); // 2 seconds delay
  }
  return operation;
}
cancelbtn.onclick = function () {
  const activetranslators = document.querySelectorAll(
    'input[name="translator"]'
  );
  let selectedradio = null;
  for (const radio of activetranslators) {
    if (radio.checked) {
      selectedradio = radio.value;
    }
  }
  document.getElementById("text").value = "";
  document.getElementById("output").value = "";
  if (!selectedradio) {
    ciphheading.textContent = "Ciphers";
    setTimeout(() => {
      typeEffect2(``);
    }, 3000);
    typeEffect2(``);
  }
  setTimeout(() => {
    typeEffect2(``);
  }, 3000);
  typeEffect2(``);
};

function validateHistory() {
  try {
    const stored = localStorage.getItem("translationHistory");

    // If nothing exists, create empty array
    if (!stored) {
      localStorage.setItem("translationHistory", JSON.stringify([]));
      return [];
    }

    // Try to parse and validate
    const history = JSON.parse(stored);

    // If it's not an array, reset it
    if (!Array.isArray(history)) {
      localStorage.setItem("translationHistory", JSON.stringify([]));
      return [];
    }

    // Optional: Clean up any invalid items in the array
    const cleanHistory = history.filter(
      (item) => item && typeof item === "object" && item.input !== undefined
    );

    // Only save back if we cleaned something
    if (cleanHistory.length !== history.length) {
      localStorage.setItem("translationHistory", JSON.stringify(cleanHistory));
    }

    return cleanHistory;
  } catch (error) {
    // Reset on any error
    localStorage.setItem("translationHistory", JSON.stringify([]));
    return [];
  }
}

// Simple history functions
const maxhist = 50;

function formatDateHeader(dateStr) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const target = new Date(dateStr);
  const diffTime = today - target;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays === 2) return "2 days ago";
  if (diffDays === 3) return "3 days ago";
  if (diffDays <= 6) return `${diffDays} days ago`;
  if (diffDays === 7) return "Last week";

  // Older than 2 weeks → full date
  return target.toDateString(); // "Sat Nov 09 2025"
}
function formatTimeDisplay(timeString) {
  if (!timeString) return "";

  // Handle different time formats
  const time = new Date("1970-01-01 " + timeString);
  if (isNaN(time)) return timeString; // Fallback to original

  return time
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/:\d+ /, " "); // Remove seconds
}

function saveToHistory(input, output, operation, cipher, type = "normal", key) {
    const history = validateHistory(); // ← Always starts with valid data!
  if (input === "" || output === "" || output === "Select an operation") {
    return;
  }

  // Prevent duplicates
  if (
    history.length > 0 &&
    history[0].input === input &&
    history[0].output === output
  ) {
    return;
  }
  if (cipher.includes("ULTX")) {
    key = cipher;
  } else {
    if (
      cipher === "Caesar" &&
      document.getElementById("caesardecode")?.checked
    ) {
      operation = "Decoding";
      key = `${keyfield.value || "0"} Backward`;
    }
    if (
      cipher === "Caesar" &&
      document.getElementById("caesarencode")?.checked
    ) {
      operation = "Encoding";
      key = `${keyfield.value || "0"} Forward`;
    }
  }
  const newItem = {
    id: Date.now() + Math.random(),
    type: type, // "normal" or "shared_link"
    input,
    key: key || "Auto Detected",
    output,
    operation,
    cipher: cipher || "Auto Assumed",
    // timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    timestamp: new Date().toISOString(),
    time: new Date().toLocaleTimeString(),
  };

  history.unshift(newItem);

  // Limit

  // if (history.length >= maxhist) {
  //       history.length = maxhist;
  //       toast.warning("History limit reached saving latest 50 translations");
  //     }

  localStorage.setItem("translationHistory", JSON.stringify(history));

  checkAchievements();
}

function showHistory() {
    const history = validateHistory(); // ← Always starts with valid data!
  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");

  document.getElementById("length").textContent = `${history.length}`;
  if (history.length === 0) {
    historyList.innerHTML = "<p>No history yet!</p>";
  }
  // else{
  if (history.length > 0) {
    // Group by date
    const grouped = {};
    history.forEach((item) => {
      const date = item.timestamp.split("T")[0];
      // .split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    let html = "";
    Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const count = grouped[date].length;
        html += `<div class="history-group"><h3>${formatDateHeader(
          date
        )} • ${count} ${count === 1 ? 'Entry' : 'Entries'}</h3>`;
        grouped[date].forEach((item) => {
          html += `<div class="history-item" onclick="openHistoryModal('${
            item.id
          }')">
          <div class="history-content">
            <p><strong> ${item.input}</strong> → ${item.output}</p>
            <small>${item.operation} • ${item.cipher} • ${
            item.type === "opened_link" ? "opened_link •" : ""
          }  ${item.time}</small>
          </div>
          <button class="delete-btn" onclick="event.stopPropagation(); removeHistoryItem('${
            item.id
          }')">×</button>
        </div>`;
        });
        html += `</div>`;
      });
    historyList.innerHTML = html;
  }

  historySection.style.display = "block";
}
function openHistoryModal(id) {
    const history = validateHistory(); // ← Always starts with valid data!
  const item = history.find((h) => h.id == id);
  if (!item) return;
  const dateHeader = formatDateHeader(item.timestamp);
  const formattedTime = formatTimeDisplay(item.time);

  // Combine date and time
  let displayTime;
  if (dateHeader === "Today") {
    displayTime = `${dateHeader} ${formattedTime}`; // "2:30 PM"
  } else if (dateHeader === "Yesterday") {
    displayTime = `${dateHeader} ${formattedTime}`; // Or "Yesterday, 2:30 PM" if you want both
  } else {
    displayTime = `${dateHeader} ${formattedTime}`; // "Jan 15, 2024"
  }
  const modal = document.createElement("div");
  modal.className = "modal-overlay stats-modal";
  modal.innerHTML = `<div class="modal-content stats-content">
     
    
      <div class="stats-header">
        <h3>Translation Details</h3>
        <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
    
          <div class="stats-grid">
       <div class="stat-item">
          <span class="stat-label">Input</span>
          <span class="stat-value">${item.input} </span>
        </div>
       <div class="stat-item">
          <span class="stat-label">Output</span>
          <span class="stat-value">${item.output} </span>
        </div>
               <div class="stat-item">
          <span class="stat-label">Cipher</span>
          <span class="stat-value">${item.cipher || "Auto Assumed"} </span>
        </div>
               <div class="stat-item">
          <span class="stat-label">Key</span>
          <span class="stat-value">${item.key || "Auto Detected"} </span>
        </div>
                       <div class="stat-item">
          <span class="stat-label">Operation</span>
          <span class="stat-value">${item.operation} </span>
        </div>
                       <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value">${displayTime} </span>
        </div>
      </div>

  `;
  document.body.appendChild(modal);
}
let lastDeletedHistory = null;

function removeHistoryItem(id) {
    const history = validateHistory(); // ← Always starts with valid data!
  const index = history.findIndex((item) => item.id == id);
  if (index === -1) return;

  lastDeletedHistory = { item: history[index], index };
  history.splice(index, 1);
  localStorage.setItem("translationHistory", JSON.stringify(history));
  showHistory();

  toast.info(
    `<span>Deleted</span>
    <button onclick="undoDeleteHistory()" style="margin-left:10px;background:#667eea;color:white;padding:4px 12px;border:none;border-radius:8px;cursor:pointer;">Undo</button>
    {countdown}`,
    6000
  );

  setTimeout(() => (lastDeletedHistory = null), 6500);
}

window.undoDeleteHistory = () => {
  if (!lastDeletedHistory) return;
  document.querySelectorAll(".toast").forEach((t) => t.remove());

    const history = validateHistory(); // ← Always starts with valid data!
  history.splice(lastDeletedHistory.index, 0, lastDeletedHistory.item);
  localStorage.setItem("translationHistory", JSON.stringify(history));
  const historySection = document.getElementById("historySection");
  if (historySection.style.display === "block") {
    localStorage.setItem("activetab", "hist");
    document.getElementById("top-home").style.color = "white";
    document.getElementById("top-hist").style.color = "#00f0ff";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";
    document.querySelector(".super-btn").classList.remove("tab-active");
    document.querySelector(".stats-btn").classList.remove("tab-active");
    document.getElementById("ach-btn").classList.remove("tab-active");
    document.getElementById("pic-nav").classList.remove("tab-active");
    document.getElementById("preview2").classList.remove("tab-active");
    document.querySelector(".stats-txt").classList.remove("tab-active-text");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".ach-txt").classList.remove("tab-active-text");
    document.querySelector(".you-txt").classList.remove("tab-active-text");
    document.querySelector(".img-txt").classList.remove("tab-active-text");

    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".hist-btn").classList.add("tab-active");
    showHistory(); // This now properly displays the history
    // history.pushState(null, "", "#history");
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("homepage").style.display = "none";
    document.getElementById("info-sec").style.display = "none";
    document.getElementById("ultx-sec").style.display = "none";
  }
  lastDeletedHistory = null;
  toast.success("Restored!");
};
function shareHistoryAsText() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];

  if (history.length === 0) {
    toast.info("No history yet! Keep translating!");

    return;
  }
  let link = window.location.href;

  if (link.includes("#share")) {
    link = link.replace("#share", "");
  }
  let name = localStorage.getItem("userName");

  let txtContent = `${name}'s CipherX History Export\n`;
  txtContent += `${link}\n`;
  txtContent += `Generated: ${new Date().toLocaleString()}\n`;
  txtContent += `Total entries: ${history.length}\n`;
  txtContent += "=".repeat(50) + "\n\n";

  history.forEach((item, index) => {
    txtContent += `ENTRY #${index + 1}\n`;
    txtContent += `Input: ${item.input || "N/A"}\n`;
    txtContent += `Output: ${item.output || "N/A"}\n`;
    txtContent += `Operation: ${item.operation || "N/A"}\n`;
    txtContent += `Cipher: ${item.type || ""}\n`;
    txtContent += `Cipher: ${item.cipher || "N/A"}\n`;

    txtContent += `Time: ${item.timestamp || "N/A"}\n`;
    txtContent += "-".repeat(40) + "\n\n";
  });
  const message = `My CipherX History:\n${txtContent}\n${link}`;

  if (navigator.share) {
    navigator
      .share({ text: message })
      .then(() => {
        toast.success("Shared successfully!", "3000");
        callNotify("Successfully shared history");
      })
      .catch((err) => {
        toast.error(`An error occured while sharing: ${err}`);

        confirmModal.show(
          `Share cancelled <br> Would you like to download instead!`,
          () => downloadHistoryAsTXT(),
          `Download`
        );
      });
  } else {
    confirmModal.show(
      `Share cancelled <br> Would you like to download instead!`,
      () => downloadHistoryAsTXT(),
      `Download`
    );
  }
}
// Advanced: Share history as a .txt file
function shareHistoryAsFile() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];

  if (history.length === 0) {
    toast.info("No history yet! Keep translating!");

    return;
  }
  let link = window.location.href;

  if (link.includes("#share")) {
    link = link.replace("#share", "");
  }
  let name = localStorage.getItem("userName");
  // Create the file content (same as download function)
  let fileContent = `${name}'s CipherX History Export\n${link}\nGenerated: ${new Date().toLocaleString()}\n\n`;
  history.forEach((item, index) => {
    fileContent += `Entry ${index + 1}:\nInput: ${item.input}\nOutput: ${
      item.output
    }\nOperation: ${item.operation}\nCipher: ${item.cipher}\nTime: ${
      item.timestamp
    }\n────────────\n\n`;
  });

  // Create a Blob and then a File object
  const blob = new Blob([fileContent], { type: "text/plain" });
  const file = new File([blob], `Cipherx-history-${new Date().getTime()}.txt`, {
    type: "text/plain",
  });

  // Check if the browser supports sharing files
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator
      .share({
        title: "CipherX History",
        text: `${name} CipherX history file.`,
        files: [file],
      })
      .then(() => {
        toast.success("File share successful");
        callNotify("File Shared Successfully");
      })
      .catch((error) => {
        toast.error(`Sharing failed: ${error}`);
        confirmModal.show(
          `Share cancelled <br> Would you like to download instead!`,
          () => downloadHistoryAsTXT(),
          `Download`
        );
      });
  } else {
    // Fallback to download if file sharing isn't supported
    confirmModal.show(
      `Share cancelled <br> Would you like to download instead!`,
      () => downloadHistoryAsTXT(),
      `Download`
    );
  }
}

function downloadHistoryAsTXT() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];

  if (history.length === 0) {
    toast.info(`No history yet! <br> Keep translating!`);

    return;
  }
  let link = window.location.href;

  if (link.includes("#share")) {
    link = link.replace("#share", "");
  }
  let name = localStorage.getItem("userName");

  // Create formatted text content
  let txtContent = `${name}'s CipherX History Export\n`;
  txtContent += `${link}\n`;
  txtContent += `Generated: ${new Date().toLocaleString()}\n`;
  txtContent += `Total entries: ${history.length}\n`;
  txtContent += "=".repeat(50) + "\n\n";

  history.forEach((item, index) => {
    txtContent += `ENTRY #${index + 1}\n`;
    txtContent += `Input: ${item.input || "N/A"}\n`;
    txtContent += `Output: ${item.output || "N/A"}\n`;
    txtContent += `Operation: ${item.operation || "N/A"}\n`;
    txtContent += `Cipher: ${item.cipher || "N/A"}\n`;
    txtContent += `Time: ${item.timestamp || "N/A"}\n`;
    txtContent += "-".repeat(40) + "\n\n";
  });

  // Create and trigger download (WORKS OFFLINE)
  const blob = new Blob([txtContent], { type: "text/plain; charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cipherx-history-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up memory

  // Optional: Show success message
  let word;
  if (history.length > 1) {
    word = "entries";
  } else {
    word = "entry";
  }
  toast.success(`History downloaded ${history.length} ${word} saved.`);
  callNotify(`History downloaded ${history.length} ${word} saved.`);
}

function toggleultx() {
  toast.info(
    `Links are generated 2-3 secs after encoding a message for accuracy`,
    "1500"
  );
  showBottomNav();
  document.getElementById("preview1").style.border = "none";
  document.getElementById("pic-nav2").classList.remove("tab-active");
  document.getElementById("preview2").style.border = "none";

  // document.querySelector(".cont1").style.display = "flex";
  document.getElementById("share-tab").style.display = "none";
  document.getElementById("setting-tab").style.display = "none";
  document.getElementById("about-tab").style.display = "none";
  document.getElementById("feedback-tab").style.display = "none";

  getUserName();
  document.getElementById("homepage").style.display = "none";
  const ultxsection = document.getElementById("ultx-sec");
  if (ultxsection.style.display === "none") {
    localStorage.setItem("activetab", "ultx");
    document.getElementById("top-home").style.color = "white";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "#00f0ff";
    document.getElementById("ach-btn").classList.remove("tab-active");
    document.querySelector(".stats-btn").classList.remove("tab-active");
    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".hist-btn").classList.remove("tab-active");
    document.getElementById("pic-nav").classList.remove("tab-active");
    document.getElementById("preview2").classList.remove("tab-active");
    document.querySelector(".stats-txt").classList.remove("tab-active-text");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".hist-txt").classList.remove("tab-active-text");
    document.querySelector(".ach-txt").classList.remove("tab-active-text");
    document.querySelector(".you-txt").classList.remove("tab-active-text");
    document.querySelector(".img-txt").classList.remove("tab-active-text");

    history.pushState(null, "", "#ultx");
    ultxsection.style.display = "flex";
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("homepage").style.display = "none";
    document.getElementById("info-sec").style.display = "none";
    document.getElementById("historySection").style.display = "none";
  } else {
    history.pushState(null, "", "#home");
    document.querySelector(".home-btn").classList.add("tab-active");
    document.querySelector(".home-txt").classList.add("tab-active-text");
    document.querySelector(".super-btn").classList.remove("tab-active");
    document.querySelector(".super-txt").classList.remove("tab-active-text");

    localStorage.setItem("activetab", "home");
    document.getElementById("top-home").style.color = "#00f0ff";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";

    ultxsection.style.display = "none";
    document.getElementById("homepage").style.display = "flex";
    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".super-txt").style.color = "white";
      document.querySelector(".super-btn").style.color = "white";
    } else {
      document.querySelector(".super-txt").style.color = "black";
      document.querySelector(".super-btn").style.color = "black";
    }
  }

  if (ultxsection.style.display === "flex") {
    document.querySelector(".super-txt").classList.add("tab-active-text");
    document.querySelector(".super-btn").classList.add("tab-active");

    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".you-txt").style.color = "white";
      document.querySelector(".img-txt").style.color = "white";
      document.querySelector(".stats-btn").style.color = "white";
      document.querySelector(".stats-txt").style.color = "white";
      document.getElementById("ach-btn").style.color = "white";
      document.querySelector(".ach-txt").style.color = "white";
      document.querySelector(".hist-btn").style.color = "white";
      document.querySelector(".hist-txt").style.color = "white";

      document.querySelector(".home-btn").style.color = "white";

      document.querySelector(".home-txt").style.color = "white";
    } else {
      document.querySelector(".you-txt").style.color = "black";
      document.querySelector(".img-txt").style.color = "black";
      document.querySelector(".stats-btn").style.color = "black";
      document.querySelector(".stats-txt").style.color = "black";
      document.getElementById("ach-btn").style.color = "black";
      document.querySelector(".ach-txt").style.color = "black";
      document.querySelector(".hist-btn").style.color = "black";
      document.querySelector(".hist-txt").style.color = "black";

      document.querySelector(".home-txt").style.color = "black";
      document.querySelector(".home-btn").style.color = "black";
    }
  }
}
function toggleHistory() {
  showBottomNav();

  document.getElementById("share-tab").style.display = "none";
  document.getElementById("setting-tab").style.display = "none";
  document.getElementById("about-tab").style.display = "none";
  document.getElementById("feedback-tab").style.display = "none";

  document.getElementById("preview1").style.border = "none";
  document.getElementById("pic-nav2").classList.remove("tab-active");
  document.getElementById("preview2").style.border = "none";

  getUserName();
  document.getElementById("homepage").style.display = "none";
  const historySection = document.getElementById("historySection");
  if (historySection.style.display === "none") {
    localStorage.setItem("activetab", "hist");
    document.getElementById("top-home").style.color = "white";
    document.getElementById("top-hist").style.color = "#00f0ff";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";
    document.querySelector(".super-btn").classList.remove("tab-active");
    document.querySelector(".stats-btn").classList.remove("tab-active");
    document.getElementById("ach-btn").classList.remove("tab-active");
    document.getElementById("pic-nav").classList.remove("tab-active");
    document.getElementById("preview2").classList.remove("tab-active");
    document.querySelector(".stats-txt").classList.remove("tab-active-text");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".ach-txt").classList.remove("tab-active-text");
    document.querySelector(".you-txt").classList.remove("tab-active-text");
    document.querySelector(".img-txt").classList.remove("tab-active-text");

    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".hist-btn").classList.add("tab-active");
    showHistory(); // This now properly displays the history
    history.pushState(null, "", "#history");
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("homepage").style.display = "none";
    document.getElementById("info-sec").style.display = "none";
    document.getElementById("ultx-sec").style.display = "none";
  } else {
    historySection.style.display = "none";
    history.pushState(null, "", "#home");
    localStorage.setItem("activetab", "home");
    document.querySelector(".home-btn").classList.add("tab-active");
    document.querySelector(".home-txt").classList.add("tab-active-text");
    document.querySelector(".hist-txt").classList.remove("tab-active-text");
    document.querySelector(".hist-btn").classList.remove("tab-active");

    document.getElementById("top-home").style.color = "#00f0ff";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";

    document.getElementById("homepage").style.display = "flex";
    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".hist-txt").style.color = "white";
      document.querySelector(".hist-btn").style.color = "white";
    } else {
      document.querySelector(".hist-txt").style.color = "black";
      document.querySelector(".hist-btn").style.color = "black";
    }
  }

  if (historySection.style.display === "block") {
    document.querySelector(".hist-txt").classList.add("tab-active-text");
    document.querySelector(".hist-btn").classList.add("tab-active");

    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".you-txt").style.color = "white";
      document.querySelector(".img-txt").style.color = "white";
      document.querySelector(".super-btn").style.color = "white";
      document.querySelector(".super-txt").style.color = "white";
      document.querySelector(".stats-btn").style.color = "white";
      document.querySelector(".stats-txt").style.color = "white";
      document.getElementById("ach-btn").style.color = "white";
      document.querySelector(".ach-txt").style.color = "white";

      document.querySelector(".home-btn").style.color = "white";

      document.querySelector(".home-txt").style.color = "white";
    } else {
      document.querySelector(".you-txt").style.color = "black";
      document.querySelector(".img-txt").style.color = "black";
      document.querySelector(".super-btn").style.color = "black";
      document.querySelector(".super-txt").style.color = "black";
      document.querySelector(".stats-btn").style.color = "black";
      document.querySelector(".stats-txt").style.color = "black";
      document.getElementById("ach-btn").style.color = "black";
      document.querySelector(".ach-txt").style.color = "black";
      document.querySelector(".home-txt").style.color = "black";
      document.querySelector(".home-btn").style.color = "black";
    }
  }
}

function clearHistory() {
    const history = validateHistory(); // ← Always starts with valid data!
  if (history.length > 0) {
    function clearHist() {
      localStorage.removeItem("translationHistory");
      toast.success(`History Cleared`);
      toast.info(`Completed Achievements were not wiped!`);
      showHistory();
    }

    confirmModal.show(
      `Do you want to clear history!<br>Uncompleted achievement(s) progress along with stats will be wiped!`,
      () => clearHist(),
      `Reset`
    );
  } else {
    toast.info(`No history to clear!`);
  }
}

function showStats() {
    const history = validateHistory(); // ← Always starts with valid data!
  const totalTranslations = history.length;
  const totalChars = history.reduce((sum, item) => sum + item.input.length, 0);

  toast.info(
    `You've made ${totalTranslations} translations totaling ${totalChars} characters!`
  );
}
// Function to calculate and display stats
function calculateStats() {
    const history = validateHistory(); // ← Always starts with valid data!
  // Get last history

  // Basic counts
  const totalTranslations = history.length;
  const totalCharacters = history.reduce(
    (sum, item) => sum + item.input.length,
    0
  );
  const avglenth = history.length
    ? Math.floor((totalCharacters / history.length).toFixed(1))
    : 0;

  // Most used cipher
  const cipherCount = {};
  history.forEach((item) => {
    cipherCount[item.cipher] = (cipherCount[item.cipher] || 0) + 1;
  });

  let topCipher = "None";
  let maxCount = 0;
  for (const cipher in cipherCount) {
    if (cipherCount[cipher] > maxCount) {
      maxCount = cipherCount[cipher];
      topCipher = cipher;
    }
  }
  if (history.length > 0) {
    const lasthistory = history[0];
    let date = lasthistory.timestamp.split("T")[0];
    let time = lasthistory.time;
    let lDate = formatDateHeader(date);
    let lTime = formatTimeDisplay(time);
    const together = `${lDate} ${lTime}`;
    const firsthistory = getoldest();
    let fhDate = firsthistory.timestamp.split("T")[0];
    let fhTime = firsthistory.time;
    let fDate = formatDateHeader(fhDate);
    let fTime = formatTimeDisplay(fhTime);
    const fTogether = `${fDate} ${fTime}`;
    const firstTranslation = localStorage.getItem("firstTranslation");
    // || "Never";
    const lastTranslation = together;
    if (firstTranslation) {
      localStorage.setItem("firstTranslation", fTogether);
    }
    // localStorage.getItem("lastTranslation") || "Never";
    // Update DOM
    document.getElementById("totalTranslations").textContent =
      totalTranslations;
    document.getElementById("totalCharacters").textContent = totalCharacters;
    document.getElementById("avglength").textContent = avglenth;
    document.getElementById("topCipher").textContent = topCipher;
    document.getElementById("firstTranslation").textContent = firstTranslation;
    document.getElementById("lastTranslation").textContent = lastTranslation;
  }
  return { totalTranslations, totalCharacters, topCipher, firstTranslation };
}

// Toggle stats visibility
function toggleStats() {
  showBottomNav();
  document.getElementById("share-tab").style.display = "none";
  document.getElementById("setting-tab").style.display = "none";
  document.getElementById("about-tab").style.display = "none";
  document.getElementById("feedback-tab").style.display = "none";

  getUserName();
  document.getElementById("preview1").style.border = "none";
  document.getElementById("preview2").style.border = "none";

  document.getElementById("homepage").style.display = "none";

  const statsSection = document.getElementById("statsSection");
  if (statsSection.style.display === "none") {
    calculateStats();
    localStorage.setItem("activetab", "stat");
    document.getElementById("pic-nav2").classList.remove("tab-active");
    document.getElementById("pic-nav").classList.remove("tab-active");
    document.getElementById("preview2").classList.remove("tab-active");

    document.getElementById("ach-btn").classList.remove("tab-active");
    document.querySelector(".super-btn").classList.remove("tab-active");
    document.querySelector(".hist-btn").classList.remove("tab-active");
    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".ach-txt").classList.remove("tab-active-text");
    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".hist-txt").classList.remove("tab-active-text");
    document.querySelector(".you-txt").classList.remove("tab-active-text");
    document.querySelector(".img-txt").classList.remove("tab-active-text");

    history.pushState(null, "", "#stats");
    document.getElementById("top-home").style.color = "white";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "#00f0ff";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";

    statsSection.style.display = "block";
    document.getElementById("historySection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("homepage").style.display = "none";
    document.getElementById("info-sec").style.display = "none";
    document.getElementById("ultx-sec").style.display = "none";
  } else {
    document.getElementById("homepage").style.display = "flex";
    document.getElementById("top-home").style.color = "#00f0ff";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";
    history.pushState(null, "", "#home");

    statsSection.style.display = "none";
    localStorage.setItem("activetab", "home");

    document.querySelector(".home-btn").classList.add("tab-active");
    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".stats-btn").classList.remove("tab-active");
    document.querySelector(".stats-txt").classList.remove("tab-active-text");

    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".stats-txt").style.color = "white";
      document.querySelector(".stats-btn").style.color = "white";
    } else {
      document.querySelector(".stats-txt").style.color = "black";
      document.querySelector(".stats-btn").style.color = "black";
    }
  }
  if (statsSection.style.display === "block") {
    document.querySelector(".stats-btn").classList.add("tab-active");
    document.querySelector(".stats-txt").classList.add("tab-active-text");

    document.getElementById("achievementsBoard").style.display = "none";
    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".you-txt").style.color = "white";
      document.querySelector(".img-txt").style.color = "white";
      document.querySelector(".super-btn").style.color = "white";
      document.querySelector(".super-txt").style.color = "white";
      document.querySelector(".super-txt").style.color = "white";
      document.querySelector(".super-btn").style.color = "white";
      document.getElementById("ach-btn").style.color = "white";
      document.querySelector(".ach-txt").style.color = "white";
      document.querySelector(".hist-btn").style.color = "white";
      document.querySelector(".hist-txt").style.color = "white";
      document.querySelector(".home-btn").style.color = "white";

      document.querySelector(".home-txt").style.color = "white";
    } else {
      document.querySelector(".you-txt").style.color = "black";
      document.querySelector(".img-txt").style.color = "black";
      document.querySelector(".super-btn").style.color = "black";
      document.querySelector(".super-txt").style.color = "black";
      document.querySelector(".hist-btn").style.color = "black";
      document.querySelector(".hist-txt").style.color = "black";
      document.getElementById("ach-btn").style.color = "black";
      document.querySelector(".ach-txt").style.color = "black";
      document.querySelector(".home-txt").style.color = "black";
      document.querySelector(".home-btn").style.color = "black";
    }
  }
}

function icon() {
  showBottomNav();

  getUserName();
  document.getElementById("feedback-tab").style.display = "none";

  document.getElementById("about-tab").style.display = "none";
  document.getElementById("share-tab").style.display = "none";
  document.getElementById("setting-tab").style.display = "none";
  if (document.getElementById("info-sec").style.display === "none") {
    document.getElementById("ach-btn").classList.remove("tab-active");
    document.querySelector(".stats-btn").classList.remove("tab-active");
    document.querySelector(".super-btn").classList.remove("tab-active");
    document.querySelector(".hist-btn").classList.remove("tab-active");
    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".stats-txt").classList.remove("tab-active-text");
    document.querySelector(".hist-txt").classList.remove("tab-active-text");

    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".ach-txt").classList.remove("tab-active-text");
    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".you-txt").classList.add("tab-active-text");
    document.querySelector(".img-txt").classList.add("tab-active-text");

    history.pushState(null, "", "#profile");
    document.getElementById("top-home").style.color = "white";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";
    document.getElementById("ultx-sec").style.display = "none";

    document.getElementById("info-sec").style.display = "flex";
    document.getElementById("historySection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("homepage").style.display = "none";
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("preview1").style.border = "3px solid #00f0ff";
    document.getElementById("pic-nav2").classList.add("tab-active");
    document.getElementById("preview2").classList.add("tab-active");
    document.getElementById("pic-nav").classList.add("tab-active");

    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".super-btn").style.color = "white";
      document.querySelector(".super-txt").style.color = "white";
      document.getElementById("ach-btn").style.color = "white";
      document.querySelector(".ach-txt").style.color = "white";
      document.querySelector(".hist-btn").style.color = "white";
      document.querySelector(".hist-txt").style.color = "white";
      document.querySelector(".home-btn").style.color = "white";
      document.querySelector(".home-txt").style.color = "white";
      document.querySelector(".stats-btn").style.color = "white";
      document.querySelector(".stats-txt").style.color = "white";
    } else {
      document.querySelector(".super-btn").style.color = "black";
      document.querySelector(".super-txt").style.color = "black";

      document.querySelector(".hist-btn").style.color = "black";
      document.querySelector(".hist-txt").style.color = "black";
      document.getElementById("ach-btn").style.color = "black";
      document.querySelector(".ach-txt").style.color = "black";
      document.querySelector(".home-txt").style.color = "black";
      document.querySelector(".home-btn").style.color = "black";
      document.querySelector(".stats-btn").style.color = "black";
      document.querySelector(".stats-txt").style.color = "black";
    }
  } else {
    const acttab = localStorage.getItem("activetab");
    if (acttab === "hist") {
      toggleHistory();
    }
    if (acttab === "stat") {
      toggleStats();
    }
    if (acttab === "ach") {
      toggleach();
    }
    if (acttab === "ultx") {
      toggleultx();
    }
    if (acttab === "home") {
      acthome();
    }
  }
}

// Refresh stats
function refreshStats() {
  calculateStats();
}

// Add this to your main script
document.addEventListener("click", function (event) {
  if (event.target.closest(".icon-btn")) {
    const button = event.target.closest(".icon-btn");
    const svg = button.querySelector(".round");

    if (svg) {
      svg.classList.remove("animating");
      void svg.offsetWidth;
      svg.classList.add("animating");

      setTimeout(() => {
        svg.classList.remove("animating");
      }, 600);
    }
  }
});
function animateSvg(event) {
  // Find the SVG inside the clicked button
  const svg = event.currentTarget.querySelector(".round");
  // Remove any existing animation class to reset
  svg.classList.remove("animating");
  // Force browser reflow to restart animation
  void svg.offsetWidth;
  // Add animating class to trigger CSS animation
  svg.classList.add("animating");
  // Remove class after animation completes
  setTimeout(() => {
    svg.classList.remove("animating");
  }, 600); // Match your animation duration
}

async function getSecretReward() {
  const reward = localStorage.getItem("reward") === "true";
  const hasspecialacess = localStorage.getItem("specialEasterEgg") === "true";
  const activated = localStorage.getItem("activate") === "true";
  let waiting = false;
  if (
    activated &&
    hasspecialacess &&
    reward &&
    localStorage.getItem("rewardblock") === "true"
  ) {
    document.getElementById("easteralert").style.display = "block";
  }

  if (!reward && hasspecialacess) {
    toast.success(
      `Ready for a fun surprise<br>Type "reward/" then "activate/" right now`,
      "1500"
    );
    inputfield.addEventListener(`input`, (e) => {
      const text = e.target.value.toLowerCase();
      if (text === "reward/") {
        localStorage.setItem("reward", "true");
        e.target.value = "";
        toast.success(`Easter Egg instructions activated!`);
        const rewarddet = document.getElementById("reward");
        rewarddet.style.display = "block";
        localStorage.setItem("rewardblock", "true");
      }
    });
  }
  if (hasspecialacess && reward && !activated) {
    toast.info(
      "Type activate/ to get full access to hidden features now",
      "1500"
    );
  }

  inputfield.addEventListener(`input`, (e) => {
    const text = e.target.value.toLowerCase();
    const hasspecialacess = localStorage.getItem("specialEasterEgg") === "true";
    const reward = localStorage.getItem("reward") === "true";

    const activated = localStorage.getItem("activate") === "true";
    if (text === "rage/") {
      rageMode();
    }
    if (text === "roll/") {
      activateroll();
    }
    if (hasspecialacess && text === "activate/" && reward) {
      toast.info(`Easter Egg fully activated`);
      typeEffect2(`Activated`, "orange");
      setTimeout(() => {
        typeEffect2(``);
        e.target.value = "";
      }, 2000);
      localStorage.setItem("activate", "true");
    }
    if (hasspecialacess && activated) {
      switch (text) {
        case "stats/":
          typeEffect2(`Opening`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            toggleStats();
            e.target.value = "";
          }, 2000);
          break;
        case "rewardblock/":
          const rewarddet = document.getElementById("reward");
          rewarddet.style.display = "block";
          break;

        case "hist/":
          typeEffect2(`Opening`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            toggleHistory();
            e.target.value = "";
          }, 2000);
          break;
        case "x hist/":
          typeEffect2(`Deleting History`, "orange");
          setTimeout(() => {
            typeEffect2(``, "");
            clearHistory();
            e.target.value = "";
          }, 2000);
          break;
        case "xxx/":
          typeEffect2(`Erasing`, "red");
          setTimeout(() => {
            typeEffect2(``);
            resetUser();
            e.target.value = "";
          }, 2000);
          break;

        case "ultx/":
          e.target.value = "";
          toggleultx();
          break;

        case "dark/":
          typeEffect2(`Theme Switched to Dark`, "orange");
          let newTheme = "dark";
          setTheme(newTheme);
          setTimeout(() => {
            typeEffect2(``);
            e.target.value = "";
          }, 3000);
          break;
        case "light/":
          typeEffect2(`Theme Switched to Light`, "orange");
          let oldTheme = "light";
          setTheme(oldTheme);
          setTimeout(() => {
            typeEffect2(``);
            e.target.value = "";
          }, 3000);
          break;
        case "color/":
          typeEffect2(`Starting`, "green");
          setTimeout(() => {
            typeEffect2(``);
            let r = prompt(`Enter Background color`);
            toast.info(`To reverse the color change effect reload the page!`);
            document.body.style.backgroundColor = r;
            e.target.value = "";
          }, 3000);
          break;
        case "share/":
          sharesite();
          e.target.value = "";
          break;
        case "share trans/":
          shareTranslation();
          e.target.value = "";
          break;
        case "share ach/":
          shareAchievements();
          e.target.value = "";
          break;
        case "ach/":
          typeEffect2(`Opening`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            toggleach();
            e.target.value = "";
          }, 3000);
          break;

        case "hist down/":
          typeEffect2(`Downloading`, "green");
          setTimeout(() => {
            typeEffect2(``);
            downloadHistoryAsTXT();
            e.target.value = "";
          }, 3000);
          break;

        case "party/":
          typeEffect2(`Party Time🎉🎉🎉`, "green");
          setTimeout(() => {
            typeEffect2(``);
            toast.info(`Entering Party Mode!`);
            activateRainbowTheme();
            e.target.value = "";
          }, 2000);
          break;
        case "fun/":
          if (localStorage.getItem("theme") === "dark") {
            createParticles();
            animateParticles();
          } else {
            toast.info(`Switch to dark theme to activate this reward`);
          }
          break;
      }
    }
  });
}

function shareTranslation() {
  const input = inputfield.value.trim();
  const output = document.getElementById("output").value;
  let operation;
  let cipher;
  if (tomorse.checked) {
    cipher = "Morse";
    if (isMorse(input)) {
      operation = "Decoding";
    } else {
      operation = "Encoding";
    }
  }

  if (tobinary.checked) cipher = "Binary";
  if (isbinary(input)) {
    operation = "Decoding";
  } else {
    operation = "Encoding";
  }

  if (tobase64.checked) {
    cipher = "Base64";
    if (isBase64(input)) {
      operation = "Decoding";
    } else {
      operation = "Encoding";
    }
  }
  if (reverse.checked) {
    cipher = "Reverse";
    operation = "Encoding";
  }
  if (toatbash.checked) {
    operation = "Encoding";
    cipher = "Atbash";
  }
  if (
    !input ||
    !output ||
    output.value === "Select a Cipher" ||
    output.value === "Select an Operation"
  ) {
    toast.info(
      "No translation available for sharing! <br> Translate something first!"
    );
    return;
  }

  const message = `CipherX Translation:\n"${input}" → "${output}"\nType:${cipher}\nOperation:${operation}\n\nTry it at: ${window.location.href}`;

  // Check if Web Share API is supported (mobile devices)
  if (navigator.share) {
    navigator
      .share({
        text: message,
      })
      .then(() => {
        toast.success("Shared successfully!");
      })
      .catch((err) => {
        toast.error(`Share failed due to "${err}" error`);
        fallbackShare(message);
      });
  } else {
    fallbackShare(message);
  }
}
// Fallback for browsers that don't support Web Share API
function fallbackShare(message) {
  // Copy to clipboard
  confirmModal.show(
    `Share cancelled <br> Would you like to copy instead`,
    () => copyToClipboard(),
    `Copy`
  );
  function copyToClipboard() {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        toast.success("Copied to clipboard! Paste anywhere to share!");
      })
      .catch((err) => {
        // Old-school prompt method
        prompt("Copy this to share:", message);
      });
  }
}
function sharesite() {
  let link = window.location.href;

  if (link.includes("#share")) {
    link = link.replace("#share", "");
  }
  const message = `Stop using plain text. I only use CipherX now\nAn awesome multi-cipher translator with 10+ cipher types and cool features worth your time\nTry it out yourself at ${link}`;
  if (navigator.share) {
    navigator
      .share({
        text: message,
      })
      .then(() => {
        toast.success(`Shared successfully<br>Thank you`, "3000");
        callNotify("Thank you for sharing our site");
      })
      .catch((err) => {
        fallbackShare(message);
      });
  } else {
    fallbackShare(message);
  }
  return;
}

// Check achievements whenever history updates
function checkAchievements() {
    const history = validateHistory(); // ← Always starts with valid data!
  const historyCount = history.length;
  const totalTranslations =
    parseInt(localStorage.getItem("totalTranslation")) || historyCount;
  // 🏆 Achievement unlocks
  if (totalTranslations >= 5 && !localStorage.getItem("achievement_5")) {
    toast.success(
      `Achievement Unlocked:"Apprentice Translator" (5 translations)!`,
      "3000"
    );
    setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 4000);
    localStorage.setItem("achievement_5", "true");
  }
  if (totalTranslations >= 15 && !localStorage.getItem("achievement_15")) {
    toast.success(
      'Achievement Unlocked: "Cipher Master" (15 translations)!',
      "1500"
    );
    setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 4000);
    localStorage.setItem("achievement_15", "true");
    // 🎮 ACTIVATE SPECIAL EASTER EGG
    toast.success(`You unlocked the Easter Egg feature!`);

    localStorage.setItem("specialEasterEgg", "true");
    getSecretReward();
  }
  if (totalTranslations >= 30 && !localStorage.getItem("achievement_30")) {
    toast.success(
      'Achievement Unlocked: "Translation Guru" (30 translations)!',
      "1500"
    );
    setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 4000);
    localStorage.setItem("achievement_30", "true");
  }
  if (totalTranslations >= 50 && !localStorage.getItem("achievement_100")) {
    toast.success(
      'Achievement Unlocked: "Translation Overlord" (50 translations)!',
      "1500"
    );
    setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 4000);
    localStorage.setItem("achievement_50", "true");
  }

  // Character count achievement
  const totalChars = history.reduce((sum, item) => sum + item.input.length, 0);
  if (totalChars >= 500 && !localStorage.getItem("achievement_500_chars")) {
    toast.success(
      'Achievement Unlocked: "Word Smith" (500 characters translated)!',
      "1500"
    );
    setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 4000);
    localStorage.setItem("achievement_500_chars", "true");
  }

  // All ciphers achievement
  const usedCiphers = new Set(history.map((item) => item.cipher));
  if (
    usedCiphers.size >= 5 &&
    !localStorage.getItem("achievement_all_ciphers")
  ) {
    toast.success(
      'Achievement Unlocked: "Cipher Collector" (Used all cipher types)!',
      "1500"
    );

    setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 4000);
    localStorage.setItem("achievement_all_ciphers", "true");
  }

  if (historyCount > totalTranslations) {
    localStorage.setItem("totalTranslations", historyCount);
  }
}
function showAchievements() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const totalTranslations =
    parseInt(localStorage.getItem("totalTranslation")) || history.length;
  const usedCiphers = new Set(history.map((item) => item.cipher)).size;

  const totalChars = history.reduce((sum, item) => sum + item.input.length, 0);

  const board = document.getElementById("achievementsBoard");
  const list = document.getElementById("achievementsList");

  const achievements = [
    {
      id: "achievement_5",
      title: "Apprentice Translator:",
      emoji: "🔓",
      desc: "Translate five times",
      target: 5,
      current: Math.min(totalTranslations, 5),
    },

    {
      id: "achievement_15",
      title: "Cipher Master:",
      emoji: "🔓",
      desc: "Translate 15 times",
      target: 15,
      current: Math.min(totalTranslations, 15),
    },
    {
      id: "specialEasterEgg",
      title: "Easter Egg Features:",
      emoji: "🔓",
      desc: "Translate 15 times",
      target: 15,
      current: Math.min(totalTranslations, 15),
    },
    {
      id: "achievement_30",
      title: "Translation Guru:",
      emoji: "🔓",
      desc: "Translate 30 times",
      target: 30,
      current: Math.min(totalTranslations, 30),
    },

    {
      id: "achievement_all_ciphers",
      title: "Cipher Collector:",
      emoji: "🔓",
      desc: "Use all Ciphers",
      target: 6,
      current: usedCiphers,
    },
    {
      id: "achievement_500_chars",
      title: "Word Smith:",
      emoji: "🔓",
      desc: "Translate 500 chars",
      target: 500,
      current: Math.min(totalChars, 500),
    },
    {
      id: "achievement_50",
      title: "Translation Overlord:",
      emoji: "🔓",
      desc: "Translate 50 times",
      target: 50,
      current: Math.min(totalTranslations, 50),
    },
  ];
  let achievementCount = Object.keys(localStorage).filter((key) =>
    key.startsWith("achievement_")
  ).length;
  achievementCount += Object.keys(localStorage).filter((key) =>
    key.startsWith("special")
  ).length;
  document.getElementById(
    "achlength"
  ).textContent = `Completed: ${achievementCount}/${achievements.length}`;
  list.innerHTML = achievements
    .map((ach) => {
      const progress = (ach.current / ach.target) * 100;
      return `
        <div style="margin: 10px 0; padding: 10px; border-radius: 5px;" class="achievement-card">
            <span style="font-size: 1.5em;">${
              localStorage.getItem(ach.id) ? "🏆" : "🔒"
            }</span>
            <strong>${ach.title}</strong>
            ${
              localStorage.getItem(ach.id)
                ? `✅ Unlocked! <br> <progress max="100" value="100"></progress>`
                : ` Locked <br> 
                <progress max="100" value="${Math.round(progress)}"></progress>
                (${ach.desc})
            `
            }
            <span>${localStorage.getItem(ach.id) ? `(${ach.desc})` : ""}</span>
        </div>
  `;
    })
    .join("");

  board.style.display = "block";
}

function acthome() {
  showBottomNav();

  localStorage.setItem("activetab", "home");
  history.pushState(null, "", "#home");
  getUserName();
  document.getElementById("ach-btn").classList.remove("tab-active");
  document.querySelector(".stats-btn").classList.remove("tab-active");
  document.querySelector(".super-btn").classList.remove("tab-active");
  document.querySelector(".hist-btn").classList.remove("tab-active");
  document.getElementById("pic-nav").classList.remove("tab-active");

  document.querySelector(".home-btn").classList.add("tab-active");
  document.querySelector(".home-txt").classList.add("tab-active-text");

  document.getElementById("pic-nav2").classList.remove("tab-active");
  document.getElementById("preview2").classList.remove("tab-active");
  document.querySelector(".ach-txt").classList.remove("tab-active-text");
  document.querySelector(".hist-txt").classList.remove("tab-active-text");
  document.querySelector(".stats-txt").classList.remove("tab-active-text");
  document.querySelector(".super-txt").classList.remove("tab-active-text");
  document.querySelector(".you-txt").classList.remove("tab-active-text");
  document.querySelector(".img-txt").classList.remove("tab-active-text");

  document.getElementById("preview1").style.border = "none";
  document.getElementById("preview2").style.border = "none";

  document.getElementById("ultx-sec").style.display = "none";
  document.getElementById("share-tab").style.display = "none";
  document.getElementById("setting-tab").style.display = "none";
  document.getElementById("about-tab").style.display = "none";
  document.getElementById("feedback-tab").style.display = "none";

  document.getElementById("info-sec").style.display = "none";
  document.getElementById("historySection").style.display = "none";
  document.getElementById("statsSection").style.display = "none";
  document.getElementById("achievementsBoard").style.display = "none";
  document.getElementById("homepage").style.display = "flex";
  document.getElementById("top-home").style.color = "#00f0ff";
  document.getElementById("top-hist").style.color = "white";
  document.getElementById("top-stat").style.color = "white";
  document.getElementById("top-ach").style.color = "white";
  document.getElementById("top-ultx").style.color = "white";

  document.getElementById("achievementsBoard").style.display = "none";

  if (localStorage.getItem("theme") === "dark") {
    document.querySelector(".you-txt").style.color = "white";
    document.querySelector(".img-txt").style.color = "white";
    document.querySelector(".super-btn").style.color = "white";
    document.querySelector(".super-txt").style.color = "white";
    document.querySelector(".stats-btn").style.color = "white";
    document.querySelector(".stats-txt").style.color = "white";
    document.getElementById("ach-btn").style.color = "white";
    document.querySelector(".ach-txt").style.color = "white";
    document.querySelector(".hist-btn").style.color = "white";

    document.querySelector(".hist-txt").style.color = "white";
  } else {
    document.querySelector(".super-btn").style.color = "black";
    document.querySelector(".super-txt").style.color = "black";
    document.querySelector(".you-txt").style.color = "black";
    document.querySelector(".img-txt").style.color = "black";
    document.getElementById("ach-btn").style.color = "black";
    document.querySelector(".ach-txt").style.color = "black";
    document.querySelector(".hist-btn").style.color = "black";
    document.querySelector(".stats-btn").style.color = "black";
    document.querySelector(".stats-txt").style.color = "black";
    document.querySelector(".hist-txt").style.color = "black";
  }
}
function toggleach() {
  showBottomNav();

  document.getElementById("preview1").style.border = "none";
  document.getElementById("pic-nav2").classList.remove("tab-active");
  document.getElementById("preview2").style.border = "none";

  getUserName();
  document.getElementById("share-tab").style.display = "none";
  document.getElementById("setting-tab").style.display = "none";
  document.getElementById("about-tab").style.display = "none";
  document.getElementById("feedback-tab").style.display = "none";

  document.getElementById("homepage").style.display = "none";
  if (document.getElementById("achievementsBoard").style.display === "none") {
    localStorage.setItem("activetab", "ach");
    document.querySelector(".home-btn").classList.remove("tab-active");
    document.querySelector(".stats-btn").classList.remove("tab-active");
    document.querySelector(".super-btn").classList.remove("tab-active");
    document.querySelector(".hist-btn").classList.remove("tab-active");
    document.getElementById("pic-nav").classList.remove("tab-active");
    document.getElementById("preview2").classList.remove("tab-active");
    document.querySelector(".home-txt").classList.remove("tab-active-text");
    document.querySelector(".hist-txt").classList.remove("tab-active-text");
    document.querySelector(".stats-txt").classList.remove("tab-active-text");
    document.querySelector(".super-txt").classList.remove("tab-active-text");
    document.querySelector(".you-txt").classList.remove("tab-active-text");
    document.querySelector(".img-txt").classList.remove("tab-active-text");

    document.getElementById("top-home").style.color = "white";
    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "#00f0ff";
    document.getElementById("top-ultx").style.color = "white";
    document.getElementById("ach-btn").classList.add("tab-active");
    document.querySelector(".ach-txt").classList.add("tab-active-text");

    history.pushState(null, "", "#ach");

    showAchievements();
    document.getElementById("ultx-sec").style.display = "none";

    document.getElementById("historySection").style.display = "none";
    document.getElementById("info-sec").style.display = "none";
    document.getElementById("statsSection").style.display = "none";
    if (localStorage.getItem("theme") === "dark") {
      document.querySelector(".home-btn").style.color = "white";
      document.querySelector(".super-btn").style.color = "white";
      document.querySelector(".super-txt").style.color = "white";

      document.querySelector(".you-txt").style.color = "white";
      document.querySelector(".img-txt").style.color = "white";

      document.querySelector(".home-txt").style.color = "white";
      document.querySelector(".hist-btn").style.color = "white";
      document.querySelector(".stats-btn").style.color = "white";
      document.querySelector(".stats-txt").style.color = "white";
      document.querySelector(".hist-txt").style.color = "white";
    } else {
      document.querySelector(".home-btn").style.color = "black";
      document.querySelector(".stats-btn").style.color = "black";
      document.querySelector(".stats-txt").style.color = "black";
      document.querySelector(".home-txt").style.color = "black";
      document.querySelector(".super-btn").style.color = "black";
      document.querySelector(".super-txt").style.color = "black";
      document.querySelector(".you-txt").style.color = "black";
      document.querySelector(".img-txt").style.color = "black";
      document.querySelector(".hist-btn").style.color = "black";

      document.querySelector(".hist-txt").style.color = "black";
    }
  } else {
    document.getElementById("ach-btn").classList.remove("tab-active");
    document.querySelector(".ach-txt").classList.remove("tab-active-text");

    history.pushState(null, "", "#home");
    document.getElementById("top-home").style.color = "#00f0ff";
    document.querySelector(".home-btn").classList.add("tab-active");
    document.querySelector(".home-txt").classList.add("tab-active-text");

    document.getElementById("top-hist").style.color = "white";
    document.getElementById("top-stat").style.color = "white";
    document.getElementById("top-ach").style.color = "white";
    document.getElementById("top-ultx").style.color = "white";

    document.getElementById("achievementsBoard").style.display = "none";
    document.getElementById("homepage").style.display = "flex";
    localStorage.setItem("activetab", "home");

    if (localStorage.getItem("theme") === "dark") {
      document.getElementById("ach-btn").style.color = "white";
      document.querySelector(".ach-txt").style.color = "white";
    } else {
      document.getElementById("ach-btn").style.color = "black";
      document.querySelector(".ach-txt").style.color = "black";
    }
  }
}

function shareAchievements() {
  const achieved = [
    localStorage.getItem("achievement_5") && "🏆 Apprentice Translator:",
    localStorage.getItem("achievement_15") && "🏆 Cipher Master:",
    localStorage.getItem("specialEasterEgg") && "🏆 Easter Egg Features:",
    localStorage.getItem("achievement_30") && "🏆 Translation Guru:",
    localStorage.getItem("achievement_speedster") && "🏆 Speedster:",

    localStorage.getItem("achievement_all_ciphers") && "🏆 Cipher Collector:",
    localStorage.getItem("achievement_500_chars") && "🏆 Word Smith:",
    localStorage.getItem("achievement_100") && "🏆 Translation Overlord:",
  ].filter(Boolean);
  let name = localStorage.getItem("userName");

  if (achieved.length === 0) {
    toast.info("No achievements yet! Keep translating!");
    return;
  }
  if (achieved.length >= 6) {
    toast.success(`You are a real Boss`);
  }
  let link = window.location.href;

  if (link.includes("#share")) {
    link = link.replace("#share", "");
  }
  const message = `${name}'s CipherX Achievements:\n${achieved.join(
    "\n"
  )}\n\nTry to beat me at: ${link}`;

  if (navigator.share) {
    navigator
      .share({ text: message })
      .then(() => {
        callNotify("Successfully shared achievements");
      })
      .catch((err) => {
        fallbackShare(message);
      });
  } else {
    fallbackShare(message);
  }
}
function activateRainbowTheme() {
  document.body.classList.toggle("rainbow-theme");
}
activateRainbowTheme();
function activateroll() {
  document.body.classList.add("roll");
}

// Converts string to Base64, robustly handling Unicode
function utf8_to_b64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode("0x" + p1);
    })
  );
}

// Decodes Base64 to string, robustly handling Unicode
function b64_to_utf8(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function superEncode(text) {
  if (!text) {
  }
  // Available Ciphers: 1 (Hex), 2 (Reverse), 3 (Atbash)
  const allCiphers = ["1", "2", "3", "4"];

  // Phase 1: Two random layers (Layer A and Layer B)
  const layerA = allCiphers[Math.floor(Math.random() * allCiphers.length)];
  const layerB = allCiphers[Math.floor(Math.random() * allCiphers.length)];
  const phase1Sequence = [layerA, layerB];

  // Phase 2: A final, fixed 'Reverse' or 'Atbash' layer (Layer C)
  const layerC = Math.random() > 0.5 ? "2" : "3"; // 2=Reverse, 3=Atbash
  const phase2Sequence = [layerC];

  let encodedText = text;
  const steps = [];

  // Apply Phase 1 (Layer A & B)
  phase1Sequence.forEach((cipherNum) => {
    const cipherName = getCipherName(cipherNum);
    encodedText = encodeCipher(encodedText, cipherName);
    steps.push(
      `${cipherName} (${cipherNum}): ${encodedText.substring(0, 50)}...`
    );
  });

  // Apply Phase 2 (Layer C)
  phase2Sequence.forEach((cipherNum) => {
    const cipherName = getCipherName(cipherNum);
    encodedText = encodeCipher(encodedText, cipherName);
    steps.push(
      `${cipherName} (${cipherNum}): ${encodedText.substring(0, 50)}...`
    );
  });

  // FINAL: Robust Base64 encode
  encodedText = utf8_to_b64(encodedText);
  steps.push(`Base64: ${encodedText}`);

  // Generate key: [Layer A Code][Layer B Code][Layer C Code][Padding]
  // Key example: 122AAA (Hex, Reverse, Reverse, Padding) - 6 characters long
  const keyLetter = layerC === "2" ? "R" : "A";
  const key = phase1Sequence.join("") + layerC + keyLetter.repeat(3); // Total 6 chars

  return {
    encoded: encodedText,
    key: key,
    steps: steps,
  };
}

// ==========================================================
// 🔓 SUPER DECODE FUNCTION
// ==========================================================

function superDecode(encodedText, key) {
  if (!key || key.length !== 6) {
    throw new Error(
      "Invalid key format. Key should be 6 characters (e.g., 123AAA)."
    );
  }

  // 1. Get the sequence from the key
  const layerC = key.substring(2, 3); // The third number/cipher code
  const layerB = key.substring(1, 2);
  const layerA = key.substring(0, 1);

  // 2. Determine the full ENCODE sequence (for correct REVERSAL)
  const encodeSequence = [layerA, layerB, layerC];

  // 3. Decode Base64 first (using robust helper)
  let decodedText = b64_to_utf8(encodedText);

  // 4. Reverse the ENCODE sequence to DECODE
  encodeSequence.reverse().forEach((cipherNum, index) => {
    const cipherName = getCipherName(cipherNum);
    try {
      decodedText = decodeCipher(decodedText, cipherName);
    } catch (e) {
      // Provide context on which step failed for easier debugging
      throw new Error(
        `Critical decode error at step ${
          index + 1
        } (Cipher: ${cipherName}). Key or data corrupted.`
      );
    }
  });

  return decodedText;
}

// ==========================================================
// 🔧 HELPER FUNCTIONS
// ==========================================================

function getCipherName(code) {
  const cipherMap = {
    1: "hex",
    2: "reverse",
    3: "atbash",
    4: "rot13",
  };
  return cipherMap[code];
}

function encodeCipher(text, cipherName) {
  switch (cipherName) {
    case "hex":
      return encodeHex(text);
    case "reverse":
      return reversestring(text);
    case "atbash":
      return atbashCipher(text);
    case "rot13":
      return encodeRot13(text);
    default:
      return text;
  }
}

function decodeCipher(text, cipherName) {
  switch (cipherName) {
    case "hex":
      return decodeHex(text);
    case "reverse":
      return reversestring(text);
    case "atbash":
      return atbashCipher(text); // Atbash is its own inverse
    case "rot13":
      return encodeRot13(text);
    default:
      return text;
  }
}
document.getElementById("inputText").addEventListener("input", function () {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || !sessionStorage.getItem("no_fullscreen")) {
  // Wait a tiny bit so it still counts as user gesture
  setTimeout(() => {

 if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
        sessionStorage.setItem("no_fullscreen", "true");

  }, 1000); // 1 second after load — feels natural
} else{
}
  if (
    document.getElementById("inputText").value === "" &&
    document.getElementById("outputText").value === ""
  ) {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "none";
      tracker.textContent = ``;
    });
  }
  translatesuper();
  // {
});
// ==========================================================
// 💻 UI HANDLERS
// ==========================================================
function handleSuperEncode() {
  const input = document.getElementById("inputText").value.trim();
  const output = document.getElementById("outputText").value;
  const result = superEncode(input);
  try {
    document.getElementById("outputText").value = result.encoded;
    let operation = "Encoding";
    document.getElementById(
      "keyDisplay"
    ).textContent = `Encode Key: ${result.key}`;
    document.getElementById(
      "stepsLog"
    ).textContent = `Encoding successful with key: ${result.key}`;
  } catch (error) {
    toast.error("Encoding Failed");
    document.getElementById("stepsLog").textContent = "Error during encoding.";
  }
  // Only save valid translations
  if (output === "" || output === "[object HTMLTextAreaElement]") {
    return;
  } else {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (output === "" || output === "[object HTMLTextAreaElement]") {
        return;
      }
       const history = validateHistory(); // ← Always starts with valid data!

      const lastItem = history[0];

      if (!lastItem || lastItem.output !== output) {
        saveToHistory(input, output, operation, `ULTX(${result.key})`);
      }
      // Only save if input is different from last save
    }, 2500); // 2 seconds delay
  }
}

function handleSuperDecode() {
  const encodedText = document.getElementById("inputText").value.trim();
  let key = document.getElementById("decodekey").value.trim();

  document.getElementById("stepsLog").textContent =
    "Tip: Ensure you input correct encoding key first to enable efficient and accurate decoding";
  if (key.length !== 6) {
    document.getElementById("stepsLog").textContent =
      "Error: Empty/Incomplete key can not run";

    return;
  }

  try {
    const decoded = superDecode(encodedText, key);
    document.getElementById("outputText").value = decoded;

    document.getElementById(
      "stepsLog"
    ).textContent = `Decoding successful with key: ${key}`;
    clearTimeout(debounceTimer);
    if (
      encodedText === "" ||
      document.getElementById("outputText").value === ""
    ) {
      document.getElementById(
        "stepsLog"
      ).textContent = `Error: Incomplete/wrong text/key`;
      // return;
    }
    // Only save valid translations
    if (output === "" || output === "[object HTMLTextAreaElement]") {
      return;
    } else {
      // Debounce: wait 2 seconds after typing stops
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (output === "" || output === "[object HTMLTextAreaElement]") {
          return;
        }
            const history = validateHistory(); // ← Always starts with valid data!

        const lastItem = history[0];

        if (!lastItem || lastItem.output !== output) {
          saveToHistory(input, output, operation, `ULTX${key}`);
        }
        // Only save if input is different from last save
      }, 2500); // 2 seconds delay
    } // 4 seconds delay
  } catch (error) {
    document.getElementById("outputText").value = "";
    document.getElementById(
      "stepsLog"
    ).textContent += `\nDecoding failed for key: ${key}\nError: ${error.message}`;
  }
}
document.getElementById("decodekey").addEventListener("input", function () {
  translatesuper();
});
document.querySelectorAll("input[name='super']").forEach((radio) => {
  radio.addEventListener("change", function () {
    translatesuper();
  });
});
function ultxclear() {
  document.getElementById("outputText").value = "";
  document.getElementById("inputText").value = "";
  const tracker = document.querySelectorAll(".tracker");
  tracker.forEach((tracker) => {
    tracker.style.display = "none";
    tracker.textContent = ``;
  });
  document.getElementById("stepsLog").textContent =
    "Encoding/Decoding Process Feedback";
  document.getElementById("shareLinkDisplay").textContent = "Link for sharing encoded message";

  document.getElementById("keyDisplay").textContent = "Encode Key:";
}
function ultxclear2() {
  const tracker = document.querySelectorAll(".tracker");
  tracker.forEach((tracker) => {
    tracker.style.display = "none";
    tracker.textContent = ``;
  });
  document.getElementById("stepsLog").textContent = ``;

  document.getElementById("keyDisplay").textContent = "Encode Key:";
  document.getElementById("shareLinkDisplay").textContent = "Link for sharing encoded message";
  document.getElementById("superkeyblock").style.display = "none";
  document.getElementById("linkblock").style.display = "";
}

function translatesuper() {

  const startTime = performance.now();
  if (document.getElementById("superencode").checked) {
    document.getElementById("superkeyblock").style.display = "none";
    document.getElementById("linkblock").style.display = "flex";

    if (
      document.getElementById("inputText").value === "" ||
      document.getElementById("inputText").value === " "
    ) {
      document.getElementById("keyDisplay").textContent = "Encode Key:";
      document.getElementById("outputText").value = "";
      document.getElementById("stepsLog").textContent = ``;
      if (document.getElementById("inputText").value.length < 1) {
        document.getElementById("shareLinkDisplay").textContent = "Link for sharing encoded message";
      }
      const tracker = document.querySelectorAll(".tracker");
      tracker.forEach((tracker) => {
        tracker.style.display = "none";
        tracker.textContent = ``;
      });
      return;
    } else {
      document.getElementById("keyDisplay").style.display = "block";
      const debouncedGenerateLinkAdvanced = advancedDebounce(
        generateShareableLink,
        1500,
        {
          leading: false, // Don't call immediately on first keystroke
          trailing: true, // Do call after user stops typing
          maxWait: 4000, // Maximum wait time of 5 seconds
        }
      );
      debouncedGenerateLinkAdvanced();
      handleSuperEncode();
      operation = "Encoding";
      if (document.getElementById("inputText").value.length > 0) {
        document.getElementById("linkblock").style.display = "flex";
      }
    }
  } else if (document.getElementById("superdecode").checked) {
    document.getElementById("linkblock").style.display = "none";

    if (document.getElementById("decodekey").value.length < 6) {
      document.getElementById("outputText").value = "";
    }
    if (
      document.getElementById("inputText").value === "" ||
      document.getElementById("inputText").value === " "
    ) {
      document.getElementById("outputText").value = "";
      document.getElementById("stepsLog").textContent = ``;
      const tracker = document.querySelectorAll(".tracker");
      tracker.forEach((tracker) => {
        tracker.style.display = "none";
        tracker.textContent = ``;
      });
    }
    handleSuperDecode();
    document.getElementById("keyDisplay").style.display = "none";
    operation = decoding;
    document.getElementById("superkeyblock").style.display = "block";
  } else {
    document.getElementById("outputText").value = `Select an operation`;
  }
  const endTime = performance.now();
  const processingTime = (endTime - startTime).toFixed(2); // Rounds to 2 decimal places
  if (
    document.getElementById("inputText").value !== "" &&
    document.getElementById("outputText").value !== ""
  ) {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "block";
      tracker.textContent = `Processed in ${processingTime}ms`;
    });
  } else if (
    document.getElementById("inputText").value === "" &&
    document.getElementById("outputText").value === ""
  ) {
    const tracker = document.querySelectorAll(".tracker");
    tracker.forEach((tracker) => {
      tracker.style.display = "none";
      tracker.textContent = ``;
    });
  }
}
function advancedDebounce(func, wait, options = {}) {
  let timeout;
  let lastCallTime;
  let lastResult;

  const { leading = false, trailing = true, maxWait } = options;

  return function executedFunction(...args) {
    const context = this;
    const currentTime = Date.now();

    const isLeading = leading && !timeout;
    const shouldCall = !timeout && trailing;

    // Clear existing timeout
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // Handle maxWait
    if (maxWait && !timeout && currentTime - lastCallTime >= maxWait) {
      lastCallTime = currentTime;
      lastResult = func.apply(context, args);
      return lastResult;
    }

    // Set new timeout
    timeout = setTimeout(() => {
      timeout = null;
      if (trailing || lastCallTime === currentTime) {
        lastResult = func.apply(context, args);
      }
      lastCallTime = currentTime;
    }, wait);

    // Handle leading edge
    if (isLeading) {
      lastCallTime = currentTime;
      lastResult = func.apply(context, args);
      return lastResult;
    }

    return lastResult;
  };
}
document.getElementById("linkExpiry").addEventListener("change", (e) => {
  localStorage.setItem("ultxExpiry", e.target.value);
  getExpValue();
  setMessage();
});
document.getElementById("maxView").addEventListener("change", (e) => {
  localStorage.setItem("maxView", e.target.value);
  getMaxView();
  setMessage();
});
function getMaxView() {
  const maxViews = localStorage.getItem("maxView");
  if (!maxViews) {
    localStorage.setItem("maxView", "0");
    document.getElementById("mv0").checked = true;
    document.getElementById("mvHeading").textContent = "Infinite";
    document.getElementById("maxView").open = false;
  } else {
    switch (maxViews) {
      case "zero":
        document.getElementById("mv0").checked = true;
        document.getElementById("mvHeading").textContent = "Infinite";

        document.getElementById("maxView").open = false;
        break;
      case "one":
        document.getElementById("mv1").checked = true;
        document.getElementById("mvHeading").textContent = "Once";
        document.getElementById("maxView").open = false;

        break;
      case "three":
        document.getElementById("mv3").checked = true;
        document.getElementById("mvHeading").textContent = "3 views";
        document.getElementById("maxView").open = false;

        break;
      default:
        localStorage.setItem("maxView", "0");
        document.getElementById("mv0").checked = true;
        document.getElementById("mvHeading").textContent = "Infinite";
        document.getElementById("maxView").open = false;
    }
  }
}
function setMessage() {
  const expiry = localStorage.getItem("ultxExpiry");
  const maxViews = localStorage.getItem("maxView");
  let noViews;
  let time;
  switch (expiry) {
    case "900000":
      time = "15 minutes";
      break;
    case "3600000":
      time = "1 hour";

      break;
    case "86400000":
      time = "1 day";

      break;
    case "259200000":
      time = "3 days";

      break;
    case "604800000":
      time = "1 week";

      break;
    case "2592000000":
      time = "1 month";
      break;
    default:
      time = "Unlimited";
  }

  switch (maxViews) {
    case "one":
      noViews = "Once(Burns after reading)";
      break;
    case "three":
      noViews = "Thrice";
      break;
    default:
      noViews = "Unlimited";
  }
  if (noViews === "Unlimited" && time === "Unlimited") {
    document.getElementById(
      "mvExp"
    ).textContent = `Your message can be viewed infinite times`;
    document.getElementById(
      "timeLine"
    ).textContent = `Your message can be viewed infinite times`;
  } else if (time === "Unlimited" && noViews !== "Unlimited") {
    document.getElementById(
      "mvExp"
    ).textContent = `Your message can be viewed ${noViews} `;
    document.getElementById(
      "timeLine"
    ).textContent = `Your message can be viewed ${noViews} `;
  } else if (noViews === "Unlimited" && time !== "Unlimited") {
    document.getElementById(
      "mvExp"
    ).textContent = `Your message can be viewed infinitely within ${time}`;
    document.getElementById(
      "timeLine"
    ).textContent = `Your message can be viewed infinitely within ${time} `;
  } else {
    document.getElementById(
      "mvExp"
    ).textContent = `Your message can be viewed ${noViews} within ${time}`;
    document.getElementById(
      "timeLine"
    ).textContent = `Your message can be viewed ${noViews} within ${time}`;
  }

  // return time
}
function getExpValue() {
  const expiry = localStorage.getItem("ultxExpiry");
  if (!expiry) {
    localStorage.setItem("ultxExpiry", "0");
    document.getElementById("expNone").checked = true;
    document.getElementById("expHeading").textContent = "Forever";
    document.getElementById("linkExpiry").open = false;
  } else {
    switch (expiry) {
      case "900000":
        document.getElementById("expMin").checked = true;
        document.getElementById("expHeading").textContent = "15 minutes";
        document.getElementById("linkExpiry").open = false;
        break;
      case "3600000":
        document.getElementById("expHour").checked = true;
        document.getElementById("expHeading").textContent = "1 hour";
        document.getElementById("linkExpiry").open = false;

        break;
      case "86400000":
        document.getElementById("expDay").checked = true;
        document.getElementById("expHeading").textContent = "1 day";
        document.getElementById("linkExpiry").open = false;

        break;
      case "259200000":
        document.getElementById("expDays").checked = true;
        document.getElementById("expHeading").textContent = "3 days";
        document.getElementById("linkExpiry").open = false;

        break;
      case "604800000":
        document.getElementById("expWeek").checked = true;
        document.getElementById("expHeading").textContent = "1 week";
        document.getElementById("linkExpiry").open = false;

        break;
      case "2592000000":
        document.getElementById("expMonth").checked = true;
        document.getElementById("expHeading").textContent = "1 month";
        document.getElementById("linkExpiry").open = false;

        break;
      default:
        localStorage.setItem("ultxExpiry", "0");
        document.getElementById("expNone").checked = true;
        document.getElementById("expHeading").textContent = "Forever";
        document.getElementById("linkExpiry").open = false;
    }
  }
}

// === timeAgo() — FIXED TO TAKE expiry timestamp ===
function timeAgo(expiredTimestamp) {
  const now = Date.now();
  const diff = now - expiredTimestamp; // ← MUST BE NOW - EXPIRED TIME

  if (diff < 0) return "not expired yet"; // future

  const MINUTE = 60000;
  const HOUR = 3600000;
  const DAY = 86400000;
  const WEEK = 604800000;
  const MONTH = 2592000000;
  const YEAR = 31536000000;
  2 * YEAR + MONTH;
  if (diff < MINUTE) return "just now";
  if (diff < 2 * MINUTE) return "1 minute ago";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} minutes ago`;
  if (diff < 2 * HOUR) return "1 hour ago";
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hours ago`;
  if (diff < 2 * DAY) return "1 day ago";
  if (diff < WEEK) return `${Math.floor(diff / DAY)} days ago`;
  if (diff < 2 * WEEK) return "1 week ago";
  if (diff < MONTH) return `${Math.floor(diff / WEEK)} weeks ago`;
  if (diff < 2 * MONTH) return "1 month ago";
  if (diff < YEAR) return `${Math.floor(diff / MONTH)} months ago`;
  if (diff < 2 * YEAR) return "1 year ago";

  const years = Math.floor(diff / YEAR);
  const months = Math.floor((diff % YEAR) / MONTH);
  return months === 0 ? ` ${years} years ago` : ` ${years}yr ${months}mo ago`;
}

async function generateShareableLink() {
  const encodedMessage = document.getElementById("outputText").value;
  const results = document.getElementById("keyDisplay").textContent;
  const userPin = localStorage.getItem("userPin") || "dXt@1111";
  let result = results.replace("Encode Key:", "").trim();
  if (!encodedMessage) {
    return;
  }
  const expiryMs = parseInt(localStorage.getItem("ultxExpiry") || "0");
  const expiry = expiryMs === 0 ? 0 : Date.now() + expiryMs;
  // const expiry = Date.now() + 60000;
  const views = atbashCipher(localStorage.getItem("maxView"));
  const pre = Math.random().toString(36).slice(2, 6);
  const hidViews = pre + views;
  // In link data
  // Create shareable data
  const layer = Math.floor(Math.random() * 2) + 1;
  const shareData = {
    message: encodedMessage,
    exp: expiry,
    expval: expiryMs,
    expTime: Date.now(),
    key: result,
    pin: userPin,
    mode: "super_decode",
    mViews: hidViews,
    timestamp: new Date().toISOString(),
  };

  let data = JSON.stringify(shareData);
  data = btoa(data);
  switch (layer) {
    case 1:
      data = atbashCipher(data);
      break;
    case 2:
      data = encodeRot13(data);
      break;
  }
  // Convert to base64 for URL
  const encodedData = data;
  const shareLink = `${window.location.origin}${window.location.pathname}#share=${layer}${encodedData}`;
  const API_TOKEN =
    "GLINvyU3WCK5YVSvLIVDXFBmbU6z1yLRgswqylf1SeN3f5Ex2bY0xmJKi2Jg";
  const API_URL = "https://api.tinyurl.com/create";

  // Optional: You can predefine a custom alias for a branded link (e.g., 'cipherx-message-123')

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        // 2. Set the content type for JSON payload
        "Content-Type": "application/json",
        // 3. Authorization using the Bearer Token method
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        // The long URL you want to shorten (e.g., your UltX share link)
        url: shareLink,
        // Optional: Request a custom alias
        // Other options like 'domain' or 'tags' can go here
      }),
    });

    // Check for HTTP errors (4xx or 5xx)
    if (
      !response.ok ||
      response.status === 429 ||
      response.status === 403 ||
      response.status === 401
    ) {
      try {
        await fetch(
          `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
            shareLink
          )}`
        )
          .then((response) => response.text())
          .then((shortUrl) => {
            document.getElementById("shareLinkDisplay").textContent = shortUrl;
          });
      } catch (error) {
        document.getElementById("shareLinkDisplay").textContent = shareLink;
      }
      const errorData = await response.json();

      return;
      // throw new Error(`TinyURL request failed with status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // The shortened URL is nested inside the 'data' object
    const tinyUrl = data.data.tiny_url;

    return (document.getElementById("shareLinkDisplay").textContent = tinyUrl);
  } catch (error) {
    try {
      await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
          shareLink
        )}`
      )
        .then((response) => response.text())
        .then((shortUrl) => {
          document.getElementById("shareLinkDisplay").textContent = shortUrl;
        });
    } catch (error) {
      document.getElementById("shareLinkDisplay").textContent = shareLink;
    }
  }
}

function loadSharedData() {
  if (window.location.hash.includes("#share=")) {
    // const hash = window.location.hash.slice

    const hash = window.location.hash.split("#share=")[1];
    const layer = parseInt(hash[0]);
    const b64Data = hash.slice(1);

    let step1 = b64Data;
    // 1. FIRST — reverse the layer obfuscation
    switch (layer) {
      case 1:
        step1 = atbashCipher(b64Data);
        break;
      case 2:
        step1 = decodeRot13(b64Data);
        break;
      
      default:
        step1 = hash;
    }

    // 2. NOW — base64 decode
    const jsonStr = atob(step1);
    const shareData = JSON.parse(jsonStr);
    if(shareData.expval){
    if (shareData.expval !== 0) {
      if (Date.now() >= shareData.exp) {
        let expTime = shareData.exp - shareData.expTime;
        pinModal.show(
          `expired ${timeAgo(shareData.expTime - expTime)}`,
          "love",
          (mes) => {
            acthome();
          }
        );
        return;
      }
    }
  }
    let maxViews;

if(shareData.mViews) {
    // const encodedData = window.location.hash.split("#share=")[1];
    const hiddenViews = atbashCipher(shareData.mViews.slice(4));
    let pre = shareData.mViews.slice(0, 4);
    if (hiddenViews === "one") {
      maxViews = 1;
    } else if (hiddenViews === "three") {
      maxViews = 3;
    } else {
      maxViews = 0;
    }
    if (maxViews !== 0) {
      const viewed = localStorage.getItem("ultx_viewed" + pre) || 0;
      // if(viewed) {
      let count = parseInt(viewed);
      if (count >= maxViews) {
        pinModal.show(
          `You have reached your view limit for this message`,
          "love",
          (mes) => {
            acthome();
          }
        );
        return;
      }
     
    }
  }

  
  if (shareData.pin) {
    if (shareData.pin === "dXt@1111") {
      toast.success(
        `Default pin accepted<br>Loading message in {countdown}`,
        "3000"
      );
      acthome();
      setTimeout(() => {
        decodeUrlMessage();
      }, 4000);
    } else {
      toast.info("Default pin failed", "1500");
      askForPin(shareData.pin);
    }
    function askForPin(correctPin) {
      function showPinPrompt() {
        pinModal.show(
          "User set a unique password.<br> Enter it to decode:",
          "",
          (enteredPin) => {
            if (enteredPin === correctPin) {
              // CORRECT - show message and DONE
              toast.success(
                "Valid Pin<br> Decoding message in {countdown}",
                "2000"
              );
              setTimeout(() => {
                decodeUrlMessage(); // Your function
              }, 3500);
            } else {
              toast.error("Wrong PIN! Try again.", "2000");
              setTimeout(() => {
                pinModal.close();
                showPinPrompt(); // Call this same function again
              }, 0);
            }
          }
        );
      }

      showPinPrompt(); // Start the first ask
    }
      }
else{
  decodeUrlMessage()
}
    function decodeUrlMessage() {
      try {
        toggleultx();
        document.getElementById("superdecode").checked = true;
        // Auto-fill the form
        document.getElementById("inputText").value = shareData.message;
        if (shareData.key) {
          let operation = "Decoding";
          document.getElementById("superkeyblock").style.display = "block";
          document.getElementById("keyDisplay").style.display = "none";

          document.getElementById("decodekey").value = shareData.key;
          try {
            const encodedText = document
              .getElementById("inputText")
              .value.trim();
            let key = document.getElementById("decodekey").value.trim();
            // key = key.replace('Key:', '').trim();
            const keys = `ULTX(${shareData.key.trim()})`;

            // const output = document.getElementById("outputText").value.trim();
            document.getElementById("stepsLog").textContent =
              "Tip: Ensure you input correct encoding key first to enable efficient and accurate decoding";
            try {
              const decoded = superDecode(encodedText, key);
              document.getElementById("outputText").value = decoded;
              document.getElementById(
                "stepsLog"
              ).textContent = `Decoding successful with key: ${key}`;
              clearTimeout(debounceTimer);
              if (
                encodedText === "" ||
                document.getElementById("outputText").value === ""
              ) {
                document.getElementById(
                  "stepsLog"
                ).textContent = `Error: Incomplete/wrong text/key`;
                // return;
              }
              const hiddenViews = atbashCipher(shareData.mViews.slice(4));
    let pre = shareData.mViews.slice(0, 4);
    if (hiddenViews === "one") {
      maxViews = 1;
    } else if (hiddenViews === "three") {
      maxViews = 3;
    } else {
      maxViews = 0;
    }
            if(maxViews !== 0) {
              const viewed = localStorage.getItem("ultx_viewed" + pre) || 0;
      // if(viewed) {
      let count = parseInt(viewed);
              count++;
      // let no = count || 0;
      localStorage.setItem("ultx_viewed" + pre, count);
      if (count === maxViews) {
        setTimeout(() => {
            const chars = superDecode(shareData.message, shareData.key).trim().length;
          //  shareData.message
          let destructTimer = 10;
          if (chars > 200) {
            destructTimer = Math.min(60, 10 + Math.round((chars - 200) / 40))
          }
          toast.warning(
            `You are viewing this message for the last time`,
            "2000"
          );
          setTimeout(() => {
            toast.info(`Message burns in {countdown}`, `${destructTimer * 1000}`);
            setTimeout(() => {
              location.reload();
            }, (destructTimer * 1000) + 1000);
          }, 3000);
        }, 3000);
      }
    }
              if (maxViews === 0 && shareData.expval === 0 &&  shareData.pin === "dXt@1111") {
                debounceTimer = setTimeout(() => {
                  const input = encodedText;
                  const output = document
                    .getElementById("outputText")
                    .value.trim();
                  if (document.getElementById("outputText").value === "") {
                    return;
                  } else {
                    // Only save if input is different from last save
                    if (input !== lastInput) {
                      saveToHistory(
                        input,
                        output,
                        operation,
                        keys,
                        "opened_link"
                      );
                      lastInput = encodedText; // Remember what we saved
                    }
                  }
                }, 1000); // 2 seconds delay
              }
            } catch (error) {
              document.getElementById("outputText").value = "";
              document.getElementById(
                "stepsLog"
              ).textContent = `\nDecoding failed for key: ${key}\nError: ${error.message}`;
            }
          } catch (error) {
            toast.error("Could not load shared data");
          }
        } else {
          toast.error("Invalid data link");
        }
        // Show auto-load section
        toast.success("Shared data loaded automatically!", "1700");
      } catch (e) {
        toast.error(`Invalid share data:${e}`);
      }

    }
  }
}
function testShareLink() {
  const linkText = document.getElementById("shareLinkDisplay").textContent;
  if (linkText.includes("http://") || linkText.includes("https://")) {
    // use dax timer function here
    toast.success("Opening share link in {countdown}", "2000");
    setTimeout(() => {
      window.open(linkText, "_blank");
    }, 3500);
  } else {
    toast.error("Invalid data format");
  }
}
function loadURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get("message");
  const key = urlParams.get("key");

  if (message) {
    document.getElementById("inputText").value = decodeURIComponent(message);
    if (key) {
      document.getElementById("decodekey").value = decodeURIComponent(key);
    }
    toast.success("Message and key loaded from URL!");
  }
}

function saveAppState() {
  const state = {
    // Save input values
    inputText1: document.getElementById("text")?.value || "",
    inputText2: document.getElementById("inputText")?.value || "",
    outputText1: document.getElementById("output")?.value || "",
    outputText2: document.getElementById("outputText")?.value || "",
    sharelink: document.getElementById("shareLinkDisplay").textContent || "",
    encodekey: document.getElementById("keyDisplay").textContent || "",
    // Save checked ciphers
    checkedCiphers: {},
    // Save active tab
    activeTab: window.location.hash || "#home",

    // Save any other important fields
    decodeKey: document.getElementById("decodekey")?.value || "",
  };
  const radios = document.querySelectorAll(
    'input[name="super"], input[name="translator"]'
  );
  const radiostate = {};
  radios.forEach((radio) => {
    if (radio.checked) {
      radiostate[radio.name] = radio.value;
    }
  });
  localStorage.setItem("cipherx-radio-state", JSON.stringify(radiostate));

  // Save to localStorage
  localStorage.setItem("cipherx-app-state", JSON.stringify(state));
}

function loadAppState() {
  try {
    const saved = localStorage.getItem("cipherx-app-state");
    if (!saved) return;
    if (
      localStorage.getItem("allowsavestate") === "true" &&
      localStorage.getItem("allowautodetect") !== "true"
    ) {
      const state = JSON.parse(saved);

      // Restore input values
      if (state.inputText1 && document.getElementById("text")) {
        document.getElementById("text").value = state.inputText1;
      }
      if (state.inputText2 && document.getElementById("inputText")) {
        document.getElementById("inputText").value = state.inputText2;
      }
      if (state.outputText1 && document.getElementById("output")) {
        document.getElementById("output").value = state.outputText1;
      }
      if (state.outputText2 && document.getElementById("outputText")) {
        document.getElementById("outputText").value = state.outputText2;
      }
      if (state.sharelink) {
        document.getElementById("shareLinkDisplay").textContent =
          state.sharelink;
      }
      if (state.encodekey) {
        document.getElementById("keyDisplay").textContent = state.encodekey;
      }
      if (state.decodeKey && document.getElementById("decodekey")) {
        document.getElementById("decodekey").value = state.decodeKey;
      }
      const savedrad = localStorage.getItem("cipherx-radio-state");
      if (savedrad) {
        const radiostate = JSON.parse(savedrad);

        Object.keys(radiostate).forEach((group) => {
          const radio = document.querySelector(
            `input[name="${group}"][value="${radiostate[group]}"]`
          );
          if (radio) radio.checked = true;
          translate();
          if (radio.value === "Caesar") {
            document.getElementById("output").value = "Select an Operation!";
            caesarblock.style.display = "block";
            keyblock.style.display = "none";
          }
          if (radio.value === "Super Decode") {
            document.getElementById("superkeyblock").style.display = "block";
            document.getElementById("keyDisplay").style.display = "none";
          }
          if (
            radio.value === "Morse" ||
            radio.value === "Binary" ||
            radio.value === "Base64" ||
            radio.value === "Caesar" ||
            radio.value === "Atbash" ||
            radio.value === "Reverse" ||
            radio.value === "A1Z26" ||
            radio.value === "Ascii" ||
            radio.value === "Hexadecimal"
          ) {
            ciphheading.textContent = radio.value;
          }
        });
      }
    }
    const hash = window.location.hash;
    if (hash === "#about") icon();
    else if (hash === "#settings") icon();
    else if (hash === "#f/s") icon();
    else if (hash === "#profile") icon();
    else if (hash === "#share") icon();
    else if (hash === "#profilephoto") {
      if (view.style.display !== "block") return; // Only if image exists
      history.pushState(null, "", "#profilephoto");

      zoomedImage.src = view.src;
      zoomOverlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    } else {
      const acttab = localStorage.getItem("activetab");
      if (acttab === "hist" || hash === "#history") {
        toggleHistory();
      }
      if (acttab === "stat" || hash === "stats") {
        toggleStats();
      }
      if (acttab === "ach" || hash === "ach") {
        toggleach();
      }
      if (acttab === "ultx" || hash === "ultx") {
        toggleultx();
      }
      if (acttab === "home" || hash === "#home") {
        acthome();
      }
    }
  } catch (error) {
    toast.error("Error loading app state:");
  }
}
// Save when user types or changes anything
function setupAutoSave() {
  // Save on input changes
  const inputs = document.querySelectorAll("input, textarea, details");
  inputs.forEach((input) => {
    input.addEventListener("input", debounce(saveAppState, 1000));
    input.addEventListener("change", saveAppState);
  });

  // Save on tab changes
  window.addEventListener("hashchange", saveAppState);

  // Save before page unload (crucial!)
  window.addEventListener("beforeunload", saveAppState);
}
// Debounce to prevent too many saves
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener("copy", (e) => {
  toast.success("Copied to clipboard!");
});

document.addEventListener("paste", (e) => {
  toast.success("Pasted text!");
});
function openwhatsapp() {
  const linkDisplay = document.getElementById("shareLinkDisplay");
  const generatedLink = linkDisplay.textContent;
  // Validate the link
  if (generatedLink.includes("http://") || generatedLink.includes("https://")) {
    // Create the share message
    try {
      // let message = "";
      if (
        localStorage.getItem("allowPinInMessage") === "true" &&
        localStorage.getItem("userPin") !== "dXt@1111" &&
        localStorage.getItem("userPin")
      ) {
        message = `Generated at ${
          window.location.href
        }\nDecode my encoded message\nA Pin will be requested for security: ${localStorage.getItem(
          "userPin"
        )}\nClick the link below:\n${generatedLink}`;
      } else {
        message = `Generated at ${window.location.href}\nDecode my encoded message\nClick the link below:\n${generatedLink}`;
      }
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank", "noopener", "noreferrer");

      // Show success feedback
      toast.success("WhatsApp opened! Share your secret message");
      // callNotify("Successfully shared encrypted message url to whatsapp");
    } catch (err) {
      toast.error("Whatsapp could not be opened");
    }
  } else {
    toast.error("Please encode a message first to generate a shareable link");
  }
}

function shareMessageLink() {
  const linkDisplay = document.getElementById("shareLinkDisplay");
  const generatedLink = linkDisplay.textContent;
  if (generatedLink.includes("http://") || generatedLink.includes("https://")) {
    // Create the share message
    try {
      let message = "";
      if (
        localStorage.getItem("allowPinInMessage") === "true" &&
        localStorage.getItem("userPin") !== "dXt@1111" &&
        localStorage.getItem("userPin")
      ) {
        message = `Generated at ${
          window.location.href
        }\nDecode my encoded message\nA Pin will be requested for security: ${
          localStorage.getItem("userPin") || "dXt@1111"
        }\nClick the link below:\n${generatedLink}`;
      } else {
        message = `Generated at ${window.location.href}\nDecode my encoded message\nClick the link below:\n${generatedLink}`;
      }

      if (navigator.share) {
        navigator
          .share({ text: message })
          .then(() => {
            toast.success("Shared successfully!", "3000");
            callNotify("Successfully shared encrypted message via url");
          })
          .catch((err) => {
            toast.error(`An error occured while sharing: ${err}`);

            confirmModal.show(
              `Share cancelled <br> Would you like to copy instead!`,
              () => fallbackShare(mesage),
              `Copy`
            );
          });
      } else {
        confirmModal.show(
          `Share cancelled <br> Would you like to copy instead!`,
          () => fallbackShare(message),
          `Copy`
        );
      }
    } catch (err) {
    }
  } else {
    toast.error("Please encode a message first to generate a shareable link");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  netCheck();
  getMaxView();
  setMessage();
  getExpValue();
  if (window.location.hash.includes("#share=")) {
    loadSharedData();
    loadURLParameters();
    return;
  }

  getUserName();

  setupAutoSave();

  getautodetect();
  loadAppState();
  getSecretReward();

  if (localStorage.getItem("rewardblock") === "true") {
    const rewarddet = document.getElementById("reward");
    if (rewarddet) {
      rewarddet.style.display = "block";
      document.getElementById("rewardinfo").open = true;
      setTimeout(() => {
        document.getElementById("rewardinfo").open = false;
      }, 5000);
    }
  }
});
function typeEffect(text, color) {
  const status = document.getElementById("status");

  // Clear timeouts if rerunning
  if (status._typingTimeouts) {
    status._typingTimeouts.forEach(clearTimeout);
  }
  status._typingTimeouts = [];

  status.innerHTML = "";
  status.style.color = color;
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      const char = text.charAt(i);
      status.innerHTML += char === "\n" ? "<br>" : char;

      const timeout = setTimeout(typeChar, 30);
      status._typingTimeouts.push(timeout);
      i++;
    }
  }

  typeChar(); // 👈 Only call it ONCE here
}
function cleanname(name) {
  return name
    .replace(/[^a-zA-Z\s]/g, "") // remove symbols
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // collapse spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter
}

function cleanmessage(msg) {
  return msg.trim().replace(/\s+/g, " "); // collapse multiple spaces/newlines
}
document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const first = document.getElementById("firstname");
    const last = document.getElementById("lastname");
    const message = document.getElementById("message");
    const status = document.getElementById("status");

const email = document.getElementById("email");  
    // Clean the inputs
    first.value = cleanname(first.value);
    last.value = cleanname(last.value);
    message.value = cleanmessage(message.value);

    // Prepare FormSubmit data
    const formData = new FormData();
    formData.append("_subject", "CipherX Feedback");
    formData.append("_captcha", "false");
    formData.append("First Name", first.value);
    formData.append("Last Name", last.value);
    formData.append("Email", email.value);
    formData.append("Message", message.value);
    formData.append("Time", new Date().toISOString());
    formData.append("URL", window.location.href);

    try {
      // Submit to FormSubmit
      let response = await fetch(
        "https://formsubmit.co/ajax/akugbedesmond845@gmail.com",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      let result = await response.json();

      if (result.success) {
        typeEffect(
          "✅ Message sent successfully!\\nThank you for your feedback we'll get back to you as soon as possible",
          "green"
        );
        toast.success(
          "✅ Message sent successfully!<br>Thank you for your feedback we'll get back to you as soon as possible"
        );
        document.getElementById("contactForm").reset(); // Clear the form
      } else {
        typeEffect("❌ Oops, something went wrong. Please try again.", "red");
        toast.error("Oops, something went wrong. Please try again");
      }
    } catch (error) {
      setupGlobalErrorHandler();
      typeEffect("❌ Network error. Please check your connection.", "red");
      toast.error("Network error!");
    }
  });
function toggleMenu(Id) {
  const allMenus = document.querySelectorAll(".menu-options");
  allMenus.forEach((menu) => {
    if (menu.id !== `menu-${Id}`) {
      menu.classList.remove("show");
    }
  });

  const menu = document.getElementById(`menu-${Id}`);
  menu.classList.toggle("show");
}

async function checkAndRequestNotificationPermission() {
  const achieved = [
    localStorage.getItem("achievement_5") && "🏆 Apprentice Translator:",
    localStorage.getItem("achievement_15") && "🏆 Cipher Master:",
    localStorage.getItem("specialEasterEgg") && "🏆 Easter Egg Features:",
    localStorage.getItem("achievement_30") && "🏆 Translation Guru:",
    localStorage.getItem("achievement_speedster") && "🏆 Speedster:",

    localStorage.getItem("achievement_all_ciphers") && "🏆 Cipher Collector:",
    localStorage.getItem("achievement_500_chars") && "🏆 Word Smith:",
    localStorage.getItem("achievement_100") && "🏆 Translation Overlord:",
  ].filter(Boolean);
  let achievementsCount = achieved.length;
  const permission = Notification.permission;
  if (achievementsCount === 0 || permission === "granted") return;

  // Check permission
  // "default" = not asked
  // "granted" = allowed
  // "denied" = blocked

  if (permission === "default") {
    // Ask user
    const result = await Notification.requestPermission();

    if (result === "granted") {
      toast.success("🎉 Notifications enabled! You'll now receive updates.");
    } else if (result === "denied") {
      showDeniedToast();
    }
  } else if (permission === "denied") {
    showDeniedToast();
  }
}
async function checkNotifyAccess() {
  const achieved = [
    localStorage.getItem("achievement_5") && "🏆 Apprentice Translator:",
    localStorage.getItem("achievement_15") && "🏆 Cipher Master:",
    localStorage.getItem("specialEasterEgg") && "🏆 Easter Egg Features:",
    localStorage.getItem("achievement_30") && "🏆 Translation Guru:",
    localStorage.getItem("achievement_speedster") && "🏆 Speedster:",

    localStorage.getItem("achievement_all_ciphers") && "🏆 Cipher Collector:",
    localStorage.getItem("achievement_500_chars") && "🏆 Word Smith:",
    localStorage.getItem("achievement_100") && "🏆 Translation Overlord:",
  ].filter(Boolean);
  let achievementsCount = achieved.length;
  // Only ask between 1 and 3 achievements
  const permission = Notification.permission;
  if (achievementsCount === 0 || permission === "granted") return;

  // Check permission
  // "default" = not asked
  // "granted" = allowed
  // "denied" = blocked

  if (permission === "default") {
    // Ask user
    checkAndRequestNotificationPermission();
  }
  if (permission === "denied") {
    showDeniedToast();
  }
}
setTimeout(() => {
  checkNotifyAccess();
}, 60000);
function checkNotifyState() {
  const permission = Notification.permission;
  if (permission === "granted" && permission !== "default") {
    setTimeout(() => {
      // let time = getTimeBasedGreeting();
    let message = `${getTimeBasedGreeting()} ${localStorage.getItem("userName") ? `${localStorage.getItem("userName")} Welcome Back` : "Welcome To CipherX" }`;
      callNotify(`${message}`);
    }, 2000);
  }
}

checkNotifyState();
function getBrowser() {
  const ua = navigator.userAgent;

  if (/chrome|chromium|crios/i.test(ua) && !/edge|edg/i.test(ua)) {
    return "chrome";
  }
  if (/safari/i.test(ua) && !/chrome|chromium|crios/i.test(ua)) {
    return "safari";
  }
  if (/firefox|fxios/i.test(ua)) {
    return "firefox";
  }
  if (/edg/i.test(ua)) {
    return "edge";
  }

  return "other";
}
function showDeniedToast() {
  toast.warning(
    `Notifications are blocked <br>Visit the about tab in the profile section for more info`
  );
}
function getNotificationSettingsURL() {
  const browser = getBrowser();

  switch (browser) {
    case "chrome":
      return "chrome://settings/content/notifications";
    case "firefox":
      return "about:preferences#privacy";
    case "safari":
      return "x-apple.systempreferences:com.apple.preference.notifications";
    case "edge":
      return "edge://settings/content/notifications";
    default:
      return null; // show normal instructions
  }
}

document.addEventListener("click", function () {
  const allMenus = document.querySelectorAll(".menu-options");
  allMenus.forEach((menu) => {
    menu.classList.remove("show");
  });
});

async function callNotify(message) {
  console.log("🔔 Notification function called");

  // CHECK PERMISSION FIRST
  if (Notification.permission !== "granted") {
    console.log("❌ No notification permission");
    toast.info(message);
    return;
  }
  if (
    Notification.permission === "granted" &&
    Notification.permission !== "default"
  ) {
    console.log("✅ Permission granted, showing notification...");

    if (!("serviceWorker" in navigator)) {
      console.log("❌ No service worker support");
      // toast.info(message);
      return;
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered");
        })
        .catch((error) => {
          console.log("SW registration failed");
        });
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log("✅ Service worker ready:", registration.active);

      await registration.showNotification("CipherX", {
        body: message,
        icon: "ciph.png",
      });
      console.log("✅ Notification shown successfully!");

    } catch (error) {
      console.log("❌ Notification error:", error);
    }
  }
}

function getoldest() {
    const history = validateHistory(); // ← Always starts with valid data!
  if (history.length === 0) return null;
  return history.reduce((oldest, current) => {
    return new Date(current.timestamp) < new Date(oldest.timestamp)
      ? current
      : oldest;
  });
}

window.addEventListener("storage", (e) => {
  if (
    ["userName", "translationHistory", "userPin", "ultxExpiry"].includes(e.key)
  ) {
    location.reload();
  }
});

let deferredPrompt;

// Listen for the install event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show your custom button
  document.getElementById("installBtn").style.display = "block";
});

// Trigger install when user clicks
document.getElementById("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    toast.success("CipherX installed! 🖤");
  }
  deferredPrompt = null;
  document.getElementById("installBtn").style.display = "none";
});
