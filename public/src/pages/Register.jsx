/* eslint-disable no-undef */
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Link,useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo.png";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"
import {registerRoute} from "../utils/APIRoutes.js";



function Register() {
    const navigate = useNavigate()
    const[values,setValues] = useState({
        username : "",
        email : "",
        password : "",
        confirmpassword : ""
    });
    const  handleSubmit = async(event)=>{
        event.preventDefault();
        if(handleValidations()){
            const{password, username, email,confirmpassword} = values;
            try { 
                
                const {data} = await axios.post(registerRoute,{
                username,email,password,confirmpassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }});
            if(data.status===false){
               toast.error(data.message,toastOptions) 
            }
            if(data.status===true){
                localStorage.setItem('chat-app-user',JSON.stringify(data.user))
                navigate("/login")
            }
        }
        catch (error) {
            if (error.response && error.response.status === 409) {
                // Display the specific error message for duplicate data
                toast.error(error.response.data.message, toastOptions);
              } else {
                // Generic error for other cases
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
                navigate('/')
            }
        },[navigate])
    const handleValidations = () =>{
        const{password, confirmpassword, username, email} = values;
        
        if(password!== confirmpassword){
         toast.error("Password and Confirm Password should be same.",toastOptions);
         return false;
        }
        if(username.length < 3){
            toast.error("Username should be greater than 3 characters",toastOptions);
        return false;
        }
        if(password.length < 8){
            toast.error("Password should be equal or greater than 8 characters",toastOptions);
            return false;
        }
       
        if(email===""){
            toast.error("Email is required",toastOptions);
            return false;
         }
       return true;
    }
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
                type="email" 
                placeholder="Email" 
                name="email"
                onChange={(e)=> handleChange(e)}  
            />
             <input 
                type="password" 
                placeholder="Password" 
                name="password"
                onChange={(e)=> handleChange(e)}  
            />
             <input 
                type="password" 
                placeholder="Confirm Password" 
                name="confirmpassword"
                onChange={(e)=> handleChange(e)}  
            />
            <button type='submit'>Create User</button>
            <span>Already have any account? <Link to="/login">Login</Link> </span>
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
                border:0.1rem solid  #4DA1A9;
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

export default Register
