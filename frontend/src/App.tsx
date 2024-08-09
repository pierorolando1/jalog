import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import SignInPage from "./pages/auth/signin";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<SignInPage />} path="/signin" />
    </Routes>
  );
}

export default App;
