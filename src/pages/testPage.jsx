import { useState } from "react";

export default function TestPage() {

    //count is a state variable that holds the current count value
    //setCount is a function that updates the count state
    //useState is a React hook that allows you to add state to a functional component
   const [count, setCount] = useState((0) );



  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="">
        <button onClick={
            () => {
               setCount(count - 1);
            }
        } className="bg-blue-600 mr-5 text-white font-bold py-2 px-4 rounded text-center w-[100px] h-[100px] cursor-pointer">
            -
        </button>
         <span className="text-[20px] font-bold text-center w-[100px] mr-5">{count}</span>
        <button onClick={() =>{
           setCount(count + 1);
        }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded text-center w-[100px] h-[100px] cursor-pointer">
            +
        </button>
      </div>
    </div>
  );
}