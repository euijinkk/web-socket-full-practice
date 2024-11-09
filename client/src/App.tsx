import reactLogo from "./assets/react.svg";
import "./App.css";
import ChatSection from "./chat/ChatSection";

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>SisypheTalk</h1>
      <div className="card">
        <ChatSection />
      </div>
    </>
  );
}

export default App;
