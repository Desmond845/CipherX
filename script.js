async function logErrorToEmail(errorData) {
  console.log("Error detected:", errorData);

  // ALWAYS log to console (your reliable fallback)
  console.error("ERROR LOG:", {
    time: new Date().toISOString(),
    message: errorData.message,
    location:
      errorData.location ||
      `${errorData.filename}:${errorData.lineno}:${errorData.colno}`,
    userAgent: navigator.userAgent,
    url: window.location.href,
  });

  // Try FormSubmit API (no HTML form needed)
  try {
    const response = await fetch(
      "https://formsubmit.co/ajax/akugbedesmond845@gmail.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "CipherX Error Report",
          _captcha: "false",
          App: "CipherX",
          Version: "1.2",
          User: "daxtech",
          Time: new Date().toISOString(),
          Error: errorData.message,
          Location:
            errorData.location ||
            `${errorData.filename}:${errorData.lineno}:${errorData.colno}`,
          "User Agent": navigator.userAgent,
          URL: window.location.href,
        }),
      }
    );

    if (response.ok) {
    }
  } catch (error) {}
}
function setupGlobalErrorHandler() {
  // Catch sync errors
  window.addEventListener("error", function (event) {
    const errorData = {
      message: event.error?.message || event.message,
      location: `${event.filename}:${event.lineno}:${event.colno}`,
      type: "global_error",
    };
    logErrorToEmail(errorData);
  });

  // Catch async errors
  window.addEventListener("unhandledrejection", function (event) {
    const errorData = {
      message: event.reason?.message || String(event.reason),
      location: "async",
      type: "promise_rejection",
    };
    logErrorToEmail(errorData);
  });
}
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
        messageElement.innerHTML = message.replace("{countdown}", "0");

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
    if (message.includes("new name") || message.includes("new message pin")) {
      this.modal = document.createElement("div");
      this.modal.className = "modal-overlay";
      this.modal.innerHTML = `
            <div class="modal-content">
                <h3>${message}</h3>
                <input type="text" id="pinEntryInput" placeholder="Enter pin" value="${defaultValue}" maxlength="20">
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
    this.addEventListeners();
  }

  addEventListeners() {
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
        this.handleCreate(input);
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

  handleCreate(input) {
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
    }
    localStorage.setItem("theme", "dark");
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

function saveOnModeChange() {
  clearTimeout(modeChangeTimer);
  modeChangeTimer = setTimeout(() => {
    const input = inputfield.value.trim();
    const output = document.getElementById("output").value;
    if (input && output && output !== "Select a Cipher!") {
      const history =
        JSON.parse(localStorage.getItem("translationHistory")) || [];
      const lastItem = history[0];

      if (!lastItem || lastItem.output !== output) {
        saveToHistory(input, output);
      }
    }
  }, 300); // 0.3 second delay
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

  document.getElementById("output").value = result;
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

  document.getElementById("output").value = result;
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

keyfield.addEventListener("input", caesarrun);
inputfield.addEventListener("input", function () {
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
        ciphheading.textContent = `Auto detecting ${autocipher}`;
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
    if (caesarradios) {
      caesarrun();
    } else {
      translate();
    }
  }
});
document.querySelectorAll("input[name='translator']").forEach((radio) => {
  radio.addEventListener("change", function () {
    translate();
    saveOnModeChange();
  });
});

document.querySelectorAll("input[name='caesar']").forEach((radio) => {
  radio.addEventListener("change", caesarrun);
});

document.querySelectorAll("input[name='cipheroptions']").forEach((radio) => {
  radio.addEventListener("change", ciphertype);
});
function caesarrun() {
  if (caesarencode.checked) {
    encodecaesar();
    keyblock.style.display = "block";
    typeEffect2(`Encoding...`);
    ciphers.open = false;
  } else if (caesardecode.checked) {
    decodecaesar();
    keyblock.style.display = "block";
    ciphers.open = false;

    typeEffect2(`Decoding...`);
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
      ).textContent = `Auto detecting ${autocipher}`;
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
      ).textContent = `Auto detecting ${autocipher}`;

      document.getElementById(
        "autodetinfo"
      ).textContent = `When typing without selecting a cipher option your input would be encoded or decoded in ${autocipher} cipher automatically until a cipher option is selected`;
    }
  }
}

function autodetectcipher() {
  const startTime = performance.now();
  input = document.getElementById("text").value.trim();
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
          ciphheading.textContent = `Auto detecting ${autocipher}`;
        }
      });
    });
  });
  if (input === "") {
  }
  if (autohex.checked) {
    localStorage.setItem("autoassume", "hex");
    if (isHex(input) && localStorage.getItem("autoassume") === "hex") {
      output = decodeHex(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeHex(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autoasci.checked) {
    localStorage.setItem("autoassume", "asci");

    if (isASCII(input) && localStorage.getItem("autoassume") === "asci") {
      output = decodeASCII(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeASCII(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autoa1z26.checked) {
    localStorage.setItem("autoassume", "a1z26");

    if (isA1Z26(input) && localStorage.getItem("autoassume") === "a1z26") {
      output = decodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (automorse.checked) {
    localStorage.setItem("autoassume", "morse");

    if (isMorse(input) && localStorage.getItem("autoassume") === "morse") {
      output = decodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autobinary.checked) {
    localStorage.setItem("autoassume", "binary");

    if (isbinary(input) && localStorage.getItem("autoassume") === "binary") {
      output = decodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  }
  if (autobase64.checked) {
    localStorage.setItem("autoassume", "base64");

    if (isBase64(input) && localStorage.getItem("autoassume") === "base64") {
      output = atob(input); // decode
      typeEffect2(`Decoding...`);
    } else {
      output = btoa(input); // encode
      typeEffect2(`Encoding...`);
    }
    document.getElementById("output").value = output;
  }
  if (autoreverse.checked) {
    localStorage.setItem("autoassume", "reverse");
    if (localStorage.getItem("autoassume") === "reverse") {
      output = reversestring(input);
      document.getElementById("output").value = output;
    }
  }
  if (autoatbash.checked) {
    localStorage.setItem("autoassume", "atbash");
    if (localStorage.getItem("autoassume") === "atbash")
      typeEffect2(`Encoding`);
    output = atbashCipher(input);
    document.getElementById("output").value = output;
  } else {
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
    output &&
    output !== "Select a Cipher!" &&
    output !== "Select an Operation!"
  ) {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Only save if input is different from last save
      if (input !== lastInput) {
        saveToHistory(input, output);
        lastInput = input; // Remember what we saved
      }
    }, 2500); // 2 seconds delay
  }
}

input = inputfield.value.trim();

function translate() {
  const startTime = performance.now();

  // ... Your existing encoding
  input = document.getElementById("text").value.trim();
  if (tohex.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isHex(input)) {
      output = decodeHex(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeHex(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  } else if (toasci.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isASCII(input)) {
      output = decodeASCII(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeASCII(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  } else if (toa1z26.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isA1Z26(input)) {
      output = decodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeA1Z26(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  } else if (tomorse.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isMorse(input)) {
      output = decodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeMorse(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  } else if (tobinary.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isbinary(input)) {
      output = decodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Decoding...`);
    } else {
      output = encodeBinary(input);
      document.getElementById("output").value = output;
      typeEffect2(`Encoding...`);
    }
  } else if (tobase64.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    if (isBase64(input)) {
      output = atob(input); // decode
      typeEffect2(`Decoding...`);
    } else {
      output = btoa(input); // encode
      typeEffect2(`Encoding...`);
    }
    document.getElementById("output").value = output;
  } else if (reverse.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    output = reversestring(input);
    document.getElementById("output").value = output;
  } else if (tocaesar.checked) {
    caesarblock.style.display = "block";
    output = "Select an Operation!";
    document.getElementById("output").value = "output";
    keyblock.style.display = "none";
  } else if (toatbash.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    caesarblock.style.display = "none";
    typeEffect2(`Encoding`);
    keyblock.style.display = "none";
    output = atbashCipher(input);
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
    output &&
    output !== "Select a Cipher!" &&
    output !== "Select an Operation!" &&
    output !== "[object HTMLTextAreaElement]"
  ) {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Only save if input is different from last save
      if (input !== lastInput) {
        saveToHistory(input, output);
        lastInput = input; // Remember what we saved
      }
    }, 2500); // 2 seconds delay
  }
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

