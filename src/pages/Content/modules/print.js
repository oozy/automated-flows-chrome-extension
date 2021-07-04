const testFlows = [];
const elementValue = (e) => {
  const type = e.target.type;
  switch (type) {
    case 'text':
    case 'number':
      return e?.target?.value;
    case 'checkbox':
      return e?.target?.checked;
    case 'select-one':
      return e?.target?.options[e?.target?.selectedIndex]?.text;
    default:
      return e.target.innerText;
  }
};

class Recorder {
  constructor(type, element, data) {
    this._type = type;
    this._element = element;
    this._data = data;
    if (!this._data[this._type]) {
      this._data[this._type] = [];
    }
    // this.flows = [];
  }

  _record(input, msg) {
    const t = new Date().getTime();
    const value = elementValue(input);
    if (input?.target?.dataset?.hook) {
      testFlows.push(generateTest(input, t));
      console.log(
        t,
        `${msg} - Data has ${this._data[this._type].length} Click on ${
          input?.target?.dataset?.hook
        } dataHook`
      );
    } else if (input?.srcElement?.nodeName === 'A') {
      testFlows.push(generateTest(input, t));
    }
  }

  _startStop(start) {
    const addOrRemoveEventListener =
      (start ? 'add' : 'remove') + 'EventListener';

    for (let eventName of Object.keys(this._handlers)) {
      this._element[addOrRemoveEventListener](
        eventName,
        this._handlers[eventName]
      );
    }
  }

  start() {
    this._startStop(true);
  }

  stop() {
    this._startStop(false);
  }
}

const updateTestFlows = () => {
  const finalTests = testFlows.sort(function (a, b) {
    return new Date(a.time) - new Date(b.time);
  });
  console.log('updateTestFlows ()', finalTests);
  //TODO: save test in DB
};

class OnChangedRecorder extends Recorder {
  constructor() {
    super('change', ...arguments);
    this._handlers = {
      change: this._handleOnChange.bind(this),
      // add more handlers...
    };
  }

  _handleOnChange(e) {
    this._record(e, 'record onChange');
  }
}

class KeyboardRecorder extends Recorder {
  constructor() {
    super('keyboard', ...arguments);
    this._handlers = {
      keydown: this._handleKeyDown.bind(this),
      // add more handlers...
    };
  }

  _handleKeyDown(e) {
    if (String.fromCharCode(e.keyCode) === 13)
      this._record(e, 'record keydown : ' + String.fromCharCode(e.keyCode));
  }
}

class MouseRecorder extends Recorder {
  constructor() {
    super('mouse', ...arguments);
    this._handlers = {
      // mousemove: this._handleMouseMove.bind(this),
      click: this._handleClick.bind(this),
      dblclick: this._handleDblClick.bind(this),
      onmouseover: this._handleOnMouseOver.bind(this),
      // add more handlers...
    };
  }

  _handleMouseMove(e) {
    this._record(e, 'record mousemove');
  }

  _handleClick(e) {
    this._record(e, 'record click');
  }

  _handleDblClick(e) {
    this._record(e, 'record dblclick');
  }
  _handleOnMouseOver(e) {
    this._record(e, 'record dblclick');
  }
}

export default class App {
  constructor(params = {}) {
    this._container = params.container;

    this._data = {};

    this._keyboardRecorder = new KeyboardRecorder(this._container, this._data);
    this._mouseRecorder = new MouseRecorder(this._container, this._data);
    this._onChangeRecorder = new OnChangedRecorder(this._container, this._data);

    document.getElementById('start').onclick = (e) => {
      e.preventDefault();
      this.startRecording();
      console.log('started');
    };

    document.getElementById('stop').onclick = (e) => {
      e.preventDefault();
      this.stopRecording();
      console.log('stop');
    };
  }

  startRecording() {
    this._keyboardRecorder.start();
    this._mouseRecorder.start();
    this._onChangeRecorder.start();
  }

  stopRecording() {
    this._keyboardRecorder.stop();
    this._mouseRecorder.stop();
    this._onChangeRecorder.stop();
    updateTestFlows(testFlows);
  }
}

function generateTest(input, t) {
  const value = elementValue(input);
  const element = input?.srcElement?.nodeName.toLowerCase() || 'div';
  const dataHook = input?.target?.dataset?.hook || '';
  const time = t;
  const action = input.type || '';
  const pageUrl = document.URL || '';
  return {
    element: element,
    action: action,
    dataHook: dataHook,
    value: value,
    time: time,
    pageUrl: pageUrl,
  };
}
