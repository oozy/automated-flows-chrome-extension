import axios from 'axios';

const testFlows = [];
const elementValue = (eventTarget) => {
  switch (eventTarget.type) {
    case 'text':
    case 'number':
    case 'password':
    case 'email':
    case 'url':
      return eventTarget?.value;
    case 'checkbox':
      return eventTarget?.checked;
    case 'select-one':
      return eventTarget?.options[eventTarget?.selectedIndex]?.text;
    default:
      return eventTarget.innerText;
  }
};

const getParentIfNeeded = (event) => {
  try {
    const eventTarget = event?.target || event;
    if (eventTarget?.hasAttribute('data-hook')) {
      return event;
    } else if (eventTarget?.parentNode) {
      return getParentIfNeeded(eventTarget?.parentNode);
    }
    return;
  } catch (e) {
    // console.error('Error while trying to find datahook', e);
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

  _record(event, msg) {
    const time = new Date().getTime();
    const action = event.type;
    const clientX = event?.clientX || 0;
    const clientY = event?.clientY || 0;
    if (event?.target?.id === 'start' || event?.target?.id === 'stop') return;
    if (event?.target?.dataset?.hook || event?.target?.id) {
      testFlows.push(generateTest(event, action, time, clientX, clientY));
    } else if (action !== 'mouseover' && event?.target?.nodeName === 'A') {
      testFlows.push(generateTest(event, action, time, clientX, clientY));
    } else if (event?.target) {
      const eventTarget = getParentIfNeeded(event);
      if (eventTarget)
        testFlows.push(
          generateTest(eventTarget, action, time, clientX, clientY)
        );
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

const removeDuplicateTests = (tests) => {
  const isEqualTest = (test1, test2) =>
    ['dataHook', 'action', 'element'].every(
      (field) => test1[field] === test2[field]
    );

  return tests.reduce((acc, currentTest, i) => {
    const nextTest = tests[i + 1];
    if (!nextTest || !isEqualTest(currentTest, tests[i + 1])) {
      acc = [...acc, currentTest];
    }

    return acc;
  }, []);
};

const updateTestFlows = async (testFlows, selectedTask) => {
  const tests = testFlows.sort(function (a, b) {
    return new Date(a.time) - new Date(b.time);
  });
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const finalTests = removeDuplicateTests(tests);

  console.log({ finalTests });

  // const { data } = await axios.post(
  //   'https://danielad37.wixsite.com/dive-tech/_functions/add_test_to_task',
  //   {
  //     taskId: selectedTask._id,
  //     testObject: { tests: finalTests, width: innerWidth, height: innerHeight },
  //   },
  //   {
  //     headers: {
  //       'Content-type': 'text/plain',
  //     },
  //   }
  // );
  // console.log({ data });
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
      mousedown: this._handleMouseDown.bind(this),
      mouseup: this._handleMouseUp.bind(this),
      click: this._handleClick.bind(this),
      dblclick: this._handleDblClick.bind(this),
      mouseover: this._handleOnMouseOver.bind(this),
      // add more handlers...
    };
  }

  _handleMouseDown(e) {
    this._record(e, 'record mousemove');
  }
  _handleMouseUp(e) {
    this._record(e, 'record mousemove');
  }

  _handleClick(e) {
    this._record(e, 'record click');
  }

  _handleDblClick(e) {
    this._record(e, 'record dblclick');
  }
  _handleOnMouseOver(e) {
    this._record(e, 'record over');
  }
}

export default class App {
  constructor(params = {}) {
    this._container = params.container;
    this.selectedTask = params.selectedTask;
    this._data = {};

    this._keyboardRecorder = new KeyboardRecorder(this._container, this._data);
    this._mouseRecorder = new MouseRecorder(this._container, this._data);
    this._onChangeRecorder = new OnChangedRecorder(this._container, this._data);

    document.getElementById('start').onclick = (e) => {
      e.preventDefault();
      this.startRecording();
      console.log('started');
    };

    document.getElementById('stop').onclick = async (e) => {
      e.preventDefault();
      await this.stopRecording();
      console.log('stop');
    };
  }

  startRecording() {
    this._keyboardRecorder.start();
    this._mouseRecorder.start();
    this._onChangeRecorder.start();
  }

  async stopRecording() {
    this._keyboardRecorder.stop();
    this._mouseRecorder.stop();
    this._onChangeRecorder.stop();
    await updateTestFlows(testFlows, this.selectedTask);
  }
}

function generateTest(event, action, time, clientX, clientY) {
  const eventTarget = event?.target || event;
  const value = elementValue(eventTarget);
  const element = eventTarget?.nodeName.toLowerCase() || 'div';
  const dataHook = eventTarget?.dataset?.hook;
  const pageUrl = document.URL || '';
  const data = {
    element,
    action,
    dataHook,
    ...(element === 'select' ? { id: eventTarget.id } : {}),
    ...(dataHook || ''.includes('slider') ? { x: clientX, y: clientY } : {}),
    value,
    time,
    pageUrl,
  };

  console.log(
    `${action} event on ${
      element === 'a' ? `${value} link` : `dataHook: ${dataHook}`
    }, flow details:`,
    {
      data,
    }
  );

  return data;
}
