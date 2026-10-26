import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, Text } from '@react-three/drei';
import * as THREE from 'three';

const wood = '#805537';
const darkWood = '#513725';
const linen = '#c4a779';
const brass = '#9a7340';

function Beam({ start, end, radius = 0.045, color = wood }) {
  const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const center = a.clone().add(b).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={center.toArray()} quaternion={q.toArray()} castShadow>
    <cylinderGeometry args={[radius, radius, direction.length(), 9]} />
    <meshStandardMaterial color={color} roughness={0.87} />
  </mesh>;
}
function Membrane({ side }) {
  const shape = React.useMemo(() => {
    const points = [[0,0],[0.65,0.03],[1.45,0.13],[2.35,0.11],[3.15,-0.14],[2.65,-0.53],[1.85,-0.87],[1.06,-0.72],[0.34,-0.35]];
    const s = new THREE.Shape(); points.forEach(([x,y],i) => i ? s.lineTo(side*x,y) : s.moveTo(side*x,y)); s.closePath();
    return s;
  },[side]);
  return <mesh rotation={[-Math.PI / 2,0,0]} position={[0,0.008,0]} receiveShadow castShadow>
    <shapeGeometry args={[shape]} />
    <meshStandardMaterial color={linen} side={THREE.DoubleSide} transparent opacity={0.83} roughness={1} depthWrite={false} />
  </mesh>;
}
function Wing({ side, wingRef, onSelect }) {
  return <group ref={wingRef} position={[side * 0.38, 0.48, 0]} onClick={(e)=>{e.stopPropagation();onSelect('asas')}}>
    <Membrane side={side}/>
    <Beam start={[0,0,0]} end={[side*3.14,0,-0.14]} radius={0.065}/>
    <Beam start={[0,0,0]} end={[side*2.65,0,-0.53]} radius={0.044}/>
    <Beam start={[0,0,0]} end={[side*1.85,0,-0.87]} radius={0.034}/>
    {[0.72,1.43,2.15,2.82].map((x,i)=><Beam key={x} start={[side*x,0,0.06-i*0.045]} end={[side*(x+0.09),0,-0.63 + i*0.115]} radius={0.024} color={brass}/>)}
    <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.11,0.11,0.22,12]}/><meshStandardMaterial color={brass} metalness={0.42} roughness={0.65}/></mesh>
  </group>;
}
function Pulley({ x }) {
  return <group position={[x,-0.25,0.15]}>
    <mesh rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[0.18,0.038,8,24]}/><meshStandardMaterial color={brass} metalness={0.35} roughness={0.55}/></mesh>
    <mesh><sphereGeometry args={[0.055,10,10]}/><meshStandardMaterial color={darkWood}/></mesh>
  </group>;
}
export default function Ornithopter({ playing, speed, amplitude, selected, onSelect, showLabels, resetToken }) {
  const left=useRef(),right=useRef(),pedal=useRef(), time=useRef(0), controls=useRef();
  React.useEffect(()=>{controls.current?.reset();},[resetToken]);
  useFrame((_, delta)=>{
    if(playing) time.current += Math.min(delta,0.05)*speed*2*Math.PI;
    const angle = Math.sin(time.current)*amplitude*Math.PI/180;
    if(left.current) left.current.rotation.z = angle;
    if(right.current) right.current.rotation.z = -angle;
    if(pedal.current) pedal.current.rotation.x = angle*0.7;
  });
  return <>
    <color attach="background" args={['#e5d5b7']}/>
    <ambientLight intensity={2.0}/><directionalLight position={[5,8,6]} intensity={3.1} castShadow shadow-mapSize={[1024,1024]}/>
    <directionalLight position={[-5,1,-5]} intensity={1.1} color="#ffe7ba"/>
    <group rotation={[0,0,0]} position={[0,0.23,0]}>
      <group onClick={(e)=>{e.stopPropagation();onSelect('estrutura')}}>
        <mesh position={[0,-0.52,0.12]} receiveShadow castShadow><boxGeometry args={[0.79,0.11,2.15]}/><meshStandardMaterial color={wood}/><Edges color="#5c432e" threshold={25}/></mesh>
        {[-0.35,0.35].map((x)=><React.Fragment key={x}>
          <Beam start={[x,-0.5,-0.95]} end={[x,0.48,-0.10]} radius={0.045}/>
          <Beam start={[x,-0.5,0.9]} end={[x,0.48,-0.1]} radius={0.045}/>
          <Beam start={[x,-0.55,-1.06]} end={[x,-0.55,1.05]} radius={0.04} color={darkWood}/>
        </React.Fragment>)}
        <Beam start={[-0.42,0.44,-0.08]} end={[0.42,0.44,-0.08]} radius={0.07}/>
        <mesh position={[0,-0.39,0.52]}><boxGeometry args={[0.67,0.1,0.4]}/><meshStandardMaterial color={darkWood}/></mesh>
      </group>
      <Wing side={-1} wingRef={left} onSelect={onSelect}/><Wing side={1} wingRef={right} onSelect={onSelect}/>
      <group onClick={(e)=>{e.stopPropagation();onSelect('transmissao')}}>
        <Pulley x={-0.23}/><Pulley x={0.23}/>
        <Beam start={[-0.21,-0.24,0.15]} end={[-0.38,0.44,0]} radius={0.019} color="#6f5234"/>
        <Beam start={[0.21,-0.24,0.15]} end={[0.38,0.44,0]} radius={0.019} color="#6f5234"/>
        <Beam start={[-0.21,-0.24,0.15]} end={[-0.21,-0.72,0.72]} radius={0.019} color="#6f5234"/>
        <Beam start={[0.21,-0.24,0.15]} end={[0.21,-0.72,0.72]} radius={0.019} color="#6f5234"/>
      </group>
      <group ref={pedal} position={[0,-0.75,0.7]} onClick={(e)=>{e.stopPropagation();onSelect('estribos')}}>
        {[-0.24,0.24].map(x=><group key={x}><Beam start={[x,0,-0.16]} end={[x,0,0.16]} radius={0.04}/><mesh position={[x,-0.04,0.10]}><boxGeometry args={[0.28,0.06,0.19]}/><meshStandardMaterial color={darkWood}/></mesh></group>)}
      </group>
    </group>
    <gridHelper args={[12,20,'#c6aa7e','#d5bc94']} position={[0,-1.8,0]}/>
    {showLabels && <group>
      <Text position={[2.7,1.75,0]} fontSize={0.17} color="#6c4a2b" anchorX="center">ASAS ARTICULADAS</Text>
      <Text position={[-1.55,-0.85,0]} fontSize={0.16} color="#6c4a2b">CORDAS E ROLDANAS</Text>
      <Text position={[1.15,-1.3,0.8]} fontSize={0.16} color="#6c4a2b">ESTRIBOS</Text>
    </group>}
    <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping dampingFactor={0.07} minDistance={4.2} maxDistance={12} minPolarAngle={0.32} maxPolarAngle={Math.PI*0.77} target={[0,-0.05,0]}/>
  </>;
}
