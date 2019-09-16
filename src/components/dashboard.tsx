import React from "react";

const simpleButton = (label, endpoint) => {
  function onClick() {
    fetch(endpoint).then(res => {
      
    });
  }
  return (
    <button onClick={onClick}>{label}</button>
  );
}


type Props = {};
type State = {message: string; }
class Dashboard extends React.Component<Props, State> {
  state: State;

  constructor(props) {
    super(props);
    this.state = {message: ""};
  }

  render() {
    return (

      <div>
        <p>Welcome to the dashboard!</p>

        <div>
          {simpleButton("Start", "/api/start")}
          {simpleButton("End", "/api/end")}
          {simpleButton("Next", "/api/next")}
        </div>
      </div>
    );
  }

}

export default Dashboard;