function saveLinkHistory(linkData) {
  try {
    // 1. Safely get the existing history from localStorage
    const history = validateHistory(); // ← Always starts with valid data!
    if (
      document.getElementById("outputText").value === "" &&
      document.getElementById("inputText").value === ""
    ) {
      return;
    }

    // 2. Create a new history item for the link
    const newLinkItem = {
      id: Date.now() + Math.random(), // Keep your unique ID style
      type: "shared_link", // This distinguishes it from cipher translations
      operation: "Decoding", // e.g., "Shared CipherX Message"
      input: linkData.input, // The original message that was encoded
      cipher: linkData.cipher,
      output: linkData.output, // The original message that was encoded

      timestamp:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    };

    // 3. Add to the beginning of the history array
    history.unshift(newLinkItem);

    // 4. Enforce your history limit (using your existing 'maxhist' variable)
    if (history.length >= maxhist) {
      history.length = maxhist;
      toast.warning("History limit reached saving latest 50 translations");
    }
    if (history.length === 11) {
      showStats();
    }

    // Save to storage
    try {
      localStorage.setItem("translationHistory", JSON.stringify(history));
    } catch (error) {
      toast.error("Latest history could not be saved");
    }

    const firstTranslation = localStorage.getItem("firstTranslation");
    if (!firstTranslation) {
      localStorage.setItem(
        "firstTranslation",
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
      );
    }
    localStorage.setItem(
      "lastTranslation",
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    );
    checkAchievements();
  } catch (error) {
    toast.error("Save failed");
  }
}
function saveToHistory(input, output, operation, cipher) {
  try {
    const history = validateHistory(); // ← Always starts with valid data!
    if (
      document.getElementById("text").value === "" &&
      document.getElementById("inputText").value === ""
    ) {
      return;
    }
    if (history.length > 0) {
      const lastItem = history[0];
      if (lastItem.input === input && lastItem.output === output) {
        return;
      }
    }
    const results = document.getElementById("keyDisplay").textContent;
    let result = results.replace("Key:", "").trim();
    const out = document.getElementById("output").value;

    const outputtext = document.getElementById("outputText").value.trim();
    // Get current cipher and operation type
    const selectedCipher = document.querySelector(
      'input[name="translator"]:checked'
    )?.value;
    const activetranslators = document.querySelectorAll(
      'input[name="translator"]'
    );
    let selectedradio = null;
    for (const radio of activetranslators) {
      if (radio.checked) {
        selectedradio = radio.value;
      }
    }
    // Determine if encoding or decoding

    let ciphersup;
    let outputsup;

    if (
      !selectedCipher &&
      document.getElementById("homepage").style.display === "block"
    ) {
      let ans = out;
      if (autohex.checked) {
        if (isHex(input)) {
          operation = "Decoding";
          cipher = "Hex";
        } else {
          operation = "Encoding";
          cipher = "Hex";
        }
      }
      if (autobase64.checked) {
        if (isBase64(input)) {
          operation = "Decoding";
          cipher = "Base64";
        } else {
          operation = "Encoding";
          cipher = "Base64";
        }
      }
      if (autoa1z26.checked) {
        if (isA1Z26(input)) {
          operation = "Decoding";
          cipher = "A1Z26";
        } else {
          operation = "Encoding";
          cipher = "AIZ26";
        }
      }
      if (autobinary.checked) {
        if (isbinary(input)) {
          operation = "Decoding";
          cipher = "Binary";
        } else {
          operation = "Encoding";
          cipher = "Binary";
        }
      }
      if (autoasci.checked) {
        if (isASCII(input)) {
          operation = "Decoding";
          cipher = "Ascii";
        } else {
          operation = "Encoding";
          cipher = "Ascii";
        }
      }
      if (automorse.checked) {
        if (isMorse(input)) {
          operation = "Decoding";
          cipher = "Morse";
        } else {
          operation = "Encoding";
          cipher = "Morse";
        }
      }
      if (autoatbash.checked) {
        operation = "Encoding";
        cipher = "Atbash";
      }
      if (autoreverse.checked) {
        operation = "Encoding";
        cipher = "Reverse";
      }

      history.unshift({
        id: Date.now() + Math.random(), // Unique ID based on timestamp
        input: input,
        output: ans,
        cipher: cipher,
        operation: operation,
        timestamp:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
      });
    }

    if (
      document.getElementById("superencode").checked ||
      document.getElementById("superdecode").checked
    ) {
      if (document.getElementById("homepage").style.display === "none") {
        if (document.getElementById("superencode").checked) {
          operation = "Encoding";
          ciphersup = result;
          outputsup = outputtext;
          history.unshift({
            id: Date.now() + Math.random(), // Unique ID based on timestamp
            input: input,
            output: outputsup,
            cipher: ciphersup,
            operation: operation,
            timestamp:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
          });
        }
        if (document.getElementById("superdecode").checked) {
          operation = "Decoding";
          ciphersup = document.getElementById("decodekey").value.trim();
          outputsup = outputtext;
          history.unshift({
            id: Date.now() + Math.random(), // Unique ID based on timestamp
            input: input,
            output: outputsup,
            cipher: ciphersup,
            operation: operation,
            timestamp:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
          });
        }
      } else {
      }
    }
    if (selectedCipher) {
      if (tohex.checked) {
        if (isHex(input)) {
          operation = "Decoding";
        } else {
          operation = "Encoding";
        }
      }
      if (toa1z26.checked) {
        if (isA1Z26(input)) {
          operation = "Decoding";
        } else {
          operation = "Encoding";
        }
      }
      if (toasci.checked) {
        if (isASCII(input)) {
          operation = "Decoding";
        } else {
          operation = "Encoding";
        }
      }
      if (tomorse.checked) {
        if (isMorse(input)) {
          operation = "Decoding";
        } else {
          operation = "Encoding";
        }
      }

      if (tobinary.checked)
        if (isbinary(input)) {
          operation = "Decoding";
        } else {
          operation = "Encoding";
        }

      if (tobase64.checked) {
        if (isBase64(input)) {
          operation = "Decoding";
        } else {
          operation = "Encoding";
        }
      }

      if (
        selectedCipher === "caesar" &&
        document.getElementById("caesardecode")?.checked
      ) {
        operation = "Decoding";
      }
      if (reverse.checked) {
        operation = "Encoding";
      }
      if (toatbash.checked) {
        operation = "Encoding";
      }
      // Add new item to beginning

      history.unshift({
        id: Date.now() + Math.random(), // Unique ID based on timestamp
        input: input,
        output: output,
        cipher: selectedCipher || cipher || "unknown",
        operation: operation,
        timestamp:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
      });
    }

    if (history.length >= maxhist) {
      history.length = maxhist;
      toast.warning("History limit reached saving latest 50 translations");
    }
    if (history.length === 11) {
      showStats();
    }

    // Save to storage
    localStorage.setItem("translationHistory", JSON.stringify(history));

    const firstTranslation = localStorage.getItem("firstTranslation");
    if (!firstTranslation) {
      localStorage.setItem(
        "firstTranslation",
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
      );
    }
    localStorage.setItem(
      "lastTranslation",
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
    );
    checkAchievements();
  } catch (error) {
    toast.error("Save failed");
  }
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");

  if (history.length === 0) {
    document.getElementById(
      "length"
    ).textContent = `Translations: ${history.length}/50`;

    historyList.innerHTML = `<p>No translation history yet!</p>`;
  } else {
    document.getElementById(
      "length"
    ).textContent = `Translations: ${history.length}/50`;

    historyList.innerHTML = history
      .map((item, index) => {
        if (item.type === "shared_link") {
          // Render for a shared link item
          return ` 
     <div class="history-item">
<div class="history-content">
                            <p class="hist-text"><strong>${item.input}</strong> → ${item.output}</p>
                            <small class="hist-text">${item.operation} • ${item.cipher} • ${item.type} • ${item.timestamp}</small>
                        </div>
                        <button class="delete-btn" onclick="removeHistoryItem(${item.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                </button>
                                </div>

    `;
        } else {
          return `
  <div class="history-item">
<div class="history-content">
                            <p class="hist-text"><strong>${item.input}</strong> → ${item.output}</p>
                            <small class="hist-text">${item.operation} • ${item.cipher} • ${item.timestamp}</small>
                        </div>
                        <button class="delete-btn" onclick="removeHistoryItem(${item.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                </button>
                                </div>
                              `;
        }
      })
      .join("");
  }
  historySection.style.display = "block";
}

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

