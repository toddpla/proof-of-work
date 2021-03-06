import quizReducer from '../quiz'
import questions from '../../test/fixtures/questions'

describe('quiz reducer', () => {

  it('should return the initial state', () => {
    expect((quizReducer(undefined, {}))).toEqual({})
  })

  it('should return the new question state', () => {
    const action = {
      type: 'GET_QUESTION',
      question: questions[0]
    }
    const state = quizReducer(undefined, action)
    expect(state).toEqual(questions[0])
  })

  it('should return the new question state', () => {
    const action = {
      type: 'CLEAR_QUIZ',
      quiz: 'quiz'
    }
    const state = quizReducer(undefined, action)
    expect(state).toEqual('quiz')
  })
})
