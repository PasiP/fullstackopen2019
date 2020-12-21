import React from "react";
import ReactDOM from "react-dom";
import App from "./App";


export const courseName = "Half Stack application development";

interface ContentProps {
    parts: CoursePart[];
}

interface PartProps {
    part: CoursePart;
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase{
  description: string;
}

interface CoursePartOne extends CoursePartDescription {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartDescription {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends CoursePartDescription {
  name: "Twenty pull-ups";
  exerciseCount: number;
}

type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CoursePartFour;

export const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
  },
  {
    name: "Twenty pull-ups",
    exerciseCount: 3,
    description: "Some people like this course part and some don't"
  }
];

export type{
  CoursePartBase,
  CoursePartOne,
  CoursePartTwo,
  CoursePartThree,
  CoursePart,
  CoursePartDescription,
  ContentProps,
  PartProps
}

ReactDOM.render(<App />, document.getElementById("root"));
