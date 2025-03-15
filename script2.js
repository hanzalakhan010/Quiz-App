async function fetchData(quiz,id){
    let response = await fetch('data/db.json')
    let data = await response.json()
    // console.log(data)
    let quizQuestions = data?.[quiz]
    let question = quizQuestions.find((ele)=>ele.id == id)
    // console.log(quizQuestions)
    return question
}
// fetchData('Physics',1)
// .then((msg)=>console.log(msg))