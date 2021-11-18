import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";

import Eventlist from "./Eventlist";
import "./App.css";
import Leaderlist from "./Leaderlist";

const App = () => {

  const [nav, setNav] = React.useState("eventlist");

  const handleChange = (event, value) => {
    setNav(value);
  };

  //this is to view the leaders and the events in a separate tab
  return (
    <div>
      <AppBar position="static" style={{ background: '#8456b3' }}>
        <Tabs
          value={nav}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab value="eventlist" label="Events" />
          <Tab value="leaderlist" label="Leaders" />
        </Tabs>
      </AppBar>
      {nav === "eventlist" && <Eventlist />}
      {nav === "leaderlist" && <Leaderlist />}
    </div>
  )
};

export default App;
