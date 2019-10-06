import React from "react";
import FormBody from "./FormBody.tsx";

import socket_io from "socket.io-client";


type Props = {};
type State = {waiting: boolean; experimenting: boolean };
class Dashboard extends React.Component<Props, State> {
  state: State;
  form: any;
  waitingMessage: any;
  callbackId: Timeout;

  constructor(props) {
    super(props);
    this.waitingMessage = (<p>Waiting. . .</p>);
    this.state = {waiting: true, experimenting: false};
    this.form = "Empty form";

    this.socket = socket_io("/proctors");

    this.socket.on("form", form => {
      console.log("Got a form");
      this.setState( (prev) => {
        this.form = form;
        return {waiting: false};
      });
    });

  }
  render() {
    if (!this.state.experimenting)
      return (
        <div>
          <button onClick={() => this.startExperiment()}>Start</button>
        </div>
      );

    return (
      <div>
        {this.renderForm()}
        <button onClick={() => this.endExperiment()}>End</button>
      </div>
    );
  }

  renderForm() {
    if (this.state.waiting) return (<div>{this.waitingMessage}</div>);

    const formBody = FormBody(this.form);
    return (
      <form id="dataForm" action="">
       {formBody.length ? formBody : (<p>No form for this trial</p>)} 
       <input type="button" value="Submit" onClick={() => this.onSubmit()}/>
      </form>
    );
  }

  onSubmit() {
    const formElement = document.forms.dataForm;
    const formData = new FormData(formElement);
    const json = toJSON(formData);
    const body = JSON.stringify(json);

    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body
    }).then(res => {});

    this.setState( (prev) => {
      return {waiting: true};
    });
  }

  
  startExperiment() {
    fetch("/api/start", {method: "POST"}).then( (res) => {});

    this.setState( (prev) => {
      return {experimenting: true};
    });
  }
  endExperiment() {
    this.form = null;
    this.setState( prev => {
      return {experimenting: false, waiting: true};
    });
    fetch("/api/end", {method: "POST"}).then( (res) => {});
  }

}

function toJSON(formData: FormData) {
    let data = {};
    formData.forEach( (value, key) => {
      if (!data.hasOwnProperty(key)) data[key] = value;
      else {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      }
    });
    return data;
}

export default Dashboard;