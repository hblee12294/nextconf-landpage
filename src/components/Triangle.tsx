import { useState, useMemo } from 'react'
import { MeshProps } from '@react-three/fiber'

function Triangle({ ...props }: MeshProps) {
  const [hovered, setHovered] = useState(false)

  const customProps = useMemo(() => {
    return { ...props, onRayOver: () => setHovered(true), onRayOut: () => setHovered(false) } as MeshProps
  }, [props])

  return (
    <mesh {...customProps}>
      <cylinderGeometry args={[1, 1, 1, 3, 1]} />
      <meshBasicMaterial color={hovered ? 'orange' : 'white'} />
    </mesh>
  )
}

export default Triangle
