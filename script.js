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
const cipherblock = document.getElementById("cipherblock");
const toatbash = document.getElementById("toatbash");
const reverse = document.getElementById("reverse");
const cipherradios = document.querySelectorAll('input[name="cipheroptions"]');
const translators = document.querySelectorAll('input[name="translator"]');
const learnmorelink = document.getElementById("learn-more-link");
const ciphernamespan = document.getElementById("cipher-name");
const cipherlink = document.getElementById("cipher-link");
const cancelbtn = document.getElementById("cancel");
const themeToggle = document.getElementById("themetoggle");
const body = document.body;
let debounceTimer;
let lastInput = "";
let input;
const rewarddet = document.getElementById("reward");

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

document.addEventListener("DOMContentLoaded", function () {
  getUserName();
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

function getUserName() {
  let userName = localStorage.getItem("userName");
  // If no username exists, prompt for one
  if (!userName) {
    let isValid = false;
    const timeGreeting = getTimeBasedGreeting();
    while (!isValid) {
      // First prompt
      userName = prompt(
        `${timeGreeting}\nWelcome to CipherX!\nWhat's your name?`
      );

      // If user clicks Cancel or closes prompt
      if (userName === null) {
        alert("Please enter your name!");
        continue;
      }

      // If user enters empty string or spaces only
      if (userName === "") {
        alert("Please enter a valid name. It can't be empty!");
        continue;
      }

      // If name is too short
      if (userName.length < 2) {
        alert("Name should be at least 2 characters long!");
        continue;
      }

      // If name is too long
      if (userName.length > 20) {
        alert("Name should be less than 20 characters!");
        continue;
      }
      // Confirm the entered name
      userName = format(userName);
      const isConfirmed = confirm(
        `Is "${userName}" your name? Click OK to confirm, or Cancel to edit.`
      );

      if (isConfirmed) {
        isValid = true;
      }
    }

    // Save the validated and confirmed name
    localStorage.setItem("userName", userName);
    // First-time welcome
    alert(
      `${timeGreeting}\nWelcome to CipherX ${userName.trim()}\nWe're excited to have you here!`
    );
    const userGreeting = document.getElementById("userGreeting");
    const greetingText = `${timeGreeting} ${userName}<br>Welcome to CipherX`;
    userGreeting.innerHTML = greetingText;
  } else {
    const timeGreeting = getTimeBasedGreeting();
    // Return visitor greeting

    alert(`${timeGreeting}\nWelcome back ${userName}\nGood to see you again!`);
    const userGreeting = document.getElementById("userGreeting");
    const greetingText = `${timeGreeting} <br>Welcome back ${userName}`;
    userGreeting.innerHTML = greetingText;
  }
  return userName;
}

let availableVoices = []; // This will hold all voices
let defaultVoice = null; // This will hold our chosen voice (Samantha!)

// This function runs when voices are loaded
function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();
  console.log("Voices loaded:", availableVoices);

  // NOW we try to find Samantha
  defaultVoice = findSamantha(availableVoices);

  if (defaultVoice) {
    console.log("🎉 Default voice set to:", defaultVoice.name);
  } else {
    console.warn("Samantha not found. Using system default.");
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
  // window.speechSynthesis.cancel();

  // Check if browser supports speech
  if (!("speechSynthesis" in window)) {
    alert("Speech synthesis not supported in your browser");
    return;
  }
  const outputElement = document.getElementById("output");
  const textToSpeak = outputElement.value.trim(); // .value for textarea/input

  // 2. Check if there's anything to speak
  if (textToSpeak === "") {
    alert("No translation to speak!");
    return;
  }

  // Create speech object
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  // 1. FIRST PRIORITY: Use the pre-loaded global defaultVoice (Samantha!)
  if (defaultVoice) {
    utterance.voice = defaultVoice;
    console.log("Welcome: Using pre-loaded voice:", defaultVoice.name);
  } else {
    // 2. FALLBACK: Voices haven't loaded via the event yet, try to grab them now.
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = findSamantha(voices); // Use the same finder function

    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
      console.log("Welcome: Using fallback voice:", fallbackVoice.name);
    } else {
      // 3. LAST RESORT: No Samantha found. Use fun tweaks on the default male voice.
      console.log(
        "Welcome: No preferred voice found. Applying fun tweaks to default."
      );
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
    console.log("Finished speaking welcome message");
  };
}

function testVoice1() {
  if (!("speechSynthesis" in window)) {
    alert("Speech synthesis not supported in your browser");
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
    console.log("Welcome: Using pre-loaded voice:", defaultVoice.name);
  } else {
    // 2. FALLBACK: Voices haven't loaded via the event yet, try to grab them now.
    const voices = window.speechSynthesis.getVoices();
    const fallbackVoice = findSamantha(voices); // Use the same finder function

    if (fallbackVoice) {
      utterance.voice = fallbackVoice;
      console.log("Welcome: Using fallback voice:", fallbackVoice.name);
    } else {
      // 3. LAST RESORT: No Samantha found. Use fun tweaks on the default male voice.
      console.log(
        "Welcome: No preferred voice found. Applying fun tweaks to default."
      );
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
    console.log("Finished speaking welcome message");
  };
}

// Check if we already know the user

function resetUser() {
  if (confirm("Reset all user data and start fresh?")) {
    localStorage.clear();
    alert("User data cleared! Refreshing...");
    window.location.href = "index.html";
    // location.reload();
  }
}
function resetname() {
  if (confirm("Reset Username other user data will be kept?")) {
    localStorage.removeItem("userName");
    alert("Username cleared! Refreshing...");
    location.reload();
  }
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
  console.log("Theme set to:", theme);
}
// Toggle theme on click
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

// Load saved theme on start
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}

console.log("Theme test loaded. Current theme:", savedTheme || "dark");

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
    alert(`Empty can not copy!`);
  } else {
    navigator.clipboard.writeText(text1).then(() => {
      alert(`Copied to clipboard!`);
    });
  }
};
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
  let text = document.getElementById("text").value.toUpperCase();
  let shift = parseInt(document.getElementById("key").value) || 0;
  let result = "";
  shift = Math.abs(shift);
  for (let char of text) {
    if (char >= "A" && char <= "Z") {
      // shift inside alphabet
      let code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
      result += String.fromCharCode(code);
    } else {
      result += char; // keep spaces/punctuation
    }
  }

  document.getElementById("output").value = result;
}

