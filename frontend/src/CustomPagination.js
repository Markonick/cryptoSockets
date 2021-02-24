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
}));

export default function PaginationControlled(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>Page: {props.page}</Typography>
      <Pagination count={props.count} page={props.page} onChange={props.func} />
    </div>
  );
}