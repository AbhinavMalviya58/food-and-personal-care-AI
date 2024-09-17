import MarkdownContent from "@/components/ui/markdown-content"

export const AiChat = ({content} : {content : string}) => {
    return (
        <div className="max-w-[70%] border border-green-900  bg-stone-700 rounded-lg text-lg text-left">
        <MarkdownContent
          markdown={content}
        />
      </div>
    )
}