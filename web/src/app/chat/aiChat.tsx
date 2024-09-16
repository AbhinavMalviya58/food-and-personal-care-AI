import MarkdownContent from "@/components/ui/markdown-content"

export const AiChat = ({content} : {content : string}) => {
    return (
        <div className="max-w-[80%] p-4 bg-stone-700 rounded-lg text-lg text-left border">
        <MarkdownContent
          markdown={content}
        />
      </div>
    )
}