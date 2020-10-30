import React from 'react';
import { Query } from 'react-apollo';
import AppBar from '../../components/AppBar';
import DataTable from '../../components/DataTable';
import { QueryGetUserData } from '../../graphql/uniswap';
import './style.css';

function Dashboard() {
  let skip = 0;
  const first = 20;
  return (
    <React.Fragment>
      <AppBar />
      <div className="container">
        <Query
          notifyOnNetworkStatusChange
          query={QueryGetUserData}
          variables={{ first, skip }}
        >
          {({ loading, error, data, fetchMore }) => {
            if (error) return <p>{error.message}</p>;
            return (
              <DataTable
                userLoading={loading}
                userData={data || []}
                onLoadMore={() => {
                  fetchMore({
                    query: QueryGetUserData,
                    variables: { first, skip },
                    updateQuery: (prevResult, { fetchMoreResult }) => {
                      const newResult = fetchMoreResult;
                      const newUserData = prevResult;
                      skip += 20;
                      for (let i = 0; i < newResult.users.length; i += 1)
                        newUserData.users.push(fetchMoreResult.users[i]);
                      return newResult.length
                        ? {
                            data: newUserData.users,
                          }
                        : prevResult;
                    },
                  });
                }}
              />
            );
          }}
        </Query>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
