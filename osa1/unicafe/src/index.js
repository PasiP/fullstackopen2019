import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
  console.log(props)
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
      </button>
  )
}

const Statistics = (props) => {
  console.log('Statistics props value is', props)
  const { text, num, sum } = props

  if(sum === 0) {
    if(text === "good") {
      return (
        <tr>
          <td>No feedback given</td>
        </tr>
      )
    } else {
      return(<></>)
    }
  } else {
    return (
      <tr>
        <td>{text}</td><td>{num}</td>
      </tr>
    )
  }

}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let sum = good + neutral + bad
  let avg = (good + (bad * -1)) / (good + neutral + bad)
  let pos = good / (good + neutral + bad) * 100


  return (
    <div>
      <h1>give feedback</h1>
      <Button
        onClick={() => setGood(good + 1)}
        text='good'
      />
      <Button
        onClick={() => setNeutral(neutral + 1)}
        text='neutral'
      />
      <Button
        onClick={() => setBad(bad + 1)}
        text='bad'
      />
      <h1>statistics</h1>
      <table>
        <tbody>
          <Statistics text="good" num={good} sum={sum} />
          <Statistics text="neutral" num={neutral} sum={sum} />
          <Statistics text="bad" num={bad} sum={sum} />
          <Statistics text="all" num={sum} sum={sum} />
          <Statistics text="average" num={avg} sum={sum} />
          <Statistics text="positive" num={pos+ " %"} sum={sum} />
        </tbody>
      </table>
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)
