import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const createNew = async (content, id) => {
  const object = { content, id, votes: 0 }
  const res = await axios.post(baseUrl, object)
  return res.data
}

const addVote = async (anecdote) => {
  const updatedObject = { ...anecdote, votes: anecdote.votes + 1 }
  const res = await axios.put(`${baseUrl}/${anecdote.id}`, updatedObject)
  return res.data
}

export default { getAll, createNew, addVote }