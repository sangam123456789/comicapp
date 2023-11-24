import React, { useState } from "react";

async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        Accept: "image/png",
        Authorization: "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return URL.createObjectURL(result);
}

function ComicPanelForm() {
  const initialPanelData = Array(10).fill({ text: "", imageSrc: null, isLoading: false });
  const [panelData, setPanelData] = useState(initialPanelData);

  const handleInputChange = (index, value) => {
    setPanelData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], text: value };
      return newData;
    });
  };

  const handleSubmit = async (index) => {
    try {
      setPanelData((prevData) => {
        const newData = [...prevData];
        newData[index] = { ...newData[index], isLoading: true };
        return newData;
      });

      const data = { inputs: panelData[index].text };
      const imageSrc = await query(data);

      setPanelData((prevData) => {
        const newData = [...prevData];
        newData[index] = { ...newData[index], imageSrc };
        return newData;
      });
    } catch (error) {
      console.error(`Error fetching image for Panel ${index + 1}:`, error);
    } finally {
      // Set isLoading to false regardless of success or error
      setPanelData((prevData) => {
        const newData = [...prevData];
        newData[index] = { ...newData[index], isLoading: false };
        return newData;
      });
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: "30px", textAlign: "center" }}>Comic Panel Input</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        {panelData.map((panel, index) => (
          <div key={index} style={{  marginBottom: "30px", width: "48%" }}>
            
            <div style={{marginLeft: "30px", width: "50%"}}>
                <input
                type="text"
                id={`panelText${index + 1}`}
                className="form-control"
                placeholder={`Enter image name`}
                value={panel.text}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{marginRight: "20px" }}
                />
            </div>
            <div style={{width: "30%", margin: "-40px 0px 0px 389px"}}>
                <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmit(index)}
                >
                Submit Panel {index + 1}
                </button>
            </div>
            {panel.isLoading && <p>Loading...</p>}
            <div style={{
                    marginTop: "20px", 
                    marginLeft: "30px",  
                    maxWidth: "80%",
                    border: "1px solid black", 
                }}>
                {panel.imageSrc && (
                <img
                    src={panel.imageSrc}
                    alt={`Generated Image for Panel ${index + 1}`}
                    style={{padding: "0px"}}
                />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComicPanelForm;
