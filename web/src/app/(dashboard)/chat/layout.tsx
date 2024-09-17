import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const chats = [
    {
        id: 1,
        title: "Sample Chat",
    },
    {
        id: 2,
        title: "Sample Chat",
    },
]

export default async function Chatlayout ({children} : {children : React.ReactNode}) {
    return (
        <div className="flex h-screen w-screen bg-primary">
            <nav className="w-1/5 bg-[#212121]  shadow-md overflow-y-auto">
                <div className="sticky top-0  z-10 border-b border-gray-200">
                    <h1 className="font-bold text-2xl p-6">Chat History</h1>
                </div>
                <ul className="p-4 space-y-2">
                    {chats.map((chat) => (
                        <li key={chat.id}>
                            <Link href={`/chat/${chat.id}`}>
                                <Card className="hover:bg-gray-500 transition duration-150 ease-in-out">
                                    <CardContent className="p-4">
                                        <span className="">{chat.title}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-1 overflow-y-auto ">
                {children}
            </main>
        </div>
    )
}