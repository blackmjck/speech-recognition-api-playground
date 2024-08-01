import './style.css';

let isSupported = false;
let isListening = false;
let ctor;

if (typeof SpeechRecognition !== 'undefined') {
  ctor = SpeechRecognition;
  isSupported = true;
} else if (typeof webkitSpeechRecognition !== 'undefined') {
  ctor = webkitSpeechRecognition;
  isSupported = true;
}

const $btn = document.getElementById('start');
const $output = document.getElementById('results');

if (isSupported && ctor) {
  const recognition = new ctor();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  $btn!.addEventListener('click', handleClick);

  function toggleDisplay(listening: boolean): void {
    if (listening) {
      recognition.stop();
      $btn!.innerText = 'Start listening again';
      isListening = false;
    } else {
      recognition.start();
      $btn!.innerText = 'Stop listening';
      isListening = true;
    }
  }

  function handleClick() {
    toggleDisplay(isListening);
  }

  recognition.addEventListener('result', (evt) => {
    console.log('Result:', evt);

    const text = evt.results[0][0].transcript;
    if (text) {
      const p = document.createElement('p');
      p.textContent = '"' + text + '"';
      $output!.append(p);
    }

    // turn it back off
    toggleDisplay(true);
  });
} else {
  $btn!.remove();
  $output!.innerHTML = `
    <p>Sorry, but the Speech Recognition API is not available in your browser.</p>
  `;
}
