import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/Home" exact component={Home} />
          <Route path="/" exact component={Login} />
          <Route path="/Signup" exact component={Signup} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
