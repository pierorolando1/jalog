import { createUser, db } from "@/config/firebase.config"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { redirect } from "react-router-dom"

const SignUpPage = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [name, setname] = useState("")
  const [dni, setdni] = useState("")


  const createUserInDB = async () => { 
    await setDoc(doc(db, "users", dni), {
      name,
      email,
      dni
    })
  }


  const signUp = async () => {
    try {
      const user = await createUser(email, password)
      console.log(user)
      redirect('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="max-w-lg mx-auto p-5 h-screen flex flex-col justify-center items-center">
      <Input 
        onChange={(v) => setemail(v.target.value)} 
        className="my-2"  type="email" label="Email" placeholder="Enter your email" />
      <Input 
        onChange={(v) => setpassword(v.target.value)}
        className="my-2" type="password" label="Password" placeholder="Enter your password" />
      <Button color="primary" className="w-full py-[1.4rem] my-5" onClick={signUp}>Sign up</Button>
    </section>
  )
}

export default SignUpPage
