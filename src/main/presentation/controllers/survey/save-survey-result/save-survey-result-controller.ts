// async save (saveSurveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
//   const survey = await this.loadSurveyRepository.loadById(saveSurveyResult.surveyId)
//   if (!survey.answers.filter(answer => answer.answer === saveSurveyResult.answer)) {
//     return null
//   }
//   const result = await this.saveSurveyResultRepository.save(saveSurveyResult)
//   return result
// }
