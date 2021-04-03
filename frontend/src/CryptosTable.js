import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: "51%",
//     height: "16px",
//     background: "rgb(15, 15, 15)",
//     marginLeft: "15%",
//     marginRight: "15%",
//     marginBottom: "8px",
//     borderRadius: "15px",
//     color: "white",
//     padding: theme.spacing(2, 1),
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     textDecoration: "none !important",
//     "&:hover": {
//       backgroundColor: "#1e1f20"
//     }
//   },
//   title: {
//     fontSize: 12,
//     fontStyle: "normal",
//     fontWeight: "100",
//     // fontFamily: "Helvetica",
//     fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
//     WebkitFontSmoothing: 'antialiased',align: "left",
//   },
//   content: {
//     padding: 10,
//     fontSize: 18,
//     fontStyle: "normal",
//     fontWeight: "100",
//     // fontFamily: "Helvetica",
//     fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
//     WebkitFontSmoothing: 'antialiased',
//   }
// }));

const useStyles = makeStyles({
  root: {
    backgroundColor: "#1c1c1f",
    color: "white",
    width: "30%",
    marginLeft: "40px",
    borderRadius: "12px",
    padding: 10,
  },
  container: {
    background: "#1c1c1f",
    minHeight: 440,
    maxHeight: 440,
    color: "white",
  },
  row: {
    color: "white",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "100",
    fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
    WebkitFontSmoothing: 'antialiased',
    "&:hover": {
        backgroundColor: "aqua",
        opacity: "0.1",
    }
  }
});

const symbols = [
  "btc"  , "xrp"  , "doge" , "xlm"  , "trx"  , "eos"  , "ltc"  , "miota", "xmr"  , "link" , 
  "etn"  , "rdd"  , "strax", "npxs" , "glm"  , "aave" , "sol"  , "atom" , "cro"  , "ht"   ,
  "mkr"  , "snx"  , "algo" , "ksm"  , "comp" , "vgx"  , "ftm"  , "zec"  , "rune" , "cel"  ,
  "rev"  , "icx"  , "hbar" , "chsb" , "iost" , "zks"  , "lrc"  , "omg"  , "pax"  , "husd" ,
  "vet"  , "sc"   , "btt"  , "dash" , "xtz"  , "bch"  , "bnb"  , "ada"  , "usdt" , "dcn"  ,
  "tfuel", "xvg"  , "rvn"  , "bat"  , "dot"  , "theta", "luna" , "neo"  , "ftt"  , "dai"  ,
  "egld" , "fil"  , "leo"  , "sushi", "dcr"  , "ren"  , "nexo" , "zrx"  , "okb"  , "waves",
  "dgb"  , "ont"  , "bnt"  , "nano" , "matic", "xwc"  , "zen"  , "btmx" , "qtum" , "hnt"  ,
  "kndc" , "delta", "pib"  , "opt"  , "acdc" , "eth",
]
const MIN_WIDTH = 40;
const columns = [
  {
    id: '',
    label: '',
    minWidth: MIN_WIDTH, },
  {
    id: 'symbol',
    label: 'Symbol',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'price',
    label: 'Price',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'change',
    label: 'Change',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'mini-series',
    label: 'Mini-Series',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'plusMinus',
    label: '+/-',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
];

const createRow = (symbol, price, change) => {
  return { symbol, price, change };
}

const rows = symbols.map((symbol) => {
  return createRow(symbol, 10000, 0.6)
});

export default function CryptosTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root} >
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead >
            <TableRow >
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#1c1c1f",
                  color: "white"}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell className={classes.row} key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
