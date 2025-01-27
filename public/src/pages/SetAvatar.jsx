import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes.js";
import { Buffer } from 'buffer';

function SetAvatar() {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // Use useCallback to prevent redefinition of fetchAvatars function
    const fetchAvatars = useCallback(async () => {
        try {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const response = await axios.get(
                    `${api}/${Math.round(Math.random() * 1000)}`
                );
                const buffer = new Buffer.from(response.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
        } catch (error) {
            console.error("Error fetching avatars:", error);
            toast.error("Failed to load avatars. Please try again.", toastOptions);
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchAvatars();
    }, [fetchAvatars]); // fetch avatars only once on page load

    const setProfilePicture = async () => {
        const userData = localStorage.getItem("chat-app user");

        if (!userData) {
            toast.error("User not logged in. Please log in to continue.", toastOptions);
            navigate("/login", { replace: true });
            return;
        }

        const user = JSON.parse(userData);

        if (!user || !user._id) {
            toast.error("Invalid user data. Please log in again.", toastOptions);
            navigate("/login", { replace: true });
            return;
        }

        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar!", toastOptions);
            return;
        }

        try {
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                navigate("/", { replace: true }); // Navigate to chat only after setting the avatar
            } else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        } catch (error) {
            console.error("Error setting profile picture:", error);
            toast.error("Something went wrong. Please try again later.", toastOptions);
        }
    };

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`avatar ${
                                        selectedAvatar === index ? "selected" : ""
                                    }`}
                                    onClick={() => setSelectedAvatar(index)} // Handle avatar selection
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={setProfilePicture} className="submit-btn">
                        Set as Profile Picture
                    </button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
}
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader {
        max-inline-size: 100%;
    }

    .title-container {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;

            img {
                height: 6rem;
            }

            &.selected {
                border: 0.4rem solid #4e0eff;
            }
        }
    }

    .submit-btn {
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;

        &:hover {
            background-color: #4e0eff;
        }
    }
`;

export default SetAvatar;

