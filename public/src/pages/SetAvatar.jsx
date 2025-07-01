import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";

function SetAvatar() {
  const style = "adventurer"; // Dicebear avatar style
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvatarSet, setIsAvatarSet] = useState(false);

  const toastOptions = useMemo(() => ({
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }), []);

  // Redirect if avatar is already set
  useEffect(() => {
    const userData = sessionStorage.getItem("chat-app-user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isAvatarImageSet) {
        navigate("/chat", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Convert SVG URL to base64
  const convertSvgUrlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Fetch avatar URLs
  const fetchAvatars = useCallback(async () => {
    try {
      const genders = ["male", "male", "female", "female"];
      const avatarUrls = genders.map((gender) => {
        const seed = Math.random().toString(36).substring(2, 10);
        return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&gender=${gender}`;
      });

      setAvatars(avatarUrls);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      toast.error("Failed to load avatars. Please try again.", toastOptions);
    }
  }, [style, toastOptions]);

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  useEffect(() => {
    if (isAvatarSet) {
      toast.success("Profile picture set successfully! Redirecting...", toastOptions);
      setTimeout(() => navigate("/chat", { replace: true }), 2000);
    }
  }, [isAvatarSet, navigate, toastOptions]);

  const setProfilePicture = async () => {
    if (isSubmitting || selectedAvatar === undefined) {
      toast.error("Please select an avatar!", toastOptions);
      return;
    }

    setIsSubmitting(true);

    const userData = sessionStorage.getItem("chat-app-user");
    if (!userData) {
      toast.error("User not logged in. Please log in.", toastOptions);
      navigate("/login", { replace: true });
      return;
    }

    const user = JSON.parse(userData);

    try {
      const base64Image = await convertSvgUrlToBase64(avatars[selectedAvatar]);

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: base64Image,
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImg = data.image;
        sessionStorage.setItem("chat-app-user", JSON.stringify(user));
        setIsAvatarSet(true);
      } else {
        toast.error("Failed to set avatar. Try again.", toastOptions);
      }
    } catch (error) {
      console.error("Avatar error:", error);
      toast.error("Something went wrong. Try later.", toastOptions);
    } finally {
      setIsSubmitting(false);
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
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={avatar} alt={`avatar-${index}`} />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Setting Profile..." : "Set as Profile Picture"}
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

    &:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
  }
`;

export default SetAvatar;



