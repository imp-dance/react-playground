import React, { useEffect } from "react";

declare global {
  interface Window {
    Prism: any;
  }
}

window.Prism = window.Prism || {};

interface IDisplayData {
  data: any;
  language?: string;
}

const DisplayData: React.FC<IDisplayData> = ({ data, language = "js" }) => {
  useEffect(() => {
    window.Prism.highlightAll();
  }, [language, data]);
  return (
    <pre style={{ maxWidth: "100%", overflow: "auto" }}>
      <code className={`language-${language}`}>
        {JSON.stringify(data, null, 2)}
      </code>
    </pre>
  );
};

export default DisplayData;
