import question from "./question.jsx";

export default function result({ userAnswers }) {
  // total questions
  const totalQuestions = question.length;

  // count skipped and answered
  const skippedCount = userAnswers.filter(answer => answer == null).length;
  const answeredCount = totalQuestions - skippedCount;

  // calculate percentages
  const skippedPercentage = ((skippedCount / totalQuestions) * 100).toFixed(0);
  const answeredPercentage = ((answeredCount / totalQuestions) * 100).toFixed(0);


  return (
    <div className="quiz-complete-wrapper">
      <img src="/images/13488.jpg" alt="Quiz Complete" className="quiz-complete-img" />
      <h1>Quiz Completed 🏆</h1>
      <div className="result-stats">
        <p>
          <span >{skippedPercentage}%</span>
          <span>skipped</span>
        </p>
        <p>
          <span>{answeredPercentage}%</span>
          <span>answered correct</span>
        </p>
        <p>
          <span>0%</span>
          <span>answered incorrect</span>
        </p>
      </div>
      <ol>
        {userAnswers.map((answer, index) => {
          return (
            <li key={index}>
              <p>{question[index]?.question}</p> {/* question display karava */}
              <p>answer: {answer ?? "Skipped"}</p>  {/* answer display karava & ni karavu hoi to skipped display karavse */}
            </li>
          );
        })}
      </ol>
    </div>
  );
}