function removeHistoryItem(id) {
  // Get current history
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];

  // Filter out the item with matching ID
  const updatedHistory = history.filter((item) => {
    return item.id != id; // Use != for type coercion
  });

  // Save updated history
  localStorage.setItem("translationHistory", JSON.stringify(updatedHistory));

  // Refresh display
  showHistory();

  toast.info(`Removed history with ID: ${id}`, "1500");
}

function removehist(index) {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(history));
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
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
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
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const totalTranslations = history.length;
  const totalChars = history.reduce((sum, item) => sum + item.input.length, 0);

  toast.info(
    `You've made ${totalTranslations} translations totaling ${totalChars} characters!`
  );
}

// Function to calculate and display stats
function calculateStats() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];

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

  const firstTranslation = localStorage.getItem("firstTranslation") || "Never";
  const lastTranslation = localStorage.getItem("lastTranslation") || "Never";
  // Update DOM
  document.getElementById("totalTranslations").textContent = totalTranslations;
  document.getElementById("totalCharacters").textContent = totalCharacters;
  document.getElementById("avglength").textContent = avglenth;
  document.getElementById("topCipher").textContent = topCipher;
  document.getElementById("firstTranslation").textContent = firstTranslation;
  document.getElementById("lastTranslation").textContent = lastTranslation;

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
    document.querySelector(".super-txt").classList.remove("tab-active-text");
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
  //  else {
  //   toast.info("Share cancelled");
  // }
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
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
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
                ? `✅ Unlocked! <br> Progress: Completed`
                : ` Locked <br> Progress: ${Math.round(progress)}% (${
                    ach.desc
                  })`
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
  document.body.classList.add("rainbow-theme");
}
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

    document.getElementById("keyDisplay").textContent = `Key:${result.key}`;
    document.getElementById(
      "stepsLog"
    ).textContent = `Encoding successful with key: ${result.key}`;
  } catch (error) {
    toast.error("Encoding Failed");
    document.getElementById("stepsLog").textContent = "Error during encoding.";
  }
  if (input || input !== "" || output !== " ") {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Only save if input is different from last save
      if (input !== lastInput) {
        saveToHistory(input, output, result);
        lastInput = input; // Remember what we saved
      }
    }, 4000); // 4 seconds delay
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
    debounceTimer = setTimeout(() => {
      const input = encodedText;
      if (document.getElementById("outputText").value === "") {
        return;
      } else {
        // Only save if input is different from last save
        if (
          input !== lastInput &&
          document.getElementById("outputText").value !== "" &&
          document.getElementById("decodekey").value.length >= "6"
        ) {
          saveToHistory(input, decoded);
          lastInput = encodedText; // Remember what we saved
        } else {
        }
      }
    }, 4000); // 4 seconds delay
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
  document.getElementById("shareLinkDisplay").textContent =
    "Link for sharing encoded message";

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
  document.getElementById("shareLinkDisplay").textContent =
    "Link for sharing encoded message";
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
        document.getElementById("shareLinkDisplay").textContent =
          "Link for sharing encoded message";
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

