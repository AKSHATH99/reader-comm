// utils/formatContent.ts
import React from 'react';

export function formatBlogContent(content: string) {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("###")) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-4">
            {line.replace("###", "").trim()}
          </h3>
        );
      }
      if (line.startsWith("##")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6">
            {line.replace("##", "").trim()}
          </h2>
        );
      }
      if (line.startsWith("#")) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 text-center">
            {line.replace("#", "").trim()}
          </h1>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="list-disc list-inside">
            {line.replace("- ", "").trim()}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-gray-700 mt-2">
          {line}
        </p>
      );
    });
  }