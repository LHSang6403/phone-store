"use client";

import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import { parseStringToJSONContent } from "@/utils/functions/parseStringToJSONContent";

export default function BlogContent({ blogContent }: { blogContent: string }) {
  const content: JSONContent = parseStringToJSONContent(blogContent);

  return (
    <div className="px-16 xl:px-6 sm:px-2">
      <Editor initialValue={content} onChange={() => {}} isDisable={true} />
    </div>
  );
}
