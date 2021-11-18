import React, { useState, useRef } from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';

import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import "./App.css";

const Leaderlist = () => {
    const [events, setEvents] = useState([]);
    const [cantDelete, setCantDelete] = useState("");

    React.useEffect(() => {
        fetch('https://julisod-eventcalendar.herokuapp.com/leaders')
        .then(response => response.json()) 
        .then(responseData => { 
        setEvents(responseData)
        })
        .catch(err => console.error(err))
    }, [])
    
    const gridRef = useRef();

    const columns = [
        {field: "name", sortable: true, filter:true},
        {field: "email", sortable: true, filter:true},
        {field: "roles", sortable: true, filter:true},

        //cellStyle:params=> params.value === "high"? {color:'red'}: {color:'black'}
    ]


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
        <div className="ag-theme-alpine" style={{height: 300, width: 605, margin: "auto"}}>
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

export default Leaderlist;
