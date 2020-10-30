import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TransferModal from '../TransferModal';
import TransactionModal from '../Modal';
import { QueryGetUserTransaction } from '../../graphql/uniswap';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class CustomizedTables extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll = () => {
    const { onLoadMore } = this.props;
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      onLoadMore();
    }
  };

  render() {
    const { classes, userData, userLoading } = this.props;

    if (!userData && userLoading) return <p>Loading...</p>;
    const users = userData.users === undefined ? [] : userData.users;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>User Id</StyledTableCell>
              <StyledTableCell align="right">ETH&nbsp;Balance</StyledTableCell>
              <StyledTableCell align="center">Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row, idx) => (
              <StyledTableRow key={`${row.id + idx}`}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <Query
                  query={QueryGetUserTransaction}
                  variables={{ user: row.id }}
                  fetchPolicy="cache-first"
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
                        <StyledTableCell align="center">
                          Loading...
                        </StyledTableCell>
                      );
                    let sum = 0;
                    if (data.transactions)
                      for (let i = 0; i < data.transactions.length; i += 1)
                        sum += parseFloat(data.transactions[i].ethAmount);
                    return (
                      <StyledTableCell align="right">{sum}</StyledTableCell>
                    );
                  }}
                </Query>
                <StyledTableCell
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <TransferModal userID={row.id} />
                  <TransactionModal userID={row.id} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {userLoading && (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  Loading...
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(CustomizedTables);
