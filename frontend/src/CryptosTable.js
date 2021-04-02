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
const MIN_WIDTH = 100;
const columns = [
  { id: 'name', label: 'Name', 
    minWidth: MIN_WIDTH, },
  { id: 'code', label: 'ISO\u00a0Code', 
    minWidth: MIN_WIDTH, },
  {
    id: 'population',
    label: 'Population',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
  root: {
    background: "#1c1c1f",
    width: '80%',
    borderRadius: "12px",
    color: "white",
    padding: 10,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "100",
    fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
  container: {
    background: "#1c1c1f",
    maxHeight: "75%",
    },
//   row: {
//     color: "white",
//     "&:hover": {
//         backgroundColor: "aqua",
//         // opacity: "0.1",
//     }}
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
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow className={classes.row} hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
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
