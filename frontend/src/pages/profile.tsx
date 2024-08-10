import { apiUrl } from "@/config/site"
import ProtectedLayout from "@/layouts/protected"
import { useUser } from "@/stores/stores"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react"

export const ProfilePage = () => {

  const { user } = useUser()

  const [history, sethistory] = useState<{isLoading: boolean, data: boolean | null}>({
    isLoading: false,
    data: null
  })


  const reqHistory = async (dni: string) => {

    console.log("hola")
    sethistory({
      ...history,
      isLoading: true
    })

    try {
      const res = await fetch(apiUrl + 'api/evaluateLoan?dni=' + dni)
      const data = await res.json()
      sethistory({
        ...history,
        data: data.viabilidad == "no_viable" ? false : true
      })
    } catch (error) {
      console.error(error)
    }   
  }
  return (
    <ProtectedLayout>
        <div className=" p-10 max-w-xl mx-auto">
            <h1 className="text-5xl font-bold ">Hola, { user?.name }</h1>
            <Input label="Email" className="my-5" disabled placeholder={user?.email} />
            <Input label="DNI" className="my-5" disabled placeholder={user?.dni} />
            <Input label="Nombre" className="my-5" disabled placeholder={user?.name} />

            <Button 
            onClick={() => reqHistory(user!.dni)}
            isLoading={history.isLoading} className="py-2 w-full" color="primary" >Ver mi historial crediticio</Button>

            {
              !history.isLoading && history.data != null && (
                history.data ?
                <Button variant="light" color="success" className="w-full mt-5">Su historial crediticio es favorable</Button>
                :
                <Button disabled variant="light" color="danger" className="w-full mt-5">Su historial crediticio NO es favorable</Button>
              )
            }


        </div>
    </ProtectedLayout>
  )
}
