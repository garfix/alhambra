import './App.css'
import { run } from './script'

function App() {

  setTimeout(() => {
    run();
  }, 0)

  return (
    <>
      <svg id="view" width={520} height={520} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id = "filter">
            <feGaussianBlur in = "SourceAlpha" stdDeviation = "4" result = "blur" />
            <feSpecularLighting result = "light" in = "blur" specularExponent = "100" lightingColor = "#bbbbbb">
                <fePointLight x = "150" y = "150" z = "200" id="light1" />
            </feSpecularLighting>
            <feComposite in = "SourceGraphic" in2 = "light" operator = "arithmetic" k1 ="0" k2 ="1" k3 ="1" k4 ="0" />
          </filter>
        </defs>
        <g id="background"/>
        <g id="group1" filter="url(#filter)" />
      </svg>
    </>
  )
}

export default App
