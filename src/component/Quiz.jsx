import { useState } from "react"; 
import question from "./question.jsx"; 
import Questiontimer from "./questiontimer.jsx";
import Result from "./result.jsx";

export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([]);  // badha questions na user answers store karva mate
  const [selectedAnswer, setSelectedAnswer] = useState(null);  // current question ma user e select karel answer temporary store karva mate

  const activeQuestionIndex = userAnswers.length;  // ketla answers aapi didha chhe ena base par active question no index
  const currentQuestion = question[activeQuestionIndex];  // currently je question screen par display thai chhe  
  const quizIsComplete = activeQuestionIndex === question.length;  // badha questions complete thai gaya chhe ke nathi te check kare

  function handleSelectAnswer(answer) { // option par click thay tyare aa function call thase
    setSelectedAnswer(answer);// aa function khali answer select kare chhe, save nathi karto
  }

  function handleNext() {  // NEXT button dabaya pachhi j answer final save thase    
    setUserAnswers(prev => [...prev, selectedAnswer]); // answer list ma add karo
    setSelectedAnswer(null); // next question mate reset
  }
  
  function handleSkipAnswer() { // timer complete thay to question skip thai jase  //  answer select karyo hoy ke n karyo hoy
    setUserAnswers(prev => [...prev, null]); // null etle skipped question
    setSelectedAnswer(null);
  }
 
  if (quizIsComplete) {  // jo badha questions complete thai gaya hoy  
    return <Result userAnswers={userAnswers} />;  // to result screen show karo
  }

  const shuffledAnswer = [...currentQuestion.options];  // options ni copy banavi jethi original data change na thay
  shuffledAnswer.sort(() => Math.random() - 0.5);  // options ne random order ma shuffle karva mate

  return (
    <div className="quiz-container"> 
      {/* question change thata timer reset karva mate */}
      <Questiontimer
        key={activeQuestionIndex}
        timeout={10000} // 10 seconds per question
        onTimeout={handleSkipAnswer} // timer complete thay tyare skip
      />
      <h2>{currentQuestion.question}</h2>   {/* current question display */}
      {/* options list */}
      <ul className="quiz-options">
        {shuffledAnswer.map(answer => (
          <li key={answer}>
            <button
              onClick={() => handleSelectAnswer(answer)} // option select
            >
              {answer}
            </button>
          </li>
        ))}
      </ul>
    
      {/* NEXT dabaya vagar answer save nahi thay */}
      <button
        className="next-btn"
        onClick={handleNext}
        disabled={selectedAnswer === null} // answer select na hoy to disable
      >
        Next
      </button>
    </div>
  );
}
