import { loginUser } from "@/config/firebase.config"
import PublicLayout from "@/layouts/public"
import { useModal } from "@/stores/stores"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignInPage = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const { open, close } = useModal()

  const navigate = useNavigate()

  const signIn = async () => {
    open()

    try {
      const user = await loginUser(email, password)
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

      <Button color="primary" className="w-full py-[1.4rem] my-5" onClick={signIn}>Sign in</Button>
      <Button variant="flat" color="primary" className="w-full py-[1.4rem] my-5" onClick={() => { navigate('/signup') }}>No account?</Button>
    </section>
    </PublicLayout>
  )
}

export default SignInPage
