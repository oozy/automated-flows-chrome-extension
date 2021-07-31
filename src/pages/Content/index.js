import TestApp from './modules/print';

chrome.runtime.onMessage.addListener((message, sender, response) => {
  console.log({ message, sender });
  if (message.selectedTask) {
    myMain(message.selectedTask);
  }
});

// window.addEventListener('load', myMain, false);

function myMain(selectedTask) {
  var style = document.createElement('style');
  style.innerHTML = `@import url("https://fonts.googleapis.com/css?family=Roboto");
  @-webkit-keyframes come-in {
    0% {
      -webkit-transform: translatey(100px);
              transform: translatey(100px);
      opacity: 0;
    }
    30% {
      -webkit-transform: translateX(-50px) scale(0.4);
              transform: translateX(-50px) scale(0.4);
    }
    70% {
      -webkit-transform: translateX(0px) scale(1.2);
              transform: translateX(0px) scale(1.2);
    }
    100% {
      -webkit-transform: translatey(0px) scale(1);
              transform: translatey(0px) scale(1);
      opacity: 1;
    }
  }
  @keyframes come-in {
    0% {
      -webkit-transform: translatey(100px);
              transform: translatey(100px);
      opacity: 0;
    }
    30% {
      -webkit-transform: translateX(-50px) scale(0.4);
              transform: translateX(-50px) scale(0.4);
    }
    70% {
      -webkit-transform: translateX(0px) scale(1.2);
              transform: translateX(0px) scale(1.2);
    }
    100% {
      -webkit-transform: translatey(0px) scale(1);
              transform: translatey(0px) scale(1);
      opacity: 1;
    }
  }
  * {
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: 'Roboto', sans-serif;
  }
  
  .floating-container {
    position: fixed;
    width: 100px;
    height: 100px;
    bottom: 0;
    right: 0;
    margin: 35px 25px;
  }
  .floating-container:hover {
    height: 300px;
  }
  .floating-container:hover .floating-button {
    box-shadow: 0 10px 25px rgba(44, 179, 240, 0.6);
    -webkit-transform: translatey(5px);
            transform: translatey(5px);
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .floating-container:hover .element-container .float-element:nth-child(1) {
    -webkit-animation: come-in 0.4s forwards 0.2s;
            animation: come-in 0.4s forwards 0.2s;
  }
  .floating-container:hover .element-container .float-element:nth-child(2) {
    -webkit-animation: come-in 0.4s forwards 0.4s;
            animation: come-in 0.4s forwards 0.4s;
  }
  .floating-container:hover .element-container .float-element:nth-child(3) {
    -webkit-animation: come-in 0.4s forwards 0.6s;
            animation: come-in 0.4s forwards 0.6s;
  }
  .floating-container .floating-button {
    position: absolute;
    width: 65px;
    height: 65px;
    background: #2cb3f0;
    bottom: 0;
    border-radius: 50%;
    left: 0;
    right: 0;
    margin: auto;
    color: white;
    line-height: 65px;
    text-align: center;
    font-size: 23px;
    z-index: 100;
    box-shadow: 0 10px 25px -5px rgba(44, 179, 240, 0.6);
    cursor: pointer;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .floating-container .float-element {
    position: relative;
    display: block;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: 15px auto;
    color: white;
    font-weight: 500;
    text-align: center;
    line-height: 50px;
    z-index: 0;
    opacity: 0;
    -webkit-transform: translateY(100px);
            transform: translateY(100px);
  }
  .floating-container .float-element .material-icons {
    vertical-align: middle;
    font-size: 16px;
  }
  .floating-container .float-element:nth-child(1) {
    background: #42A5F5;
    box-shadow: 0 20px 20px -10px rgba(66, 165, 245, 0.5);
  }
  .floating-container .float-element:nth-child(2) {
    background: #4CAF50;
    box-shadow: 0 20px 20px -10px rgba(76, 175, 80, 0.5);
  }
  .floating-container .float-element:nth-child(3) {
    background: #FF9800;
    box-shadow: 0 20px 20px -10px rgba(255, 152, 0, 0.5);
  }`;
  document.getElementsByTagName('head')[0].appendChild(style);

  var div = document.createElement('div');
  div.innerHTML = `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <div id="timer" style="width: 85%;
  margin: 0px auto;
  display:none;
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9999;
  padding-top: 80px;
  box-sizing: border-box;">
  <img src="https://media.giphy.com/media/RiEW6mSQqjRiDy51MI/giphy.gif"/></div>
  <div id="loading" style="width: 85%;
  margin: 0px auto;
  display:none;
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9999;
  padding-top: 80px;
  box-sizing: border-box;">
  <img  src="https://upload.wikimedia.org/wikipedia/commons/5/54/Ajux_loader.gif"/></div>
  <div class="floating-container">
    <div class="floating-button">Start</div>
    <div class="element-container">
      <span id="start" class="float-element tooltip-left">
      Start
      </span>
        <span id="stop" class="float-element">
        Stop
      </span>
        <span class="float-element">
        <i class="material-icons">chat</i>
      </span>
    </div>
  </div>`;

  document.body.appendChild(div);

  new TestApp({ container: document, selectedTask });
}