function decodecaesar() {
  let text = document.getElementById("text").value.toUpperCase();
  let shift = parseInt(document.getElementById("key").value) || 0;
  let result = "";
  shift = Math.abs(shift);
  for (let char of text) {
    if (char >= "A" && char <= "Z") {
      let code = ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65;
      result += String.fromCharCode(code);
    } else {
      result += char;
    }
  }

  document.getElementById("output").value = result;
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
cipherblock.style.display = "none";

cipherradios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      const cipher = this.value;
      ciphernamespan.textContent = cipher;
      learnmorelink.style.display = "block";
    }
  });
});
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
  const cipherradios = document.querySelector(
    'input[name="cipheroptions"]:checked'
  );
  if (cipherradios) {
    ciphertype();
  }
  if (caesarradios) {
    caesarrun();
  } else {
    translate();
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

function ciphertype() {
  input = inputfield.value.trim();
  if (tocaesar.checked) {
    document.getElementById("output").value = "Select an operation!";
    caesarblock.style.display = "block";
    keyblock.style.display = "block";
  } else if (toatbash.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    caesarblock.style.display = "none";
    typeEffect2(`Encoding`);
    keyblock.style.display = "none";
    output = atbashCipher(input);
    document.getElementById("output").value = output;
  }
}

function caesarrun() {
  if (caesarencode.checked) {
    encodecaesar();
    typeEffect2(`Encoding...`);
  } else if (caesardecode.checked) {
    decodecaesar();
    typeEffect2(`Decoding...`);
  }
}
input = inputfield.value.trim();

function translate() {
  input = document.getElementById("text").value.trim();
  if (tomorse.checked) {
    const radios = cipherblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    cipherblock.style.display = "none";
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
    const radios = cipherblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    cipherblock.style.display = "none";
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
    const radios = cipherblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    cipherblock.style.display = "none";
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
    const radios = cipherblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    cipherblock.style.display = "none";
    keyblock.style.display = "none";
    caesarblock.style.display = "none";
    output = reversestring(input);
    document.getElementById("output").value = output;
  } else if (cipher.checked) {
    if (cipher.checked && !tocaesar.checked && !toatbash.checked) {
      output = "Select a cipher!";
      learnmorelink.style.display = "none";
      typeEffect2(``);
    }
    document.getElementById("output").value = output;
    cipherblock.style.display = "block";
    caesarblock.style.display = "none";
  } else {
    output = "Select a method!";
    document.getElementById("output").value = output;
  }
  document.getElementById("output").value = output;

  input = inputfield.value.trim();
  output = document.getElementById("output").value;

  // Only save valid translations
  if (
    output &&
    output !== "Select a method!" &&
    output !== "Select a cipher!" &&
    output !== "Select an operation!"
  ) {
    // Debounce: wait 2 seconds after typing stops
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Only save if input is different from last save
      if (input !== lastInput) {
        saveToHistory(input, output);
        lastInput = input; // Remember what we saved
      }
    }, 4000); // 2 seconds delay
  }
}
cancelbtn.onclick = function () {
  document.getElementById("text").value = "";
  document.getElementById("output").value = "";
  typeEffect2(``);
};

