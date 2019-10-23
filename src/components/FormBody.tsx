import React from "react";
import {Form,Choice,Category,Text} from "./schema.ts";

export default function FormBody(form: Form): Array<object> {
  if (!form || !form.categories) return [];

  let fieldSets = form.categories.map( (cat, i): Array<object> => {
    switch(cat) {
      case Category.Choice:
        return _choiceForm(form.fields[i] as Choice); 
      case Category.Text:
        return _textForm(form.fields[i] as Text);
      default:
        return [<p>Bad Form Field Type</p>];
    }
  });
  //fieldSets = fieldSets.map(set => (<div>{set}</div>) );
  return fieldSets;
}

function _flatMap(array, callback) {
  const mapped = array.map(callback);
  return mapped.reduce((x,y) => x.concat(y), []);
}

function _choiceForm(choices: Choice): Array<object> {
  const typeAtt = choices.exclusive ? "radio" : "checkbox";
  const values = choices.values;

  return choices.labels.map( (label, i) => (
    <label>
      {label}
      <input type={typeAtt} name={choices.name} id={values[i]} value={values[i]} />
    </label>
  ));
}

function _textForm(text: Text): Array<object> {
  const textBox = (
    <label>
      {text.label}
      <input type="text" name={text.name}/>
    </label>
  );
  return [textBox];
}