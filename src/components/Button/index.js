import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(3),
  },
  input: {
    display: 'none',
  },
}));

export default function ContainedButtons(props) {
  const classes = useStyles();
  const { btnText } = props;

  return (
    <div>
      <Button variant="contained" color="primary" className={classes.button}>
        {btnText}
      </Button>
    </div>
  );
}
