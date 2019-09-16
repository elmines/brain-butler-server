import React from "react";

function choicesForm(props) {
  const typeAtt = props.exclusive ? "radio" : "checkbox";

  let selections = [];
  for (var i: number = 0; i < props.labels.length; ++i) {
    const label: string = props.labels[i];
    const value: string = props.values[i];
    selections.push( <input type={typeAtt} name={props.title} value={value}/>  );
    selections.push( label )
  }

  return (
    <div>
      {
        props.labels.map( (label, i) => {
          return (
            <input type={typeAtt} name={props.title} value={props.values[i]}/> {label}
          );
        })
      }
    </div>
  );

}

function subForm(props) {


}

function Form(props){

  return (
    <form method={props.method} action={props.action}>
      <input type="hidden" name="id" value={props.id}/>

    </form>
  );
}
