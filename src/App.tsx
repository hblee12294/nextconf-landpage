import { Canvas } from '@react-three/fiber'

// import Scene from './components/Scene'
import Scene from './components/RainbowScene'

function App() {
  return (
    <Canvas orthographic camera={{ zoom: 100 }}>
      <color attach="background" args={['#000']} />
      <Scene />
    </Canvas>
  )
}

export default App
