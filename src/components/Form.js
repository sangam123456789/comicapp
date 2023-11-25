import React, { useState } from "react";
import { Button } from "@mui/material";
import { spiral } from "ldrs";
import { waveform } from "ldrs";
waveform.register();
spiral.register();

async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        Accept: "image/png",
        Authorization:
          "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
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
  const initialPanelData = Array(10).fill({
    text: "",
    imageSrc: null,
    isLoading: false,
  });
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
      <h2
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          textAlign: "center",
          color: "#88cc78",
        }}
      >
        Create Comic
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {panelData.map((panel, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#e4e4e4",
              margin: "0px 0px 20px 40px",
              width: "45%",
              border: "2px solid rgb(59 183 140)",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                margin: "10px 0px 0px 30px",
                width: "50%",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <input
                type="text"
                id={`panelText${index + 1}`}
                className="form-control"
                placeholder={`Enter image name`}
                value={panel.text}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{ marginRight: "20px" }}
              />
            </div>
            <div style={{ width: "20%", margin: "-35px 0px 0px 450px" }}>
              <Button
                type="button"
                // className="btn btn-primary"
                onClick={() => handleSubmit(index)}
                style={{
                  color: "black",
                  backgroundColor: "#309e65",
                  height: "30px",
                  padding: "1rem",
                }}
                variant="contained"
              >
                Comic {index + 1}
              </Button>
            </div>
            <div
              style={{
                height: "30px",
                width: "10%",
                margin: "-26px -138px 1px 321px",
              }}
            >
              {panel.isLoading && <l-waveform size="19"></l-waveform>}
            </div>
            <div
              style={{
                marginTop: "20px",
                marginLeft: "0px",
                maxWidth: "100%",
                border: "1px solid black",
              }}
            >
              {panel.imageSrc && (
                <img
                  src={panel.imageSrc}
                  alt={`Generated Image for Panel ${index + 1}`}
                  style={{ padding: "0px", width: "100%" }}
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
