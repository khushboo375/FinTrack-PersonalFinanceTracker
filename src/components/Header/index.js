// import React, { useEffect } from 'react';
// import {auth} from "../../firebase";
// import { useAuthState } from 'react-firebase-hooks/auth';
// import "./styles.css";
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { signOut } from "firebase/auth";
// import userImg from "../../assets/userImg.png"

// function Header() {
//   const [user, loading] = useAuthState(auth);
//   const navigate= useNavigate();

//   useEffect(() => {
//     if (user){
//       navigate("/dashboard");
//     }
//   }, [user, loading]);

//   function logoutFnc() {
//     try{
//       signOut(auth).then(() => {
//         toast.success("Logged Out Successfully!");
//         navigate("/");
//         // Sign-out successful.
//       }).catch((error) => {
//         // An error happened.
//         toast.error(error.message);
//       });
//     }catch (e){
//       toast.error(e.message);
//     }
//     alert("LogOut!");
//   }

//   return (
//     <div className="dashboard-header-container">
//       <header className="dashboard-header">
//         <div className="logo">💰 FinTrack</div>
//         <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
//         {user && (
//           <>
//             <img
//               src={userImg}
//               alt="profile"
//               style={{ borderRadius: "50%", height: "2rem", width: "2rem" }}
//             />
//             <nav className="nav-links">
//               <button className="logout-btn" onClick={logoutFnc}>Logout</button>
//             </nav>
//           </>
//         )}
//       </div>
//       </header>
      
//     </div>
//   );
// }

// export default Header;
import React, { useEffect } from 'react';
import { auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import "./styles.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import userImg from "../../assets/userImg.png";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     navigate("/dashboard");
  //   }
  // }, [user, loading, navigate]);
  useEffect(() => {
  // if (!loading) {
  //   if (!user) {
  //     // If no user → go to signup
  //     navigate("/signup");
  //   }
  //   // else let them stay wherever they are (dashboard, reports, etc.)
  // }
}, [user, loading, navigate]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="header-container">
      <header className="header">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-fin">Fin</span>
          <span className="logo-track">Track</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          {user ? (
            <>
              <a onClick={() => navigate("/dashboard")}>Dashboard</a>
              <a onClick={() => navigate("/transactions")}>Transactions</a>
              <a onClick={() => navigate("/reports")}>Reports</a>
              <a onClick={() => navigate("/budget")}>Budget</a>
              <a onClick={() => navigate("/goals")}>Goals</a>
            </>
          ) : (
            <>
              <a href="/">Home</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#about">About</a>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="header-actions">
          {user ? (
            <>
              <img src={userImg} alt="profile" className="profile-img" />
              <button className="logout-btn" onClick={logoutFnc}>
                Logout
              </button>
            </>
          ) : (
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
