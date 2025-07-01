import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from "../assets/Logo.png";

function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImg);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const handleContactSelect = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h3>ChatNest</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                key={contact._id}
                onClick={() => handleContactSelect(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`${contact.avatarImg}`}
                    alt="avatar"
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`${currentUserImage}`}
                alt="Current user avatar"
              />
            </div>
            <div className="username">
              <h1>{currentUserName}</h1>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    padding: 0.5rem;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ffffff39;
      border-radius: 1rem;
    }

    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.4rem;
      gap: 1rem;
      align-items: center;
      display: flex;
      transition: 0.3s ease-in-out;
      cursor: pointer;

      &:hover {
        background-color: #ffffff55;
      }

      &.selected {
        background-color: #4e00b7;
        color: white;
      }

      .avatar {
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .current-user {
    background-color: #2d2d2d;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 10px;
    margin: 0.5rem;

    .avatar {
      img {
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
      }
    }

    .username {
      color: white;
      h1 {
        font-size: 1.2rem;
      }
    }
  }
`;

export default Contacts;



