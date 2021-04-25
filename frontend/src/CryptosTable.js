import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import SymbolLogo from "./SymbolLogo";
import Tick from "./Tick";
import TimeSeries from './TimeSeries';
import KlineData from './api/KlineData';


const symbols = [
  "btc", "xrp", "doge", "xlm", "trx", "eos", "ltc", "miota", "xmr", "link",
  "etn", "rdd", "strax", "npxs", "glm", "aave", "sol", "atom", "cro", "ht",
  "mkr", "snx", "algo", "ksm", "comp", "vgx", "ftm", "zec", "rune", "cel",
  "rev", "icx", "hbar", "chsb", "iost", "zks", "lrc", "omg", "pax", "husd",
  "vet", "sc", "btt", "dash", "xtz", "bch", "bnb", "ada", "usdt", "dcn",
  "tfuel", "xvg", "rvn", "bat", "dot", "theta", "luna", "neo", "ftt", "dai",
  "egld", "fil", "leo", "sushi", "dcr", "ren", "nexo", "zrx", "okb", "waves",
  "dgb", "ont", "bnt", "nano", "matic", "xwc", "zen", "btmx", "qtum", "hnt",
  "kndc", "delta", "pib", "opt", "acdc", "eth",
];
const currency = 'usdt';
const MIN_WIDTH = 40;
const columns = [
  {
    id: 'logo',
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
    label: 'Change +/-',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'mini-series',
    label: '24h',
    minWidth: MIN_WIDTH,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
];

const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '*': {
                    'scrollbar-width': 'thin',
                },
                '*::-webkit-scrollbar': {
                    width: '2px',
                    height: '2px',
                    background: "#555",
                }
            }
        }
    }
});

const useStyles = makeStyles({
  root: {
    backgroundColor: "#1c1c1f",
    color: "white",
    width: "auto",
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
  }
});

const createRow = (logo, symbol, price, change, miniseries) => {
  return { logo, symbol, price, change, miniseries };
}

const rows = symbols.map((symbol) => {
  const logo = <SymbolLogo symbol={symbol} />;
  let tick = <Tick symbol={symbol} currency={currency} />;
  // let miniseries = <TimeSeries symbol={symbol} currency={currency} />;
  console.log(tick)
  return createRow(logo, symbol.toUpperCase(), tick, "", "miniseries");
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
      <ThemeProvider theme={theme}>
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="sticky table">
            <TableHead >
              <TableRow >
                {columns.map((column) => (
                  <TableCell 
                    key={column.id}
                    align={column.align}
                    style={{
                      maxWidth: column.minWidth,
                      minWidth: column.minWidth,
                      backgroundColor: "#1c1c1f",
                      color: "white"
                    }}
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
      </ThemeProvider>
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
