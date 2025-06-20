import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="text-center mt-10 bg-gray-100 p-10 rounded-lg shadow-lg p-6">
      <p className="text-4xl font-bold text-blue-600">Tailwind is Working ✅</p>
    </div>
  )
}

export default App
