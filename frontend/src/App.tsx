import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import { ProfilePage } from "./pages/profile";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<SignInPage />} path="/signin" />
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<ProfilePage />} path="/profile" />
    </Routes>
  );
}

export default App;
