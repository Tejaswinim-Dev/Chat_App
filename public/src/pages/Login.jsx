/* eslint-disable no-undef */
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Link,useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo.png";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"
import {loginRoute} from "../utils/APIRoutes.js"


function Login() {
    const navigate = useNavigate()
    const[values,setValues] = useState({
        username : "",
        password : "",
    });
    const  handleSubmit = async(event)=>{
        event.preventDefault();
        if(handleValidations()){
            const{password, username} = values;
            try { 
              
                const {data} = await axios.post(loginRoute,{
                username,password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }});
        
            if(!data.status){
               toast.error(data.msg,toastOptions) 

            }
            else{
                localStorage.setItem('chat-app-user',JSON.stringify(data.user))
                navigate("/")
            }
        }
        catch (error) {
          if (error.response && error.response.data===409) {
            toast.error(error.response.data.msg, toastOptions); // Use the backend-provided message
          } else {
            // Generic fallback for other errors
            toast.error("Something went wrong. Please try again later.", toastOptions);
          }
        }
        
        }

    };   
    const toastOptions = {
        position:"bottom-right",
        autoClose:5000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark",
    } 
    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
            navigate('/setAvatar')
        }
    },[navigate])
    const handleValidations = () => {
      const { username, password } = values;
      if (!username || !password) {
        toast.error("Username and Password are required", toastOptions);
        return false;
    }
      return true;
    };
    const handleChange = (e)=>{
        setValues({...values,[e.target.name]:e.target.value})

    };
  return (
    <>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className='brand'>
                <img src={Logo} alt="" />
                <h1>ChatNest</h1>
            </div>
            <input 
                type="text" 
                placeholder="Username" 
                name="username"
                onChange={(e)=> handleChange(e)}  
            />
             <input 
                type="password" 
                placeholder="Password" 
                name="password"
                onChange={(e)=> handleChange(e)}  
            />
            <button type='submit'>Login</button>
            <span>Don't have an Account <Link to="/register">Register</Link> </span>
        </form>
    </FormContainer>
    <ToastContainer/>
   </>
  )
}

const FormContainer = styled.div`
    height:100vh;
    width: 100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:1rem;
    align-items:center;
    background-color: #131324;
    .brand{
        display:flex;
        justify-content:flex-start;
        align-items:center;
        img{
            height:4rem;
            
        }
        h1{
        color:white;
        text-transform:uppercase;
        
        }
    }
    form{
        display:flex;
        flex-direction:column;
        gap:2rem;
        background-color: #00000076;
        border-radius:2rem;
        padding: 3rem 5rem;
        input{
            background-color:transparent;
            padding:1rem;
            border: 0.1rem solid  #0A5EB0;
            border-radius:0.4rem;
            color:white;
            width:100%;
            font-size:1rem;
            &:focus{
                border:0.1rem solid #4DA1A9;
                outline:none
            }
        }
            button{
                background-color:#A294F9;
                color:white;
                padding:1rem 2rem;
                border:none;
                font-weight:bold;
                cursor:pointer;
                border-radius:0.4rem;
                font-size:1rem;
                text-transform:uppercase;
                transition:0.5s ease-in-out
                &:hover{
                    background:#4e0eff;
                }
        }
    span{
        color:white;
        text-transform:uppercase;
        a{
            color:#4e0eff;
            font-weight:bold;
            text-decoration:none;
        } 
    }
    }
`;

export default Login

