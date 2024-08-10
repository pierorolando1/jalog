import { Link } from "@nextui-org/link";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/config/firebase.config";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/pages/loading";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { useUser } from "@/stores/stores";
import { collection, getDocs, query, where } from "firebase/firestore";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const navigate = useNavigate()

  const [authState, setauthState] = useState({
    loading: true,
    auth: false
  })

  const { setUser } = useUser()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {

      await delay(1000)

      if(user) {
        const q = query(collection(db, "users"), where("email", "==", user?.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log("No matching documents.");
        }
        const docId = querySnapshot.docs[0].id;      
        console.log("Document ID:", docId);
        console.log("Document data:", querySnapshot.docs[0].data());

        setUser({
          email: user.email!,
          name: querySnapshot.docs[0].data().name,
          dni: docId
        })
        setauthState({ loading: false, auth: true })
      } else {
        setauthState({ loading: false, auth: false })
      }
    })
  },[])


  return authState.loading ? <LoadingPage /> : !authState.auth ? <Navigate to="/signup" /> : (
    <div className="relative flex h-screen items-center justify-center px-24">
      
      <div className="h-screen max-w-xs w-full flex flex-col p-4 py-12 justify-between">

        <div>
          <p className="font-bold">Credit system</p>
        </div>

        <div>
          <Button onClick={() => navigate("/")} color="primary" variant="flat" className="w-full py-3">
            Dashboard
          </Button>
          <div className="h-2"></div>
          <Button onClick={() => navigate("/profile")} color="primary" variant="flat" className="w-full py-3">Profile</Button>
        </div>

        <Button 
        onClick={() => {
          signOut(auth)
          navigate('/signin')
        }}
        color="danger" variant="light" className="w-full py-3">Sign out</Button>

      </div>

      <main className="h-screen w-full mx-auto px-6 flex-grow pt-16 overflow-scroll">
        {children}
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
      </main>
    </div>
  );
}