// Simple history functions
const maxhist = 55;
function saveToHistory(input, output) {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  if (document.getElementById("text").value === "") {
    console.log(`Empty: Skipping`);
    return;
  }
  if (history.length > 0) {
    const lastItem = history[0];
    if (lastItem.input === input && lastItem.output === output) {
      console.log(`Duplicate Detected: Skipping`);
      return;
    }
  }

  // Get current cipher and operation type
  const selectedCipher =
    document.querySelector('input[name="translator"]:checked')?.value ||
    document.querySelector('input[name="cipheroptions"]:checked')?.value;

  // Determine if encoding or decoding

  let operation;
  let cipher;
  if (
    document.getElementById("cipher").checked &&
    !tocaesar.checked &&
    !toatbash.checked
  ) {
    console.log(`null`);
  } else {
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
    )
      operation = "Decoding";
    if (reverse.checked) {
      operation = "Encoding";
    }
    if (toatbash.checked) {
      operation = "Encoding";
      cipher = "Atbash";
      history.unshift({
        input: input,
        output: output,
        cipher: cipher,
        operation: operation,
        timestamp:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
      });
    } else {
      // Add new item to beginning
      history.unshift({
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
  }
  // Keep only last 10 items
  if (history.length > maxhist) {
    history.length = maxhist;
    alert(`History Limit reached only keeping latest ${maxhist} translations!`);
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
  console.log(firstTranslation);
  localStorage.setItem(
    "lastTranslation",
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
  );
  checkAchievements();
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const historyList = document.getElementById("historyList");
  const historySection = document.getElementById("historySection");

  if (history.length === 0) {
    document.getElementById(
      "length"
    ).textContent = `Translations: ${history.length}/50`;
    document.getElementById(
      "length1"
    ).textContent = `Translations: ${history.length}/50`;

    historyList.innerHTML = `<p>No translation history yet!</p>`;
  } else {
    document.getElementById(
      "length"
    ).textContent = `Translations: ${history.length}/50`;
    document.getElementById(
      "length1"
    ).textContent = `Translations: ${history.length}/50`;

    historyList.innerHTML = history
      .map(
        (item) =>
          `<div class="history-item">
                <p><strong>${item.input}</strong> → ${item.output}</p>
                <small>${item.operation} • ${item.cipher} • ${item.timestamp}</small>
            </div>
        `
      )
      .join("");
  }
  historySection.style.display = "block";
}

function toggleHistory() {
  const historySection = document.getElementById("historySection");
  if (historySection.style.display === "none") {
    showHistory(); // This now properly displays the history
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
  } else {
    historySection.style.display = "none";
  }
}

function clearHistory() {
  if (
    confirm(
      `Do you want to clear history!\nUncompleted achievement(s) progress along with stats will be wiped!`
    )
  ) {
    localStorage.removeItem("translationHistory");
    alert(`History Cleared Successfully!`);
    alert(`Completed Achievements were not wiped!`);
    showHistory();
  }
}

function showStats() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const totalTranslations = history.length;
  const totalChars = history.reduce((sum, item) => sum + item.input.length, 0);

  alert(
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
  const statsSection = document.getElementById("statsSection");
  if (statsSection.style.display === "none") {
    calculateStats();
    statsSection.style.display = "block";
    document.getElementById("historySection").style.display = "none";
    document.getElementById("achievementsBoard").style.display = "none";
  } else {
    statsSection.style.display = "none";
  }
}

// Refresh stats
function refreshStats() {
  calculateStats();
}

let modeChangeTimer;

function saveOnModeChange() {
  clearTimeout(modeChangeTimer);
  modeChangeTimer = setTimeout(() => {
    const input = inputfield.value.trim();
    const output = document.getElementById("output").value;
    if (
      input &&
      output &&
      output !== "Select a method!" &&
      output !== "Select a cipher!"
    ) {
      const history =
        JSON.parse(localStorage.getItem("translationHistory")) || [];
      const lastItem = history[0];

      if (!lastItem || lastItem.output !== output) {
        saveToHistory(input, output);
      }
    }
  }, 300); // 0.3 second delay
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
    alert(`Easter Egg Features enabled and activated!`);
  }

  if (!reward && hasspecialacess) {
    const secretMessage =
      "VHlwZSAicmV3YXJkLyIgdG8gdW5sb2NrIHRoZSBFYXN0ZXIgRWdnIFJld2FyZCE=";
    try {
      // Try to copy to clipboard
      await navigator.clipboard.writeText(secretMessage);
      alert(
        "✅ Reward message copied to clipboard! \n\nDecode this in Base64 mode to unlock your reward!"
      );
      alert(
        `Easter Egg activated follow instructions from secret message to activate fully!`
      );
    } catch (err) {
      // Fallback: show message to copy manually
      alert(
        "📋 Please copy this secret Base64 message: \n\n" +
          secretMessage +
          "\n\nThen decode it in Base64 mode!"
      );
    }
    localStorage.setItem("reward", "true");
  }
  if (reward) {
  }
  inputfield.addEventListener(`input`, (e) => {
    const text = e.target.value.toLowerCase();
    const hasspecialacess = localStorage.getItem("specialEasterEgg") === "true";
    const reward = localStorage.getItem("reward") === "true";

    const activated = localStorage.getItem("activate") === "true";
    if (
      hasspecialacess &&
      text === "reward/" &&
      reward &&
      localStorage.getItem("rewardblock") === "true"
    ) {
      alert(`Instructions are already activated!`);
    }
    if (hasspecialacess && text === "reward/" && reward && !waiting) {
      waiting = true;
      alert(`Easter Egg instructions activated!`);
      const rewarddet = document.getElementById("reward");
      rewarddet.style.display = "block";
      localStorage.setItem("rewardblock", "true");

      alert(`Instructions open view info section of page!`);
    }
    if (activated && text === "activate/") {
      alert(`Already Activated!`);
    }
    if (activated && text === "reward/") {
      alert(`Already Activated!`);
    }
    if (hasspecialacess && text === "activate/") {
      alert(`Easter Egg fully activated!`);
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
            showStats();
            e.target.value = "";
          }, 2000);
          break;
        case "rewardblock/":
          const rewarddet = document.getElementById("reward");
          rewarddet.style.display = "block";
          break;
        case "ref stats/":
          typeEffect2(`Refreshing`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            refreshStats();
            toggleStats();
            e.target.value = "";
          }, 2000);
          break;
        case "ref hist/":
          typeEffect2(`Refreshing`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            showHistory();
            e.target.value = "";
          }, 2000);
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
        case "close/":
          typeEffect2(`Closing`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            const alldet = document.querySelectorAll("details");
            alldet.forEach((detail) => {
              detail.style.transition = "all 0.3s ease";
              detail.open = false;
            });
            document.getElementById("achievementsBoard").style.display = "none";
            document.getElementById("historySection").style.display = "none";
            document.getElementById("statsSection").style.display = "none";
            alert(`All sections closed!`);
            e.target.value = "";
          }, 2000);
          break;
        case "close hist/":
          typeEffect2(`Closing history`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            document.getElementById("historySection").style.display = "none";
            e.target.value = "";
          }, 3000);
          break;
        case "close stats/":
          typeEffect2(`Closing Stats`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            document.getElementById("statsSection").style.display = "none";
            e.target.value = "";
          }, 3000);
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
            alert(`To view change switch theme to dark mode1`);
            alert(`To reverse the color change effect reload the page!`);
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
        case "ref ach/":
          typeEffect2(`Refreshing`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            showAchievements();
            e.target.value = "";
          }, 3000);
          break;
        case "x name/":
          typeEffect2(`Refreshing`, "orange");
          setTimeout(() => {
            typeEffect2(``);
            resetname();

            // showAchievements();
            e.target.value = "";
          }, 3000);
          break;
        case "party/":
          typeEffect2(`Party Time🎉🎉🎉`);
          setTimeout(() => {
            typeEffect2(``);
            alert(`Entering Party Mode!`);
            activateRainbowTheme();
            alert(`To view change switch theme to dark mode!`);
            alert(`To reverse the color change effect reload the page!`);
            e.target.value = "";
          }, 2000);
          break;
        case "fun/":
          if (localStorage.getItem("theme") === "dark") {
            createParticles();
            animateParticles();
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
  //  if (selectedCipher === 'caesar' && document.getElementById('caesardecode')?.checked) operation = 'Decoding';
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
    output.value === "Select a cipher" ||
    output.value === "Select a cipher"
  ) {
    if (confirm(`Share site link`)) {
        const message = `Try out CipherX\nAn awesome multi-cipher translator\nTranslate text from English to Morse, Binary, Base64, Caesar(Encoding and Decoding),  Atbash, Reverse and vice versa\nTry it out yourself at ${window.location.href}`;
      if (navigator.share) {
        navigator
          .share({
            text: message,
          })
          .then(() => {
            console.log("Shared successfully!");
          })
          .catch((err) => {
            console.log("Error sharing:", err);
            fallbackShare(message);
          });
      } else {
        fallbackShare(message);
      }
    } else {
      alert("Nothing to share! Translate something first!");
    }
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
        console.log("Shared successfully!");
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        fallbackShare(message);
      });
  } else {
    fallbackShare(message);
  }
}

