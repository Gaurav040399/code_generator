const baseURL =  "http://localhost:8080";
let editor;

const onGotAmdLoader = () => {
  // Load the Monaco Editor library
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs' }});
  require(['vs/editor/editor.main'], () => {
    // Monaco Editor is now available
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: 'console.log("Hello, World!");',
      language: 'javascript',
      theme: 'vs-dark',
    });
  });
};

// Load AMD loader if necessary
if (typeof require === 'undefined') {
  const loaderScript = document.createElement('script');
  loaderScript.type = 'text/javascript';
  loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs/loader.min.js';
  loaderScript.addEventListener('load', onGotAmdLoader);
  document.body.appendChild(loaderScript);
} else {
  onGotAmdLoader();
}


// Buttons
let convertBtn = document.getElementById("convert-btn");
let debugBtn = document.getElementById("debug-btn");
let quelityBtn = document.getElementById("quality-btn");


convertBtn.addEventListener("click",()=>{
    const language = document.getElementById("language").value;
    const code = editor.getValue();

    fetch(`${baseURL}/convert`,{
        method:"POST",
        body: JSON.stringify({language,code}),
        headers : {'Content-type':'application/json'}
    })
    .then(res => res.json())
    .then(data=>{
        document.getElementById("output-container").innerText = `Converted ${language} code:\n${data.response}`
    })
    .catch(err => console.log(err.message))
})



debugBtn.addEventListener('click', () => {
    // Implement your debug logic here
    const code = editor.getValue();
    fetch(`${baseURL}/debug`, {
      method: "post",
      body: JSON.stringify({code}),
      headers: {'Content-type':'application/json'}
    })
    .then(res => res.json())
    .then((data) => {
          document.getElementById('output-container').innerText = `${data.response}`;
    })
    .catch(error => {
      console.log(error.message);
    })
    document.getElementById('output-container').innerText = 'Debugging...';
  });

  quelityBtn.addEventListener('click', () => {
    // Implement your quality check logic here
    const code = editor.getValue();
    fetch(`${baseURL}/qualityCheck`, {
      method: "post",
      body: JSON.stringify({code}),
      headers: {'Content-type':'application/json'}
    })
    .then(res => res.json())
    .then((data) => {
          document.getElementById('output-container').innerText = `${data.response}`;
    })
    .catch(error => {
      console.log(error.message);
    })
    document.getElementById('output-container').innerText = 'Checking quality...';
  });