async function generateShareableLink() {
  const encodedMessage = document.getElementById("outputText").value;
  const results = document.getElementById("keyDisplay").textContent;
  const userPin = localStorage.getItem("userPin") || "dXt@1111";
  let result = results.replace("Key:", "").trim();
  if (!encodedMessage) {
    return;
  }
  // Create shareable data
  const shareData = {
    message: encodedMessage,
    key: result,
    pin: userPin,
    mode: "super_decode",
    timestamp: new Date().toISOString(),
  };

  // Convert to base64 for URL
  const encodedData = btoa(JSON.stringify(shareData));
  const shareLink = `${window.location.origin}${window.location.pathname}#share=${encodedData}`;
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
    const encodedData = window.location.hash.split("#share=")[1];
    const shareData = JSON.parse(atob(encodedData));
    if (shareData.pin === "dXt@1111") {
      toast.success(
        `Default pin accepted<br>Loading message in {countdown}`,
        "3000"
      );
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
                "3000"
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
    function decodeUrlMessage() {
      try {
        toggleultx();
        document.getElementById("superdecode").checked = true;
        // Auto-fill the form
        document.getElementById("inputText").value = shareData.message;
        if (shareData.key) {
          document.getElementById("superkeyblock").style.display = "block";
          document.getElementById("keyDisplay").style.display = "none";

          document.getElementById("decodekey").value = shareData.key;
          try {
            const encodedText = document
              .getElementById("inputText")
              .value.trim();
            let key = document.getElementById("decodekey").value.trim();
            // key = key.replace('Key:', '').trim();
            const keys = document.getElementById("decodekey").value.trim();

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
                    saveLinkHistory({
                      input: input,
                      output: output,
                      cipher: keys,
                    });
                    lastInput = encodedText; // Remember what we saved
                  }
                }
              }, 1000); // 2 seconds delay
            } catch (error) {
              document.getElementById("outputText").value = "";
              document.getElementById(
                "stepsLog"
              ).textContent += `\nDecoding failed for key: ${key}\nError: ${error.message}`;
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
    toast.success("Opening share link in {countdown}", "3000");
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
            radio.value === "Hex"
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
      let message = "";
      if (
        localStorage.getItem("allowPinInMessage") === "true" &&
        localStorage.getItem("userPin") !== "dXt@1111"
      ) {
        message = `Generated at ${
          window.location.href
        }\nDecode my encoded message\nA Pin will be requested for security: ${localStorage.geItem(
          "userPin"
        )}\nClick the link below:\n${generatedLink}`;
      } else {
        message = `Generated at ${window.location.href}\nDecode my encoded message\nClick the link below:\n${generatedLink}`;
      }
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Show success feedback
      toast.success("WhatsApp opened! Share your secret message");
      callNotify("Successfully shared encrypted message url to whatsapp");
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
        localStorage.getItem("userPin") !== "dXt@1111"
      ) {
        message = `Generated at ${
          window.location.href
        }\nDecode my encoded message\nA Pin will be requested for security: ${localStorage.geItem(
          "userPin"
        )}\nClick the link below:\n${generatedLink}`;
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
    } catch (err) {}
  } else {
    toast.error("Please encode a message first to generate a shareable link");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  netCheck();
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
// ===== SIMPLE BROWSER NOTIFICATIONS =====
class SimpleNotify {
  constructor(siteName = "CipherX") {
    this.siteName = siteName;
    this.permissionGranted = false;
    this.requestPermission();
  }

  async requestPermission() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      this.permissionGranted = true;
    }
  }
  // JUST SHOW - Site Name + Message + OnClick
  show(message, onClick = null) {
    if (!this.permissionGranted) return null;

    const notification = new Notification(this.siteName, {
      body: message,
      icon: this.getFavicon(),
      badge: this.getFavicon(),
      tag: "cipherx",
      requireInteraction: false,
      silent: false,
    });

    // Click to focus app
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (onClick) onClick();
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    return notification;
  }

  // ALIAS - same as show()
  message(message, onClick = null) {
    return this.show(message, onClick);
  }

  getFavicon() {
    const favicon = document.querySelector("link[rel*='icon']");
    return favicon
      ? favicon.href
      : "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>";
  }
}

// Create global instance
const simpleNotify = new SimpleNotify("CipherX");

// Global function - JUST SHOW
window.simpleNotify = (message, onClick = null) => {
  return simpleNotify.show(message, onClick);
};

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
  // Only ask between 1 and 3 achievements
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
if(permission ==="denied") {
  showDeniedToast();
}
}
setTimeout(() => {
    checkNotifyAccess()
}, 30000);
function checkNotifyState() {
  const permission = Notification.permission;
  if (permission === "granted" && permission !== "default") {
    setTimeout(() => {
      let time = getTimeBasedGreeting();
      time += " " + localStorage.getItem("userName");
      simpleNotify.message(`${time} Welcome Back`);
    }, 2000);
    // simpleNotify.message(`${getTimeBasedGreeting()}`)
  }
}

checkNotifyState();
// checkAndRequestNotificationPermission();
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
function callNotify(message) {
  const permission = Notification.permission;

  if (permission === "granted" && permission !== "default") {
    setTimeout(() => {
      simpleNotify.message(message);
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }, 2000);
  }
}
document.addEventListener("click", function () {
  const allMenus = document.querySelectorAll(".menu-options");
  allMenus.forEach((menu) => {
    menu.classList.remove("show");
  });
});
