import { AiChatImage } from "@/components/ui/aiAvatar"
import MarkdownContent from "@/components/ui/markdown-content"

export const AiChat = ({content} : {content : string}) => {
    return (
        <div className="max-w-[75%] rounded-lg text-lg text-left flex">
            <div className="flex-shrink-0 mr-3 self-start pt-1">
                <AiChatImage />
            </div>
            <div className="flex-grow">
                <MarkdownContent
                    markdown={content}
                />
            </div>
        </div>
    )
}