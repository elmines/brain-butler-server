import React from "react";
import FormBody from "./FormBody.tsx";


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

    return (
      <form id="dataForm" action="">
       {FormBody(this.form)} 
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

    this.startPolling();
    this.setState( (prev) => {
      return {waiting: true};
    });
  }

  
  startExperiment() {
    this.setState( (prev) => {
      this.startPolling();
      return {experimenting: true};
    });
  }
  endExperiment() {
    this.stopPolling();
    this.setState( prev => {
      return {experimenting: false};
    });
  }

  startPolling() {
    this.callbackId = setInterval(() => this.pollServer(), 500);
  }
  stopPolling() {
    if (this.callbackId) {
      clearInterval(this.callbackId);
      this.callbackId = null;
    }
  }
  receiveForm(form) {
    this.stopPolling();
    this.setState( (prev) => {
      this.form = form;
      return {waiting: false};
    });
  }

  async pollServer() {
    console.log("Polling...");
    const response = await fetch("/api/form");
    const form = await response.json();
    if (form.fields) this.receiveForm(form);
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