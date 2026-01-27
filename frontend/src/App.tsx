import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AuthorizedNavbar from "./layouts/AuthorizedNavbar";
import AuthorizedFooter from "./layouts/AuthorizedFooter";

import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import InsightsPage from "./pages/InsightsPage";
import SolutionsPage from "./pages/SolutionsPage";
import UserManual from "./layouts/UserManual";

// ✅ Public Layout (Standard Navbar + Footer)
const PublicLayout = () => (
  <div className="bg-[#0D0E0E] min-h-screen flex flex-col font-work">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ✅ Authorized Layout (Dashboard Navbar + Footer)
const AuthorizedLayout = () => (
  <div className="bg-[#0D0E0E] min-h-screen flex flex-col font-work">
    <AuthorizedNavbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <AuthorizedFooter />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* --- Private/Authorized Routes --- */}
        <Route element={<AuthorizedLayout />}>
          <Route path="/user-manual" element={<UserManual />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;