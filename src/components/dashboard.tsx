import React from "react";
import FormBody from "./FormBody.tsx";

import socket_io from "socket.io-client";


type Props = {};
type State = {waiting: boolean; experimenting: boolean, forms: Array<object> };
class Dashboard extends React.Component<Props, State> {
  state: State;
  form: any;
  socket: any;
  waitingMessage: any;
  callbackId: Timeout;

  constructor(props) {
    super(props);
    this.waitingMessage = (<p>Waiting. . .</p>);

    this.socket = socket_io("/proctors");

    this.state = {forms: [], waiting: true, experimenting: false};
    this.nextId = 0;
    this.formIds = [];

    this.socket.on("form", form => {
      this.setState( (prev) => {
        this.formIds.push(this.nextId++);
        return {
          waiting: false,
          forms: [...this.state.forms, form]
        };
      });
    });

    this.socket.on("end", () => {
      if (this.state.forms.length > 0) return;

      this.nextId = 0;
      this.setState(prev => {
        return {
          waiting: true, experimenting: false
        };
      });
    });

    this.keyCallback = (event) => {this.onKeydown(event)};
    document.addEventListener("keydown",this.keyCallback);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyCallback);
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
        {this.state.waiting ? (<div>{this.waitingMessage}</div>) : this.renderForms()}
        <button onClick={() => {this.socket.emit("end") } }>End</button>
      </div>
    );
  }

  renderForms() {
    const forms = this.state.forms.map((form,i) => this.renderForm(FormBody(form), this.formIds[i]));
    return (<div>{forms}</div>);
  }

  renderForm(formBody, id) {
    return (
      <form id={id} action="">
       {formBody.length ? formBody : (<p>No form for this trial</p>)} 
       <input type="button" value="Submit" onClick={() => this.onSubmit(id)}/>
       <input type="button" value="Skip" onClick={() => this.onSkip()}/>
      </form>
    );
  }

  onKeydown(e) {
    if (e.code === "Enter")
      console.log("Someone pressed <Enter>");
  }

  removeForm(id) {
    const formInd = this.formIds.indexOf(id);
    this.formIds.splice(formInd,1);
    this.setState(prev => {
      let forms = this.state.forms.slice();
      forms.splice(formInd,1);
      const waiting = forms.length === 0;
      return {forms,waiting}
    });
  }

  onSkip(id) {
    let submission = {type: "submission", timestamp: Date.now()}
    this.socket.emit("submission", submission);
    this.removeForm(id);
    return false;
  }

  onSubmit(id) {
    const formElement = document.forms[id];
    const formData = new FormData(formElement);
    const submission = {
      ...toJSON(formData),
      type: "submission",
      timestamp: Date.now()
    };
    this.socket.emit("submission", submission);
    this.removeForm(id);
    return false;
  }

  
  startExperiment() {
    this.socket.emit("start");
    this.setState( (prev) => {
      return {experimenting: true};
    });
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