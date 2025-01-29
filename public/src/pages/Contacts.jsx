import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUserRoute } from '../utils/APIRoutes';
import Contacts from './Contacts';

function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(JSON.parse(user));
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(`${allUserRoute}`);
          console.log("All users data:", data); // Ensure contacts data is being fetched
          setContacts(data); // Update the contacts state
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };
    fetchContacts(); // Fetch contacts only after currentUser is set
  }, [currentUser]);

  return (
    <Container>
      <div className='container'>
        <Contacts contacts={contacts} currentUser={currentUser}></Contacts>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-column: 35% 65%;
    }
  }
`;

export default Chat;

