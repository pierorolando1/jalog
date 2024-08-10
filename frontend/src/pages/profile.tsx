import ProtectedLayout from "@/layouts/protected"
import { useUser } from "@/stores/stores"

export const ProfilePage = () => {

  const { user } = useUser()

  return (
    <ProtectedLayout>
        <div className="bg-red-500 max-w-5xl mx-auto">
            <h1 className="text-6xl font-bold">Hello { user?.name }</h1>

        </div>
    </ProtectedLayout>
  )
}
