import { createUser, db } from "@/config/firebase.config"
import PublicLayout from "@/layouts/public"
import { useModal } from "@/stores/stores"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { doc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignUpPage = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [name, setname] = useState("")
  const [dni, setdni] = useState("")

  const { open, close } = useModal()

  const navigate = useNavigate();

  const createUserInDB = async () => { 
    await setDoc(doc(db, "users", dni), {
      name,
      email,
      dni
    })
  }


  const signUp = async () => {
    open()
    try {
      const user = await createUser(email, password)
      await createUserInDB()
      console.log(user)
      navigate('/')
      close()
    } catch (error) {
      console.log(error)
      close()
    }
  }

  return (
    <PublicLayout>
    <section className="max-w-lg mx-auto p-5 h-full flex flex-col justify-center items-center">
      <Input 
        onChange={(v) => setemail(v.target.value)} 
        className="my-2"  type="email" label="Email" placeholder="Enter your email" />
      <Input 
        onChange={(v) => setpassword(v.target.value)}
        className="my-2" type="password" label="Password" placeholder="Enter your password" />
      <Input
        onChange={(v) => setname(v.target.value)}
        className="my-2" type="text" label="Name" placeholder="Enter your name" />
      <Input
        onChange={(v) => setdni(v.target.value)}
        className="my-2" type="text" label="DNI" placeholder="Enter your DNI" />
      <Button color="primary" className="w-full py-[1.4rem] my-5" onClick={signUp}>Sign up</Button>
      <Button variant="flat" color="primary" className="w-full py-[1.4rem] my-5" onClick={() => { navigate('/signin') }}>Alredy account?</Button>
      
    </section>
    </PublicLayout>
  )
}

export default SignUpPage
