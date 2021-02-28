import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

const useStyles = makeStyles(theme => ({
    root: {
        width: "50%",
        height: "20px",
        background: "inherit",
        marginLeft: "25%",
        marginBottom: "10px",
        color: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        textDecoration: "none !important",
        fontStyle: "normal",
        fontWeight: "100",
        // fontFamily: "Helvetica",
        fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
    },
}));

export default function TickTableHead(props) {
  const classes = useStyles();

  return (
      <Table  aria-label="simple table">
        <TableBody >
          <TableHead className={classes.root} >
            {props.items.map(item => <TableCell style={{borderBottom: "none", color: "white", padding: 0, marginLeft: 5, fontSize: 10,}} align="center">{item}</TableCell>)}
          </TableHead>
        </TableBody>
      </Table>
  );
}
