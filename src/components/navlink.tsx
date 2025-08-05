export default function Navlink({ title, href }: { title: string, href: string }) {
    return (
        <a href={href} className="hover:border-b-4 border-pink-500 duration-150 text-lg">{title}</a>
    )
}