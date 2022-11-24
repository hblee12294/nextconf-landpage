import { useMemo } from 'react'
import { useLoader, GroupProps, MeshProps } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'

import { CreateEventReturnType } from './Reflect'

export interface PrismProps extends GroupProps {
  onRayOut?: (e: CreateEventReturnType) => void
  onRayOver?: (e: CreateEventReturnType) => void
  onRayMove?: (e: CreateEventReturnType) => void
}

export function Prism({ onRayOver, onRayOut, onRayMove, ...props }: PrismProps) {
  const { nodes } = useLoader(
    GLTFLoader,
    'https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/xxpI-prism.glb',
  )

  const customProps = useMemo(() => {
    return { ...props, onRayOver, onRayOut, onRayMove } as MeshProps
  }, [onRayMove, onRayOut, onRayOver, props])

  return (
    <group {...props}>
      {/* A low-res, invisible representation of the prism that gets hit by the raycaster */}
      <mesh visible={false} scale={1.9} rotation={[Math.PI / 2, Math.PI, 0]} {...customProps}>
        <cylinderGeometry args={[1, 1, 1, 3, 1]} />
      </mesh>
      {/* The visible hi-res prism */}
      <mesh position={[0, 0, 0.6]} renderOrder={10} scale={2} dispose={null} geometry={nodes.Cone.geometry}>
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1}
          thickness={0.9}
          roughness={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
