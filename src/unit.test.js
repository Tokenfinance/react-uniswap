import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { createShallow } from '@material-ui/core/test-utils';
import { configure, shallow } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { QueryGetUserData } from './graphql/uniswap';
import Dashboard from './containers/Dashboard';
import AppBar from './components/AppBar';
import Button from './components/Button';
import Modal from './components/Modal';
import TransferModal from './components/TransferModal';

configure({ adapter: new Adapter() });

describe('AppBar', () => {
  const wrapper = shallow(<AppBar />);

  it('has a button', () => {
    expect(
      wrapper
        .children()
        .children()
        .childAt(0),
    ).toHaveLength(1);
  });

  it('has a string called Etherum', () => {
    expect(
      wrapper
        .children()
        .children()
        .childAt(1)
        .text() === 'Etherum',
    );
  });
});

describe('Button', () => {
  const text = 'BUTTON';
  const wrapper = shallow(<Button btnText={text} />);

  it('has a string called BUTTON', () => {
    expect(wrapper.children().children() === text);
  });
});

describe('Modal', () => {
  it('renders without error', async () => {
    const mocks = {
      request: {
        query: QueryGetUserData,
        variables: { user: '0x0000000000c90bc353314b6911180ed7e06019a9' },
      },
      result: {
        data: {
          transactions: [
            {
              __typename: 'Transaction',
              ethAmount: '0.5',
              tokenAddress: 'GNO',
              id: '77906',
              user: '0x0000000000c90bc353314b6911180ed7e06019a9',
            },
          ],
        },
      },
    };

    const wrapper = createShallow(
      <MockedProvider mocks={mocks}>
        <Modal />
      </MockedProvider>,
    );

    await wait(0);
  });
});

describe('TransferModal', () => {
  it('renders without error', async () => {
    const mocks = {
      request: {
        query: QueryGetUserData,
        variables: { user: '0x0000000000c90bc353314b6911180ed7e06019a9' },
      },
      result: {
        data: {
          transactions: [
            {
              __typename: 'Transaction',
              ethAmount: '0.5',
              tokenAddress: 'GNO',
              id: '77906',
              user: '0x0000000000c90bc353314b6911180ed7e06019a9',
            },
          ],
        },
      },
    };

    const wrapper = createShallow(
      <MockedProvider mocks={mocks}>
        <TransferModal />
      </MockedProvider>,
    );
  });
});
