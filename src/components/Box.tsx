import { useRef, useState } from 'react'
import { MeshProps, useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

function Box(props: MeshProps) {
  const ref = useRef<Mesh>(null)

  // Hold state for hovered and clicked events.
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // Subscribe this component to the render-loop and rotate the mesh every frame.
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta
    }
  })

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default Box
