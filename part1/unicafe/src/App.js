import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    //<p>{text} {value}</p>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ clicks, good, neutral, bad }) => {
  if (clicks === 0) {
    return (
      <>No feedback has been given</>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all"} value={clicks} />
        <StatisticLine text={"average"} value={(good * 1 + neutral * 0 + bad * (-1)) / clicks} />
        <StatisticLine text={"positive"} value={good / clicks} />
      </tbody>
    </table>
  )
}

const Button = ({ name, clickFunction }) => {
  return (
    <button onClick={clickFunction}>{name}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [clicks, setClicks] = useState(0)

  const clickGood = () => {
    setClicks(clicks + 1)
    setGood(good + 1)
  }

  const clickNeutral = () => {
    setClicks(clicks + 1)
    setNeutral(neutral + 1)
  }

  const clickBad = () => {
    setClicks(clicks + 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button name={"good"} clickFunction={clickGood} />
      <Button name={"neutral"} clickFunction={clickNeutral} />
      <Button name={"bad"} clickFunction={clickBad} />
      <h1>statistics</h1>
      <Statistics clicks={clicks} good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App