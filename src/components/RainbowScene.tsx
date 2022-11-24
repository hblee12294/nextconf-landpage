import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

import { Rainbow } from './Rainbow'
import { Beam, BeamAPI } from './Beam'
import { Prism } from './Prism'
import { Mesh } from 'three'

function Scene() {
  const boxreflect = useRef<BeamAPI>(null!)

  // const rayOut = useCallback(() => hitPrism(false), [])
  // const rayOver = useCallback((e) => {
  //   // Break raycast so the ray stops when it touches the prism.
  //   e.stopPropagation()
  //   hitPrism(true)
  //   // Set the intensity really high on first contact.
  //   rainbow.current.material.speed = 1
  //   rainbow.current.material.emissiveIntensity = 20
  // }, [])

  // const vec = new THREE.Vector3()
  // const rayMove = useCallback(({ api, position, direction, normal }) => {
  //   if (!normal) return
  //   // Extend the line to the prisms center.
  //   vec.toArray(api.positions, api.number++ * 3)
  //   // Set flare.
  //   flare.current.position.set(position.x, position.y, -0.5)
  //   flare.current.rotation.set(0, 0, -Math.atan2(direction.x, direction.y))

  //   // Calculate refraction angles.
  //   let angleScreenCenter = Math.atan2(-position.y, -position.x)
  //   const normalAngle = Math.atan2(normal.y, normal.x)

  //   // The angle between the ray and the normal.
  //   const incidentAngle = angleScreenCenter - normalAngle

  //   // Calculate the refraction for the incident angle.
  //   const refractionAngle = calculateRefractionAngle(incidentAngle) * 6

  //   // Apply the refraction.
  //   angleScreenCenter += refractionAngle
  //   rainbow.current.rotation.z = angleScreenCenter

  //   // Set spot light.
  //   lerpV3(spot.current.target.position, [Math.cos(angleScreenCenter), Math.sin(angleScreenCenter), 0], 0.05)
  //   spot.current.target.updateMatrixWorld()
  // }, [])

  return (
    <>
      <Beam ref={boxreflect} bounce={10} far={20}>
        {/* <Prism scale={0.6} position={[0, -0.5, 0]} onRayOver={rayOver} onRayOut={rayOut} onRayMove={rayMove} /> */}
        <Prism scale={0.6} position={[0, -0.5, 0]} />
      </Beam>
    </>
  )
}

export default Scene
