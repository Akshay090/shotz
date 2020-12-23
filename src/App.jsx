import React, { useEffect, useState } from "react";
import "./App.css";
import AppDesc from "./components/AppDesc";
import Btn from "./components/Btn";

import fullscreenScreenshot from "./screenshot";
// loading electron from the window to access IpcRenderer
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [screenShot, setScreenshot] = useState(false);
  const [intervalID, setIntervalID] = useState();
  const [folder, setFolder] = useState(Date.now());

  useEffect(() => {
    if (screenShot && !intervalID) {
      setFolder(Date.now());
      const interval = setInterval(() => {
        console.log("running interval", folder);
        fullscreenScreenshot((base64) => {
          ipcRenderer
            .invoke("save-data", base64, folder)
            .then(() => console.log("After save"));
        });
        // interval of 5 minutes is set to take screenshots
      }, 1000 * 60 * 5);
      console.log(interval, "interval set");
      // adding interval ref to state to clear later
      setIntervalID(interval);
    }
    if (!screenShot && intervalID) {
      clearInterval(intervalID);
      setIntervalID();
      console.log("clear interval");
    }
    return () => clearInterval(intervalID);
  }, [folder, intervalID, screenShot]);
  return (
    <div className="App">
      <header className="App-header">
        <AppDesc openDir={() => ipcRenderer.invoke("open-base-dir")} />
        <div className="btn-wrapper">
          {!screenShot ? (
            <Btn
              text="Start Screenshot"
              onClick={() => {
                setScreenshot(true);
              }}
            />
          ) : (
            <Btn
              className="btn stop"
              text="Stop Screenshot"
              onClick={() => {
                setScreenshot(false);
              }}
            />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
