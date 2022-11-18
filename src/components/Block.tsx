import { useState } from 'react'
import { MeshProps } from '@react-three/fiber'
import { useMemo } from 'react'

interface BlockProps extends MeshProps {
  onRayOver?: () => void
}

function Block({ ...props }: BlockProps) {
  const [hovered, setHovered] = useState(false)

  const customProps = useMemo(() => {
    return { ...props, onRayOver: () => setHovered(true), onRayOut: () => setHovered(false) } as MeshProps
  }, [props])

  return (
    <mesh {...customProps}>
      <boxGeometry />
      <meshBasicMaterial color={hovered ? 'orange' : 'white'} />
    </mesh>
  )
}

export default Block
