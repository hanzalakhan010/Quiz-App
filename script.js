var user = {};
var currentQuiz = "";
var currentQuestionNo = 0;
var host = "http://localhost:3000";
var maxQuestion = 10;
var score = 0;
var difficulty = ''

function checkQuestion(userAns, correctAns) {
  if (typeof correctAns == "object") {
    for (let ans of userAns) {
      let ans_text = ans.id;
      let option = correctAns.find((matching) => matching.text == ans_text);
      let checked = ans.checked;
      if (option["isCorrect"] == checked && checked) {
        score += 1;
      }
    }
  } else {
    if (userAns == correctAns) {
      score += 1;
    }
  }
}

async function renderQuestion() {
  let res = await fetch(`${host}/${currentQuiz}/${currentQuestionNo}`);
  let data = await res.json();
  if (data) {
    document.getElementById(
      "currentQuestionNo"
    ).innerText = `Que # ${currentQuestionNo}`;
    document.getElementById("currentQuestion").innerText = data.question;
    document.getElementById("choices").innerHTML = "";
    switch (data.type) {
      case "text": {
        document.getElementById(
          "choices"
        ).innerHTML = `<input class = 'ans' id = 'ans' type = 'text'/>`;
        document.getElementById("nextQueBtn").onclick = () => {
          userAns = document.getElementById("ans").value;
          checkQuestion(userAns, data.correctAnswer);
          loadNextQuestion();
        };
        break;
      }
      case "list":
      case "radio": {
        data.options.map((option) => {
          document.getElementById("choices").innerHTML += `
            <input  id = '${option.text}' name = 'ans' type = 'radio' />
            <label for = '${option.text}' name = 'ans'>${option.text}</label>
            <br>
            `;
        });
        document.getElementById("nextQueBtn").onclick = () => {
          userAns = [...document.querySelectorAll("#choices input")];
          checkQuestion(userAns, data.options);
          loadNextQuestion();
        };
        break;
      }
      case "checkbox": {
        data.options.map((option) => {
          document.getElementById("choices").innerHTML += `
              <input  id = '${option.text}' name = 'ans' type = 'checkbox' />
              <label for = '${option.text}' name = 'ans'>${option.text}</label>
              <br>
              `;
        });
        document.getElementById("nextQueBtn").onclick = () => {
          userAns = [...document.querySelectorAll("#choices input")];
          checkQuestion(userAns, data.options);
          loadNextQuestion();
        };
        break;
      }
    }
  }
}

function loadNextQuestion() {
  if (currentQuestionNo < maxQuestion) {
    // checkQuestion()
    currentQuestionNo += 1;
    renderQuestion();
  } else {
  }
}

function startTImer() {
    console.log('debug')
  let timer = document.getElementById("timer");
  const finishTimeMinute = Number(new Date().getMinutes())
  const finishTimeseconds = Number(new Date().getSeconds());

  let timing = setInterval(() => {
    let currentDate = new Date();
    let deltaMinute = finishTimeMinute - Number(currentDate.getMinutes());
    let deltaSeconds = Math.abs(
      60 - (Number(currentDate.getSeconds()) - finishTimeseconds)
    );
    if (deltaMinute == 0 && deltaSeconds == 0) {
      console.log(deltaMinute, deltaSeconds);
      clearInterval(timing);
    }
    timer.innerHTML = `${deltaMinute} : ${deltaSeconds}`;
  }, 1000);
}

function userDetailSubmit(event) {
  event.preventDefault();
  user["username"] = event.target.uname.value;
  user["name"] = event.target.name.value;
  currentQuiz = event.target.quizSelect.value;
  if (user.username && user.name && currentQuiz) {
    document.getElementById("userDetails").style.display = "none";
    document.getElementById("quizBoard").style.display = "block";
    document.getElementById("quizTitle").textContent = currentQuiz;
    startTImer();
    loadNextQuestion();
  } else {
    alert("Please fill the form first");
  }
}

document.getElementById("choicesForm").addEventListener("submit", (event) => {
  event.preventDefault();
});
document
  .querySelector("#userDetails form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    userDetailSubmit(event);
  });
