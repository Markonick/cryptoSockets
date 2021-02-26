import React, { useState, useEffect }  from "react";
// import { useHistory } from "react-router-dom";
import moment from 'moment';
import { makeStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Tick from "./Tick";
import SymbolLogo from './SymbolLogo'
import up from './assets/images/up.png'
import down from './assets/images/down.png'

const useStyles = makeStyles(theme => ({
    root: {
        width: "40%",
        height: "20px",
        background: "rgb(15, 15, 15)",
        marginLeft: "15%",
        marginRight: "15%",
        marginBottom: "8px",
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
        // fontFamily: "Helvetica",
        fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
        WebkitFontSmoothing: 'antialiased',
    },
    content: {
        padding: 10,
        fontSize: 18,
        fontStyle: "normal",
        fontWeight: "100",
        // fontFamily: "Helvetica",
        fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
        WebkitFontSmoothing: 'antialiased',
    }
}));

function TickCard(props) {
    const classes = useStyles();
    // const history = useHistory();
    let tick = Tick(props.symbol, props.currency)

    function handleTickClick(e) {
        e.preventDefault();
        console.log("TICK CARD CLICKED!")
        // history.push(`/`});
    }

    const price = tick.price
    const change = tick.change

    const color = change >= 0 ? change == 0 ? "white": "green" : "red"
    
    const logo = <SymbolLogo id={props.id} />
    const symbolCurrency = 
        (<div style={{
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: "100",
            fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
            // fontFamily: 'Arial,Helvetica,"Nimbus Sans L",sans-serif',
        }}
        >
            {props.symbol}/{props.currency}
        </div>)
    const tickItems = Object.keys(tick).map((key) => <p style={{color: color}} className={classes.title}>{key}: {tick[key]}</p>)
    const chip = (color) => {
        return (
        <Chip
            style={{
                color: color,
                borderColor: color,
                borderWidth: "thin",
                width: "80px",
                // marginTop: "10%",
                cursor: "pointer",
                //  position: "relative", top: "50%", transform: "translateY(-50%)"
            }}
            label={color === "green" ?  "UP": color === "white" ? "-" : "DOWN"}
            variant="outlined"
        />)
    }
    const upDown = change > 0 ? <ArrowDropUpIcon style={{fill: 'green',}}/> : <ArrowDropDownIcon style={{fill: 'red'}}/>
    // (
    // <img 
    //     src={change > 0? up : down}
    //     style={{height: "20px", position: "relative", top: "50%", transform: "translateY(-50%)",}}
    //     className="Symbol-logo"
    //     alt={change > 0? "up" : "down"}
    // />)
    const cardItems = [
        logo,
        symbolCurrency,
        tickItems,
        // chip(color),
        props.miniSeries,
        upDown,
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