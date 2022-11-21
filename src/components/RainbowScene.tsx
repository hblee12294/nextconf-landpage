import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { Rainbow } from './Rainbow'
import { Mesh } from 'three'

function Scene() {
  const ref = useRef<Mesh>(null!)

  useFrame((state, delta) => (ref.current.rotation.z += delta / 5))

  return <Rainbow ref={ref} startRadius={0} endRadius={0.65} fade={0} />
}

export default Scene
