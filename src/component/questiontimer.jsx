import { useEffect, useState } from "react";

export default function Questiontimer({ timeout, onTimeout }) {

 
 
  const [timeLeft, setTimeLeft] = useState(timeout / 1000); // ketla seconds baki chhe te track karva mate state   // timeout milliseconds ma aave chhe etle seconds ma convert kariye

  useEffect(() => {
    if (timeLeft === 0) {  // jo timeLeft 0 thai jaye to question skip thai jase
      onTimeout(); // parent component ne keva mate
      return;
    }

    
    const timer = setTimeout(() => {  // darek 1 second pachhi time ghatadva mate
      setTimeLeft(prev => prev - 1); // time 1 second ochhu karo
    }, 1000);

    
    return () => clearTimeout(timer); // component unmount thay ke time change thay to timer clear karo

  }, [timeLeft, onTimeout]);  //depedency change thai ke timer change thai tyare j run thai 

  return (
    // aa wrapper progress bar ane seconds number ne side-by-side rakhse
    <div className="timer-wrapper">
      {/* progress bar je time pass thai rahyo chhe te show kare */}
      <progress
        value={timeLeft}                 // current remaining seconds
        max={timeout / 1000}            // total seconds
      />

      <span className="timer-text">
        {timeLeft}s   {/* progress bar ni baju ma seconds number display karva mate */}
      </span>

    </div>
  );
}
