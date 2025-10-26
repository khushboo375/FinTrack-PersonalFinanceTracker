import React, { useState } from 'react';
import './styles.css';
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] =useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  

  function signupwithEmail(){
    setLoading(true);
    console.log("Name" , name);
    console.log("email" , email);
    console.log("password" , password);
    console.log("confirmPassword" , confirmPassword);

    if(name!="" && email!="" && password!="" && confirmPassword!=""){
      if(password == confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User>>>", user);
          toast.success("User Created");
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          createDoc(user);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
          // ..
        }); 
      }else{ 
        toast.error("Password and Confirm Password don't match");
        setLoading(false);
      }
    }else{
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }
  function loginUsingEmail(){
    console.log("Email", email);
    console.log("Password", password);
    setLoading(true);
    if(email != "" && password !=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged In Successfully!");
        console.log("User Logged In", user);
        setLoading(false);
        navigate("/dashboard");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      });
    }else{
      toast.error("All fields are Mandatory");
      setLoading(false);
    }
  }

  async function createDoc(user){
    setLoading(true);
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid), {
        name: user.displayName ? user.displayName : "",
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
      });
    toast.success("Doc Created");
    setLoading(false);
    }catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
    }else{
      //toast.error("Doc Already Exists");
      setLoading(false);
    }
  }

  function googleAuth(){
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user>>>",user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User Auntheticated!");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
    }catch (e){
      setLoading(false);
      toast.error(e.message);
    }
  }

    return (
    <>
      {loginForm ? (
        <div className="auth-page">
          <div className="auth-card">
            <h2 className="form-title">
              Log in on <span className="highlight">FinTrack</span>
            </h2>
            <form>
              <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"Johndoe@gmail.com"}
              />
              <Input
                type="password"
                label={"Password"}
                state={password}
                setState={setPassword}
                placeholder={"Example@123"}
              />
              <Button
                disabled={loading}
                text={loading ? "loading..." : "Log In using Email and Password"}
                onClick={loginUsingEmail}
              />
              <div className="separator">or</div>
              <Button
                onClick={googleAuth}
                text={loading ? "loading..." : "Log In using Google"}
                black={true}
              />
              <div
                className="switch-link"
                onClick={() => setLoginForm(!loginForm)}
              >
                Don’t have an Account? Click Here
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="auth-page">
          <div className="auth-card">
            <h2 className="form-title">
              Sign Up on <span className="highlight">FinTrack</span>
            </h2>
            <form>
              <Input
                label={"Full Name"}
                state={name}
                setState={setName}
                placeholder={"John Doe"}
              />
              <Input
                type="email"
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"Johndoe@gmail.com"}
              />
              <Input
                type="password"
                label={"Password"}
                state={password}
                setState={setPassword}
                placeholder={"Example@123"}
              />
              <Input
                type="password"
                label={"Confirm Password"}
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder={"Example@123"}
              />
              <Button
                disabled={loading}
                text={loading ? "loading..." : "Sign Up using Email"}
                onClick={signupwithEmail}
              />
              <div className="separator">or</div>
              <Button
                onClick={googleAuth}
                text={loading ? "loading..." : "Sign Up using Google"}
                black={true}
              />
              <div
                className="switch-link"
                onClick={() => setLoginForm(!loginForm)}
              >
                Already have an Account? Click Here
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;

