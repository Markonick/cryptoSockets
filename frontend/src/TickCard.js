import React, {useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import moment from 'moment';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
// import RemoveIcon from '@material-ui/icons/Remove';
import StopIcon from '@material-ui/icons/Stop';
import Tick from "./Tick";
import SymbolLogo from './SymbolLogo'

const useStyles = makeStyles(theme => ({
  root: {
    width: "51%",
    height: "16px",
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
    WebkitFontSmoothing: 'antialiased',align: "left",
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
  const color = change >= 0 ? change == 0 ? "white" : "green" : "red"
  const logo = <SymbolLogo id = {props.id}/>
  
  const symbolCurrency = (
    <p style={{marginLeft: 10, position: "relative", top: "50%", transform: "translateY(-50%)"}}>
      {props.symbol.toUpperCase()}-{props.currency.toUpperCase()}
    </p>)
    
  const tickItems = Object.keys(tick).map((key) => <p style={{color: color}} className={classes.title}> {tick[key]} </p>)
      
  const upDown = change >= 0 ? change == 0 ? <StopIcon style={{ fill: 'yellow',}} fontSize='medium'/> :
    <ArrowDropUpIcon style={{ fill: 'green', }} fontSize='medium'/> 
    : 
    <ArrowDropDownIcon style={{fill: 'red'}} fontSize='medium'/>
  
  const logoAndSymbol = <div style={{ 
    display: 'flex', 
    flexDirection: "row",
    justifyContent: 'space-between', 
    fontStyle: "normal",
    fontWeight: "100",
    fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
    padding: 0,
    borderColor: 'rgb(25, 25, 25)',
    borderWidth: "thin",
    // height: 20,
    fontSize: 10,
    }}>
      {logo}
      {symbolCurrency}
    </div>

  const cardItems = [
      logoAndSymbol,
      ...tickItems,
      props.miniSeries,
      upDown,
  ];

  return ( 
    <Card className = { classes.root }>
      <Link style = {{color: "inherit",  textDecoration: "inherit", cursor: "pointer", }}
        onClick = {(e) => handleTickClick(e)} >
        <CardContent className = {classes.content} style = {{ padding: 5 }}>
          <div className={classes.actions}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }}> 
              {cardItems} 
            </div> 
          </div> 
        </CardContent > 
      </Link > 
    </Card >)
  }

  export default TickCard