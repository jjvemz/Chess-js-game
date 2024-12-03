import React, {useRef, useEffect} from 'react'

const VideoPlayer = ({ localStream, remoteStream}) => {
  const localVideoref = useRef(null);
  const remoteVideoref = useRef(null);


  useEffect(()=>{
    if(localStream && localVideoref.current){
        localVideoref.current.srcObject  = localStream;
    }

    if(remoteStream && remoteVideoref.current){
        remoteVideoref.current.srcObject  = remoteStream;
    }
  }, [localStream, remoteStream])

    return (
    <div>VideoPlayer</div>
  )
}

export default VideoPlayer