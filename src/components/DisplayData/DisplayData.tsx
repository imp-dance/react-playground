import React from "react";

interface IDisplayData{
    data: any;
}

const DisplayData: React.FC<IDisplayData> = ({ data }) => {
    return (
        <pre style={{maxWidth: "100%", overflow: "auto"}}>
            <code>
                {JSON.stringify(data, null, 2)}
            </code>
        </pre>
    );
}

export default DisplayData;