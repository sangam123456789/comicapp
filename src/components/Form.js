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
  return result;
}

function Form() {
  const [textInput, setTextInput] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
    console.log(textInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log input text to the console
    console.log("Input Text:", textInput);

    try {
      setIsLoading(true); // Set loading state to true
      const data = { inputs: textInput };
      const blob = await query(data);
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch is complete
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: "30px", textAlign: "center" }}>Text Input Form</h2>
      <div
        style={{
          marginTop: "70px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
          <div className="form-group">
            <label htmlFor="textInput">Enter Text:</label>
            <input
              type="text"
              id="textInput"
              className="form-control"
              placeholder="Type something..."
              value={textInput}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        {isLoading && <p>Loading...</p>}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Generated Image"
            style={{ marginTop: "20px", marginBottom: "30px", maxWidth: "100%" }}
          />
        )}
      </div>
    </div>
  );
}

export default Form;
