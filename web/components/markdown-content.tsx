'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import "./markdown-content.styles.css";

const MarkdownContent = ({
  markdown
}: {
  markdown: any;
}) => {
  console.log("Markdown", markdown);

  return (
    <div className="markdown-container">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
