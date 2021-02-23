import React, { useState, useEffect }  from "react";
// import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import Tick from "./Tick";
import SymbolLogo from './SymbolLogo'

const statusColor = {
    "IN PROGRESS": "yellow",
    "NEW": "aqua",
    "COMPLETED": "green"
  };

const useStyles = makeStyles(theme => ({
    root: {
        width: "70%",
        height: "40px",
        background: "rgb(15, 15, 15)",
        marginLeft: "15%",
        marginRight: "15%",
        // marginTop: "20px",
        borderRadius: "15px",
        color: "white",
        padding: theme.spacing(2, 1),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textDecoration: "none !important",
        "&:hover": {
        backgroundColor: "#1e1f20"
        }
    },
    title: {
        fontSize: 12,
        fontStyle: "normal",
        fontWeight: "100",
        fontFamily: "Helvetica",
        WebkitFontSmoothing: 'antialiased',
    },
    content: {
        padding: 10,
    }
}));

function TickCard(props) {
    const classes = useStyles();
    // const history = useHistory();

    const chipColor = statusColor["NEW"];
 
    const chip = (
        <Chip
        style={{
            color: chipColor,
            borderColor: chipColor,
            borderWidth: "thin",
            width: "120px",
            // marginTop: "10%",
            cursor: "pointer",
        }}
        label="TODO"
        variant="outlined"
        />
    );

    function handleTickClick(e) {
        e.preventDefault();
        console.log("TICK CARD CLICKED!")
        // history.push(`/`});
    }

    const logo = <SymbolLogo/>
    const tick = Tick()
    
    let color = ""
    let tickItems = ""
    
    color = tick.change > 0 ? "green" : "red"
    tickItems = Object.keys(tick).map((key) => {
        let item = tick[key]
        if(item !== undefined & item!== color) {
            item = item.toFixed(2)
        }
        
        return <p style={{color: color}} className={classes.title}>{key}: {item}</p>
    })
    console.log(tickItems)
    const cardItems = [
        logo,
        tickItems,
        chip
    ];

    return  (
        <Card className={classes.root}>
        <Link
            style={{
            color: "inherit",
            textDecoration: "inherit",
            cursor: "pointer",
            }}

            onClick={(e) => handleTickClick(e)}
        >
            <CardContent className={classes.content} style={{padding: 5}}>
            <div className={classes.actions}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                    {cardItems}
                </div>
            </div>
            </CardContent>
        </Link >
        </Card >
    )
}

export default TickCard