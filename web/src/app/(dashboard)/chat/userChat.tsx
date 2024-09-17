import Image from "next/image";

export const UserChat = ({content, imageUrl} : {content : string, imageUrl?: string}) => {
    return (
        <div className="max-w-[80%] p-4 bg-stone-700 border rounded-lg bg-gray-2 flex flex-col gap-2">
            {imageUrl && <Image src={imageUrl} alt="User" width={100} height={100} />}
            <span className="text-white text-lg">{content}</span>
        </div>
    )
}