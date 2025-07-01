import React from 'react';
import styled from 'styled-components';

function Welcome({ currentUser }) {
  return (
    <Container>
      <h1>
        Welcome, <span>{currentUser?.username}!</span>
      </h1>
      <h3>Please select a contact to start chatting.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;

  span {
    color: #4e00b7;
  }

  h1, h3 {
    margin: 0.5rem 0;
  }
`;

export default Welcome;
