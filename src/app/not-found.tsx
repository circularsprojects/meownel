import Navlink from "@/components/navlink"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-dvh w-dvw">
      <h1 className="text-2xl font-bold">404 | The requested resource could not be found.</h1>
      <Navlink href="/" title="Return home.." />
    </div>
  )
}