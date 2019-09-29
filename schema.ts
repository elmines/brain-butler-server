export interface Form {
  title: string;
  categories: Array<Category>;
  fields: Array<Field>;
  meta: object
}

export enum Category {
  Choice = "Choice",
  Text = "Text"
}

export type Field = Choice | Text;

export interface Choice {
  exclusive: boolean;
  name: string;
  labels: Array<string>;
  values: Array<string>
}

export interface Text {
  name: string;
  label: string
}
