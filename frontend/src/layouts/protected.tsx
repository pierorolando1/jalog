import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/pages/loading";
import { Navigate } from "react-router-dom";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [authState, setauthState] = useState({
    loading: true,
    auth: false
  })

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {

      await delay(1000)

      if(user) {
        setauthState({ loading: false, auth: true })
      } else {
        setauthState({ loading: false, auth: false })
      }
    })
  },[])


  return authState.loading ? <LoadingPage /> : !authState.auth ? <Navigate to="/signup" /> : (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">pierorolando1</p>
          <p className="text-primary">ChristoferNVR2</p>
        </Link>
      </footer>
    </div>
  );
}
