window.alert(
  `Welcome to CipherX.\nThis site is stil under development so you might experience some bugs.\nWe apologize for any error you come across do well to report it to us(link can be found in the footer of the page).\nMore features coming soon...`
);
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
// const info = document.getElementById("info");
let input;

function typeEffect2(text, color) {
  const info = document.getElementById("info");

  // Clear timeouts if rerunning
  if (info._typingTimeouts) {
    info._typingTimeouts.forEach(clearTimeout);
  }
  info._typingTimeouts = [];

  info.innerHTML = "";
  info.style.color = color;

  let i = 0;

  function typeChar() {
    if (i < text.length) {
      const char = text.charAt(i);
      info.innerHTML += char === "\n" ? "<br>" : char;

      const timeout = setTimeout(typeChar, 50);
      info._typingTimeouts.push(timeout);
      i++;
    }
  }

  typeChar(); // 👈 Only call it ONCE here
}

copy.onclick = function () {
  let text1 = document.getElementById("output").value;
  if (text1 === "") {
    alert("Nothing to copy");
  } else {
    navigator.clipboard.writeText(text1).then(() => {
      alert("Copied to clipboard");
    });
  }
};

//Letter → Morse
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
  radio.addEventListener("change", translate);
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
    document.getElementById("output").value = "";
    caesarblock.style.display = "block";
    keyblock.style.display = "block";
  } else if (toatbash.checked) {
    const radios = caesarblock.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => (radio.checked = false));
    caesarblock.style.display = "none";
    keyblock.style.display = "none";
    typeEffect2(``);
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

function translate() {
  input = inputfield.value.trim();
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
}
