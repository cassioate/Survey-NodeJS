import { Collection } from 'mongodb'

export const makeFakeSurveyInDB = async (surveyCollection: Collection): Promise<string> => {
  const result = await surveyCollection.insertOne({
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    },
    {
      answer: 'other'
    },
    {
      answer: 'no_answer'
    }],
    date: new Date()
  })
  return result.insertedId.toHexString()
}
