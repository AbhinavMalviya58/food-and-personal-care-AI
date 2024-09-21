import { AiChatImage } from "@/components/ui/aiAvatar"
import MarkdownContent from "@/components/ui/markdown-content"
import { ChatHistoryPart } from "@/lib/types/chat"

export const AiChat = ({
  parts,
}: {
  parts: ChatHistoryPart[],
}) => {
  return (
    <div className="max-w-[75%] rounded-lg text-lg text-left flex">
      <div className="flex-shrink-0 self-start pt-8">
        <AiChatImage />
      </div>
      <div className="flex-grow">
        <MarkdownContent
          markdown={parts.map((part) => part.text).join("\n")}
        />
      </div>
    </div>
  )
}