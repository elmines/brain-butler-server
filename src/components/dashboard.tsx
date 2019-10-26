import React from "react";
import FormBody from "./FormBody.tsx";

import socket_io from "socket.io-client";


type Props = {};
type State = {
  waiting: boolean,
  experimenting: boolean,
  forms: Array<object>,
  constantForms: Array<object>
};
class Dashboard extends React.Component<Props, State> {
  state: State;
  form: any;
  formIds: {constant: Array<string>, trial: Array<string>};
  nextId: Number;
  socket: any;
  waitingMessage: any;
  callbackId: Timeout;

  constructor(props) {
    super(props);
    this.waitingMessage = (<p>Waiting. . .</p>);

    this.socket = socket_io("/proctors");

    this.state = {
      forms: [],
      constantForms: [],
      waiting: true,
      experimenting: false
    };
    this.nextId = 0;
    this.formIds = {constant: [], trial: []};

    this.socket.on("form", form => {
      this.setState( (prev) => {

        let forms = this.state.forms;
        let constantForms = this.state.constantForms;
        let waiting;
        const formId =  `Form${this.nextId++}`;
        if (form.hasOwnProperty("constant") && form.constant) {
          constantForms.push(form);
          this.formIds.constant.push(formId);
          waiting = prev.waiting;
        }
        else {
          forms.push(form);
          this.formIds.trial.push(formId);
          waiting = false;
        }
        return {waiting, constantForms, forms};
      });
    });

    this.socket.on("end", () => {
      if (this.state.forms.length > 0) return;
      this.endExperiment();
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
          <button onClick={() => this.startExperiment()}>Start</button>
      );

    return (
      <div>
        <h2>Trial Events</h2>
        {this.state.waiting ?
          this.waitingMessage :
          this.renderFormSet(this.state.forms, this.formIds.trial, false)
        }
        <br/>
        <button onClick={() => {this.socket.emit("end") } }>End</button>

        <h2>Other Events</h2>

        {this.renderFormSet(this.state.constantForms, this.formIds.constant, true)}
      </div>
    );
  }

  renderFormSet(formSet, formIds, isStatic) {
    if (isStatic === undefined) isStatic = false;
    const forms = formSet.map((form,i) => {
      return this.renderForm(form, formIds[i], isStatic);
    });
    return forms;
  }

  renderForm(form, id, isStatic) {
    if (isStatic === undefined) isStatic = false;
    const formBody = FormBody(form);

    return (
      <form id={id} action="">
        <h3>{form.title}</h3>
        {formBody.length ? formBody : (<p>No form for this trial</p>)} 
        <br/>
        <input type="button" value="Submit" onClick={() => this.onSubmit(id, !isStatic)}/>
        { isStatic ? "" :
          <input type="button" value="Skip" onClick={() => this.onSkip(id, true)}/>
        }
      </form>
    );
  }

  onSkip(id, remove) {
    let submission = {type: "skipForm", timestamp: Date.now()}
    this.socket.emit("submission", submission);
    if (remove) this.removeForm(id);
    return false;
  }

  onSubmit(id, remove) {
    const formElement = document.forms[id.toString()];
    const formData = new FormData(formElement);
    const submission = {
      ...toJSON(formData),
      type: "submission",
      timestamp: Date.now()
    };
    this.socket.emit("submission", submission);
    if (remove) this.removeForm(id);
    return false;
  }

  endExperiment() {
    this.nextId = 0;
    this.setState(prev => {
      this.formIds = {constant: [], trial: []};
      return {
        waiting: true, experimenting: false,
        forms: [], constantForms: []
      };
    });
  }

  onKeydown(e) {
    if (e.code === "Enter")
      console.log("Someone pressed <Enter>");
  }

  removeForm(id) {
    let formInd = this.formIds.trial.indexOf(id);
    let constantForms;
    let forms;

    if (formInd < 0) {
      formInd = this.formIds.constant.indexOf(id);
      constantForms = this.state.constantForms.slice();
      constantForms.splice(formInd,1); 
      this.formIds.constant.splice(formInd, 1);
      forms = this.state.forms;
    }
    else {
      forms = this.state.forms.slice();
      forms.splice(formInd,1);
      this.formIds.trial.splice(formInd,1);
      constantForms = this.state.constantForms;
    }

    this.setState(prev => {
      const waiting = forms.length === 0;
      return {constantForms,forms,waiting}
    });

  }

  
  startExperiment() {
    this.socket.emit("start");
    //this.ending = false;
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