// import './App.css';
// import Header from "./components/Header"
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Signup from "./pages/signup";
// import MainPage from "./pages/MainPage";
// import Dashboard from './pages/Dashboard';
// import SignupSignin from './components/SignupSignin';
// import Reports from './pages/Reports';
// import { ToastContainer, toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";

// function App() {
//   return (
//     <>
//     <ToastContainer/>
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainPage />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/reports" element={<Reports />} />
//       </Routes>
//     </Router>
//     </>
//   );
// }

// export default App;
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import Signup from "./pages/signup";
import MainPage from "./pages/MainPage";
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Transactions from "./pages/Transactions";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Main page is always accessible */}
          <Route path="/" element={<MainPage />} />

          {/* Signup page is only for logged out users */}
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/signup" />}
          />
          <Route
            path="/reports"
            element={user ? <Reports /> : <Navigate to="/signup" />}
          />
          <Route
            path="/transactions"
            element={user ? <Transactions /> : <Navigate to="/signup" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
