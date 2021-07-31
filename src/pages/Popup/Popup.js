import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import './Popup.css';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Popup = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [extentionKey, setExtentionKey] = useState('');
  const [companyTasks, setCompanyTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginFaild, setLoginFaild] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');

  useEffect(() => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(tabs[0].id, {
          selectedTask,
        });
      }
    );
  }, [selectedTask]);

  return (
    <div className="App">
      <div className="login-container">
        <TextField
          label="enter company email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="enter your extention key"
          type="password"
          variant="outlined"
          value={extentionKey}
          onChange={(e) => setExtentionKey(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </div>
      <div style={{ margin: '40px' }}>
        {isLoading ? (
          'Loading...'
        ) : companyTasks ? (
          <div>
            <InputLabel id="demo-simple-select-label">
              {'Select the task you want to test:'}
            </InputLabel>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Task</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedTask.name}
                onChange={handleSelectedTask}
              >
                {companyTasks.map((task) => {
                  return <MenuItem value={task.name}>{task.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div>
        ) : (
          loginFaild && 'Wrong username or password!'
        )}
      </div>
    </div>
  );

  function handleSelectedTask(e) {
    const selectedTaskName = e.target.value;
    const selectedTask = companyTasks.find(
      (task) => task.name === selectedTaskName
    );
    if (selectedTask) {
      setSelectedTask(selectedTask);
    }
  }

  async function handleLogin() {
    setIsLoading(true);
    try {
      // test email & extentionKey:
      // emai: wixteasasdasdzxcxc@gmail.com
      // extentionKey: 70e4eb77-d588-4d26-b8ba-8de371ec4f9f
      const { data } = await axios.post(
        'https://danielad37.wixsite.com/dive-tech/_functions/company_task_by_key',
        {
          email,
          extentionKey,
        }
      );
      if (data.companyTasks) {
        setCompanyTasks(data.companyTasks);
      } else {
        setCompanyTasks(null);
        setLoginFaild(true);
      }
    } catch (e) {
      setCompanyTasks(null);
      setLoginFaild(true);
    } finally {
      setIsLoading(false);
    }
  }
};

export default Popup;
