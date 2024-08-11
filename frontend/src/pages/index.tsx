import ProtectedLayout from "@/layouts/protected";
import { useUser } from "@/stores/stores";

export default function IndexPage() {

  const { user } = useUser()

  return (
    <ProtectedLayout>
      <section className="flex flex-col justify-center gap-4 py-8">
      <h1 className="font-black text-3xl" >Welcome home { user?.name}</h1>
        

      </section>
    </ProtectedLayout>
  );
}
