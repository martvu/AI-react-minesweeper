import { Game } from './components/Game'
import './App.css'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0'
    }}>
      <Game />
    </div>
  )
}

export default App
