import { ChatHistoryPart } from "@/lib/types/chat";
import Image from "next/image";

export const UserChat = ({
  parts,
}: {
  parts: ChatHistoryPart[],
}) => {
  return (
    <div className="max-w-[80%] bg-gray-1 border rounded-lg">
      {
        parts.map((part, index) => {
          if (part.fileData) {
            return (
              <Image
                className="rounded-lg w-[360px]"
                src={part.fileData.fileUri}
                alt="User"
                width={360}
                height={360}
              />
            )
          }

          if (part.text && part.text !== "") {
            return (
              <div className="p-4">
                <span key={index} className="text-white text-lg">{part.text}</span>
              </div>
            );
          }

          return null;
        })
      }
    </div>
  )
}