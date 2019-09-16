interface Message {
  id: number;  // So Answer's can be tied back to Message's ?
  options: object;
  forms: Array<Form>
};

interface Form {
  title: string;
  cat: string;
  content: Fields;
  options: object
}

type Fields = Choices;

interface Choices {
  exclusive: boolean;
  labels: Array<string>;
  values: Array<object>
}


interface Answer {
  id: number;
  answer: Array<string | number>; 
}
