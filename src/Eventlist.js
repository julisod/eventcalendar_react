import React, { useState, useRef } from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';

import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import "./App.css";

const Eventlist = () => {

  const [newEvent, setNewEvent] = useState({name:"", description:"", type:"", startDate: "", endDate:"", place:"", targetGroup:"", leader:{}});
  const [events, setEvents] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [cantDelete, setCantDelete] = useState("");

  React.useEffect(() => {
    fetch('https://julisod-eventcalendar.herokuapp.com/events')
    .then(response => response.json()) 
    .then(responseData => { 
      setEvents(responseData)
    })
    .catch(err => console.error(err))
  }, [newEvent.leader])

  React.useEffect(() => {
    fetch('https://julisod-eventcalendar.herokuapp.com/leaders')
    .then(response => response.json()) 
    .then(responseData => { 
      setLeaders(responseData)
    })
    .catch(err => console.error(err))
  }, [])
  
  const gridRef = useRef();

  const columns = [
    {field: "name", sortable: true, filter:true},
    {field: "description", sortable: true, filter:true, autoHeight:true},
    {field: "type", sortable: true, filter:true},
    {field: "duration", sortable: true, filter:true},
    {field: "place", sortable: true, filter:true},
    {field: "targetGroup", sortable: true, filter:true, headerName:"Target group"},
    {field: "leader.name", sortable: true, filter:true, headerName:"Leader"}
    //cellStyle:params=> params.value === "high"? {color:'red'}: {color:'black'}
  ]

  const inputChanged = (event) => {
    setNewEvent({...newEvent, [event.target.name]: event.target.value});
  };

  //adding the new event
  const addEvent = (event) => {
    event.preventDefault();
    newEvent.leader = leaders[0]; //don't know how to link the selected leader so we're taking the shortcut
    fetch('https://julisod-eventcalendar.herokuapp.com/events', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
     });
    setNewEvent({name:"", description:"", type:"", startDate: "", endDate:"", place:"", targetGroup:"", leader:{}});
  }

  //this doesn't go to the db, this is just for aesthetics
  const deleteItem = () => {
    if (gridRef.current.getSelectedNodes().length > 0) {
    setEvents(events.filter((event, i) => i !== gridRef.current.getSelectedNodes()[0].childIndex))
    } else {
      setCantDelete("select a row first");
    }
  }

  //if user selects a row, we can clear the message about having to select a row first
  const clearMessage = () => {
    setCantDelete("");
  }

  return (
    <div className="App">
        <br />
        <form onSubmit={addEvent}>
        <TextField name="name" variant="standard" label="Name" onChange={inputChanged} value={newEvent.name} required/>
        <TextField name="description" variant="standard" label="Description" onChange={inputChanged} value={newEvent.description} required/>
        <TextField name="type" variant="standard" label="Type" onChange={inputChanged} value={newEvent.type} required/>
        <TextField name="startDate" type="date" variant="standard" label="Start date" onChange={inputChanged} value={newEvent.startDate} required/>
        <TextField name="endDate" type="date" variant="standard" label="End date" onChange={inputChanged} value={newEvent.endDate} required/>
        <TextField name="place" variant="standard" label="Place" onChange={inputChanged} value={newEvent.place} required/>
        <TextField name="targetGroup" variant="standard" label="Target group" onChange={inputChanged} value={newEvent.targetGroup} required/>
        <Button type="submit" variant="contained" color="secondary" endIcon={<AddCircleOutlineIcon />}>Add</Button>
      </form>
      <div className="ag-theme-alpine" style={{height: 400, width: "90%", margin: "auto"}}>
        {/*haluisin keksiä miten ton taulukon ympärille saa enemmän tyhjää tilaa*/}
        <AgGridReact
          onRowSelected={clearMessage}
          rowData={events}
          columnDefs={columns}
          ref={gridRef}
          rowSelection="single"
          onGridReady={params => gridRef.current = params.api}
        />
       </div>
       <p>{cantDelete}</p>
       <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} onClick={deleteItem}>Delete</Button>
    </div>
  );
};

export default Eventlist;
