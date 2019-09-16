import React from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import ReactDOM from "react-dom";

import Dashboard from "./components/dashboard.tsx";

const App = () => {
  return (
    <Router>
      <h1>HCI Server</h1>    

      <Route exact path="/" component={Dashboard}/>

    </Router>
  );
};

ReactDOM.render( <App/> , document.getElementById("root") );
