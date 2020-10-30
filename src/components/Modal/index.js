import React from 'react';
import { Query } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { QueryGetUserTransaction } from '../../graphql/uniswap';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxHeight: '500px',
  };
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    minWidth: '150px',
  },
  paper: {
    position: 'absolute',
    width: 750,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
}));

function TransactionModal(props) {
  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  const userProps = props;
  const { userID } = userProps;
  return (
    <div>
      <Button
        className={classes.button}
        variant="contained"
        onClick={handleOpen}
      >
        Details
      </Button>
      <Modal
        aria-labelledby="Transaction Modal"
        aria-describedby="Show Transaction Info"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            Transactions
          </Typography>
          <Paper
            className={classes.root}
            style={{ maxHeight: 400, marginTop: 15, overflowY: 'auto' }}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Token&nbsp;Address</TableCell>
                  <TableCell>Token&nbsp;Symbol</TableCell>
                  <TableCell>Ehterum&nbsp;Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Query
                  query={QueryGetUserTransaction}
                  variables={{ user: userID }}
                >
                  {({ loading, error, data }) => {
                    if (error)
                      return (
                        <TableRow>
                          <TableCell>{error.message}</TableCell>
                        </TableRow>
                      );
                    if (loading)
                      return (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            Loading...
                          </TableCell>
                        </TableRow>
                      );
                    if (!data.transactions)
                      return (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No Transactions
                          </TableCell>
                        </TableRow>
                      );
                    return data.transactions.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>{row.tokenSymbol}</TableCell>
                        <TableCell>{row.ethAmount}</TableCell>
                      </TableRow>
                    ));
                  }}
                </Query>
              </TableBody>
            </Table>
          </Paper>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TransactionModal;
