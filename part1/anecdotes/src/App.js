import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const points = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(points)
  const [mostVotes, setMostVotes] = useState()

  const selectRandomAnecdote = () => {
    let randIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randIndex)
  }

  const updateVotes = () => {
    let copy = [ ...votes ]
    copy[selected] += 1
    setVotes(copy)
    getMostVoted(copy)
  }

  const getMostVoted = (copy) => {
    let highestVotes = -1;
    let highestVotesIndex = -1;
    
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] > highestVotes) {
        highestVotes = copy[i]
        highestVotesIndex = i
      }
    }
    
    setMostVotes(highestVotesIndex)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={updateVotes}>vote</button>
      <button onClick={selectRandomAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVotes]}</p>
      <p>has {votes[mostVotes]} votes</p>
    </div>
  )
}

export default App