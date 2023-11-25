import "./App.css";
import Navbar from "./components/Navbar";
import Form from "./components/Form";

function App() {
  return (
    <div
      className="App"
      style={{ backgroundColor: "#222121", minHeight: "700px" }}
    >
      <Navbar />
      <Form />
    </div>
  );
}

export default App;
