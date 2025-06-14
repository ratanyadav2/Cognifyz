import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Task4 } from "./task4";
import ThankYou from "./thankyou";



function Task4main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Task4 />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Task4main;