// Fallback for browsers that don't support Web Share API
function fallbackShare(message) {
  // Copy to clipboard
  if (confirm(`Share cancelled\nWould you like to copy instead`)) {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        alert("Copied to clipboard! Paste anywhere to share!");
      })
      .catch((err) => {
        // Old-school prompt method
        prompt("Copy this to share:", message);
      });
  }
}
function sharesite() {
  const message = `Try out CipherX\nAn awesome multi-cipher translator\nTranslate text from English to Morse, Binary, Base64, Caesar(Encoding and Decoding),  Atbash, Reverse and vice versa\nTry it out yourself at ${window.location.href}`;
  if (navigator.share) {
    navigator
      .share({
        text: message,
      })
      .then(() => {
        console.log("Shared successfully!");
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        fallbackShare(message);
      });
  } else {
    fallbackShare(message);
  }
}

const dehist = document.getElementById("dehist");
if (dehist.open) {
  document.getElementById("inst").textContent = "Tap to Close";
} else {
  document.getElementById("inst").textContent = "Tap to Open";
}
document.getElementById("inst").addEventListener("click", function () {
  if (dehist.open) {
    dehist.open = false;
    document.getElementById("inst").textContent = "Tap to Open";
  } else {
    dehist.open = true;
    document.getElementById("inst").textContent = "Tap to Close";
  }
});
// Check achievements whenever history updates
function checkAchievements() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const historyCount = history.length;
  const totalTranslations =
    parseInt(localStorage.getItem("totalTranslation")) || historyCount;
  // 🏆 Achievement unlocks
  if (totalTranslations >= 5 && !localStorage.getItem("achievement_5")) {
    alert(`🎉 Achievement Unlocked: "Apprentice Translator" (5 translations)!`);
    localStorage.setItem("achievement_5", "true");
  }
  if (totalTranslations >= 15 && !localStorage.getItem("achievement_15")) {
    alert('🎉 Achievement Unlocked: "Cipher Master" (15 translations)!');
    localStorage.setItem("achievement_15", "true");
    // 🎮 ACTIVATE SPECIAL EASTER EGG
    alert(`You unlocked the Easter Egg feature!`);

    localStorage.setItem("specialEasterEgg", "true");
    getSecretReward();
  }
  if (totalTranslations >= 30 && !localStorage.getItem("achievement_30")) {
    alert('🎉 Achievement Unlocked: "Translation Guru" (30 translations)!');
    localStorage.setItem("achievement_30", "true");
  }
  if (totalTranslations >= 100 && !localStorage.getItem("achievement_100")) {
    alert(
      '🎉 Achievement Unlocked: "Translation Overlord" (100 translations)!'
    );
    localStorage.setItem("achievement_100", "true");
  }

  // Character count achievement
  const totalChars = history.reduce((sum, item) => sum + item.input.length, 0);
  if (totalChars >= 500 && !localStorage.getItem("achievement_500_chars")) {
    alert('🎉 Achievement Unlocked: "Word Smith" (500 characters translated)!');
    localStorage.setItem("achievement_500_chars", "true");
  }

  // All ciphers achievement
  const usedCiphers = new Set(history.map((item) => item.cipher));
  if (
    usedCiphers.size >= 5 &&
    !localStorage.getItem("achievement_all_ciphers")
  ) {
    alert(
      '🎉 Achievement Unlocked: "Cipher Collector" (Used all cipher types)!'
    );
    localStorage.setItem("achievement_all_ciphers", "true");
  }

  // Speed achievement (multiple translations in short time)
  if (totalTranslations > 9) {
    const recentTime = new Date(history[0].timestamp).getTime();
    const oldTime = new Date(history[2].timestamp).getTime();
    if (
      recentTime - oldTime < 300000 &&
      !localStorage.getItem("achievement_speedster")
    ) {
      // 5 minutes
      alert(
        '🎉 Achievement Unlocked: "SpeedSter" (10 translations in 5 minutes)!'
      );
      localStorage.setItem("achievement_speedster", "true");
    }
  }
  if (historyCount > totalTranslations) {
    localStorage.setItem("totalTranslations", historyCount);
  }
}

