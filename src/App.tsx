import { Canvas, useLoader } from '@react-three/fiber'
import { Bloom, EffectComposer, LUT } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import { Texture } from 'three'

import Scene from './components/Scene'

function App() {
  const texture: Texture = useLoader(
    LUTCubeLoader,
    'https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/DwlG-F-6800-STD.cube',
  )

  return (
    <Canvas gl={{ antialias: false }} orthographic camera={{ position: [0, 0, 100], zoom: 70 }}>
      <color attach="background" args={['#000']} />
      <Scene />

      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur levels={9} intensity={1.5} luminanceThreshold={1} luminanceSmoothing={1} />
        <LUT lut={texture} />
      </EffectComposer>
    </Canvas>
  )
}

export default App
