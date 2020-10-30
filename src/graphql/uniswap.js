import gql from 'graphql-tag';

export const QueryGetUserData = gql`
  query GetUserData($first: Int!, $skip: Int!) {
    users(first: $first, skip: $skip) {
      id
    }
  }
`;

export const QueryGetAllTransactions = gql`
  query GetAllTransaction {
    transactions {
      id
      user
      tokenAddress
      tokenSymbol
    }
  }
`;

export const QueryGetUserTransaction = gql`
  query GetUserTransaction($user: Bytes!) {
    transactions(where: { user: $user }) {
      id
      user
      tokenAddress
      tokenSymbol
      ethAmount
    }
  }
`;

export const QueryUpdateCache = gql`
  mutation UpdateCache(
    $user: Bytes!
    $tokenSymbol: String!
    $ethAmount: BigDecimal!
  ) {
    updateTransaction(
      user: $user
      tokenSymbol: $tokenSymbol
      ethAmount: $ethAmount
    ) {
      id
      user
      tokenSymbol
      ethAmount
    }
  }
`;