// Call this in your saveToHistory function after saving
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
      id: "achievement_speedster",
      title: "Speedster:",
      emoji: "🔓",
      desc: "Translate 10 times in 5 minutes",
      target: 10,
      current: Math.min(totalTranslations, 10),
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
      title: "Word smith:",
      emoji: "🔓",
      desc: "Translate 500 chars",
      target: 500,
      current: Math.min(totalChars, 500),
    },
    {
      id: "achievement_100",
      title: "Translation Overlord:",
      emoji: "🔓",
      desc: "Translate 100 times",
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
  console.log(achievementCount);
  document.getElementById(
    "achlength"
  ).textContent = `Completed: ${achievementCount}/${achievements.length}`;
  list.innerHTML = achievements
    .map((ach) => {
      const progress = (ach.current / ach.target) * 100;
      return `
        <div style="margin: 10px 0; padding: 10px; border-radius: 5px;">
            <span style="font-size: 1.5em;">${
              localStorage.getItem(ach.id) ? "🏆" : "🔒"
            }</span>
            <strong>${ach.title}</strong>
            ${
              localStorage.getItem(ach.id)
                ? `✅ Unlocked! <br> Progress: Completed`
                : `❌ Locked <br> Progress: ${Math.round(progress)}%`
            }
            <span>${localStorage.getItem(ach.id) ? `(${ach.desc})` : ""}</span>
        </div>
  `;
    })
    .join("");

  board.style.display = "block";
}
function toggleach() {
  if (document.getElementById("achievementsBoard").style.display === "none") {
    showAchievements();
    document.getElementById("historySection").style.display = "none";
    document.getElementById("statsSection").style.display = "none";
  } else {
    document.getElementById("achievementsBoard").style.display = "none";
  }
}
function shareAchievements() {
  const achieved = [
    localStorage.getItem("achievement_5") && "🏆 Apprentice Translator:",
    localStorage.getItem("achievement_15") && "🏆 Cipher Master:",
    localStorage.getItem("achievement_30") && "🏆 Translation Guru:",
    localStorage.getItem("achievement_speedster") && "🏆 Speedster:",

    localStorage.getItem("achievement_all_ciphers") && "🏆 Cipher Collector:",
    localStorage.getItem("achievement_500_chars") && "🏆 Word Smith:",
    localStorage.getItem("achievement_100") && "🏆 Translation Overlord:",
  ].filter(Boolean);

  if (achieved.length === 0) {
    alert("No achievements yet! Keep translating! 💪");
    return;
  }
  if (achieved.length >= 6) {
    alert(`You are a real Boss`);
  }
  const message = `My CipherX Achievements:\n${achieved.join(
    "\n"
  )}\n\nTry to beat me at: ${window.location.href}`;

  if (navigator.share) {
    navigator
      .share({ text: message })
      .then(() => {
        console.log("Shared successfully!");
      })
      .catch((err) => {
        console.log("Error sharing:", err);
        fallbackShare(message);
      });
  } else {
    fallbackShare(message);
  }
}
function activateRainbowTheme() {
  document.body.classList.add("rainbow-theme");
}
