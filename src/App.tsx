import './App.css'
import { run } from './script'

function App() {

  setTimeout(() => {
    run();
  }, 0)

  return (
    <>
      <svg id="view" width={520} height={520}/>
    </>
  )
}

export default App
