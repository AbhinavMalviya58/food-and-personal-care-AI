export const UserChat = ({content} : {content : string}) => {
    return (
        <div className="max-w-[80%] p-4 bg-stone-700 border rounded-lg bg-gray-2">
                        <span className="text-white text-lg">{content}</span>
                      </div>
    )
}