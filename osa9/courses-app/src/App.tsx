import React from 'react';
import './App.css';
import { courseName, courseParts, PartProps, ContentProps} from './index'

const Header: React.FC<{name: string}> = ({ name }) => {
  console.log(name)
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Content: React.FC<ContentProps> = ({ parts }: ContentProps) => {
  console.log(parts)
  return (
    <div>{parts.map(part => {
       return <Part key={part.name} part={part} />
     })}
     </div>
  );
}

const Total: React.FC<ContentProps> = ({ parts }: ContentProps) => {
  return (
    <div>
      <p>Number of exercises {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}</p>
    </div>
  )
}

const Part: React.FC<PartProps> = ({ part }: PartProps) => {
  switch (part.name) {
    case "Fundamentals":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>{part.description}</p>
        </div>
      );
    case "Using props to pass data":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>Group project count: {part.groupProjectCount}</p>
        </div>
      );
    case "Deeper type usage":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>{part.description}<br />
          exercise count: {part.exerciseCount}<br />
          <a href={part.exerciseSubmissionLink}>Submit your exercise</a></p>
        </div>
      );
    case "Twenty pull-ups":
    return (
      <div>
        <h3>{part.name}</h3>
        <p>{part.description}<br />
        exercise count: {part.exerciseCount}</p>
      </div>
    );
    default:
      return assertNever(part);
  }
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

function App(): JSX.Element {
  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts}  />
    </div>
  );
}

export default App;
