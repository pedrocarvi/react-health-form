import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./components/Form/Form";
import SocialInfo from "./components/Social-Info/SocialInfo";

function App() {
  return (
    <div className="App app-container">
      <SocialInfo />
      <Form />
    </div>
  );
}

export default App;
