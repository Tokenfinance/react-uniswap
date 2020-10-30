import React from 'react';
import { Mutation } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import {
  QueryGetUserTransaction,
  QueryUpdateCache,
} from '../../graphql/uniswap';

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
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
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

function TransferModal(props) {
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
  let toId;
  let fromId;
  let tokenSymbol;
  let ethAmount;

  return (
    <div>
      <Mutation
        mutation={QueryUpdateCache}
        update={(cache, { data: { updateTransaction } }) => {
          const { transactions } = cache.readQuery({
            query: QueryGetUserTransaction,
            variables: { user: updateTransaction.user },
          });
          cache.writeQuery({
            query: QueryGetUserTransaction,
            data: {
              transactions: [...transactions, updateTransaction],
            },
          });
        }}
      >
        {updateTransaction => (
          <>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleOpen}
            >
              TRANSFER ETH
            </Button>
            <Modal
              aria-labelledby="Transaction Modal"
              aria-describedby="Show Transaction Info"
              open={open}
              onClose={handleClose}
            >
              <div style={modalStyle} className={classes.paper}>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updateTransaction({
                      variables: {
                        user: toId.value,
                        tokenAddress: fromId.value,
                        tokenSymbol: tokenSymbol.value,
                        ethAmount: ethAmount.value,
                      },
                      optimisticResponse: {
                        __typename: 'Mutation',
                        updateTransaction: {
                          user: toId.value,
                          tokenAddress: fromId.value,
                          tokenSymbol: tokenSymbol.value,
                          ethAmount: ethAmount.value,
                        },
                      },
                    });
                  }}
                >
                  <Typography variant="h6" id="modal-title">
                    Transfer ETC
                  </Typography>

                  <TextField
                    disabled
                    id="fromID"
                    label="From ID"
                    className={classes.textField}
                    margin="normal"
                    defaultValue={userID}
                    inputRef={node => {
                      toId = node;
                    }}
                  />
                  <TextField
                    id="toID"
                    label="To ID"
                    className={classes.textField}
                    margin="normal"
                    inputRef={node => {
                      fromId = node;
                    }}
                    required
                  />
                  <TextField
                    id="tokenSymbol"
                    label="Token Symbol"
                    className={classes.textField}
                    margin="normal"
                    inputRef={node => {
                      tokenSymbol = node;
                    }}
                    required
                  />
                  <TextField
                    id="ethAmount"
                    label="Eth Amount"
                    className={classes.textField}
                    margin="normal"
                    inputRef={node => {
                      ethAmount = node;
                    }}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      className={classes.button}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                    <Button
                      className={classes.button}
                      variant="contained"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </Modal>
          </>
        )}
      </Mutation>
    </div>
  );
}

export default TransferModal;
