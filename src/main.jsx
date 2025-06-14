import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.css'

import App from './App.jsx'
import { Task1 } from './task1/task1.jsx'
import { Task2 } from './task2/task2.jsx'
import { Task3 } from './task3/task3.jsx'
import { Task4 } from './task4/task4.jsx'
import { BrowserRouter } from 'react-router-dom'
import Task4main from './task4/task4main.jsx'
import { Task5 } from './task5/task5b.jsx'
import { Task6 } from './task6/task6.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Task6 />
  </StrictMode>,
);
