import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  page: {
    fontStyle: "normal",
    fontSize: 12,
    fontWeight: "100",
    fontFamily: 'normal 100%/1.5 "Dosis", sans-serif',
  }
}));

export default function PaginationControlled(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.page}>Page: {props.page}</Typography>
      <Pagination count={props.count} page={props.page} onChange={props.func} />
    </div>
  );
}