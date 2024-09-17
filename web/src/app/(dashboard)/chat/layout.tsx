export default async function Chatlayout ({children} : {children : React.ReactNode}) {
    return (
        <div className="flex">
            <nav className="min-h-screen w-1/5 bg-[#212222] justify-center items-center ">
                <div><h1 className="font-bold text-2xl">Chat History</h1></div>
                <ul className="flex flex-col gap-4 ">
                <li>Sample Chat</li>
                <li>Sample Chat</li>
                <li>Sample Chat</li>
                <li>Sample Chat</li>
                <li>Sample Chat</li>
                </ul>
            </nav>
        {children}
        </div>
    )
}