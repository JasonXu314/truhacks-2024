import Canvas from '@/components/Canvas';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';

const Session = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [open, setOpen] = useState(false);
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);

	const [stream, setStream] = useState<MediaStream>();
	// const [callerSignal, setCallerSignal] = useState<string>('');
	// const [callAccepted, setCallAccepted] = useState(false);

	const [color, setColor] = useState('black');

	const userVideo = useRef<any>(null);
	// const partnerVideo = useRef<any>(null);

	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!localStorage.getItem('token')) {
			// router.push('/signin');
		}

		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream);
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
			setInit(false);
		});
	}, []);

	const endSession = () => {};

	const toggleCamera = () => {
		if (cameraOn && stream) {
			setCameraOn(false);
			// stream.getTracks().forEach((track) => track.stop());
			stream.getVideoTracks()[0].enabled = false;
		} else if (stream) {
			setCameraOn(true);
			stream.getVideoTracks()[0].enabled = true;
			// stream.getTracks().forEach((track) => track.enabled());
		}
	};

	const toggleMic = () => {
		if (micOn && stream) {
			stream.getAudioTracks()[0].enabled = false;
			setMicOn(false);
		} else if (stream) {
			stream.getAudioTracks()[0].enabled = true;
			setMicOn(true);
		}
	};

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full min-h-screen gap-3 justify-center py-8'>
			<div className='absolute top-10 left-20'>
				<p className=''>EducateAll</p>
			</div>
			<p className='text-text text-4xl font-bold text-center'>
				Welcome, {name}, to your <span className='text-blue'>Tutoring Session!</span>
			</p>
			<div className='flex border-[1px] border-blue rounded-lg bg-[#E1E1F6] h-full '>
				<div className='h-full w-full p-4'>
					{/* <div className='h-full w-full bg-white'></div> */}
					<Canvas color={color}/>
				</div>
				<div className='flex flex-col justify-between px-4 py-8 gap-4 w-1/3'>
					<div>
						<p>Eric Wong (Tutor)</p>
						{stream && <video className='w-full border-2 border-blue border-solid' playsInline ref={userVideo} autoPlay />}
					</div>
					{/* <div>
						<p>Aiturgan Talant (Student)</p>
						{callAccepted && <video className='w-full border-2 border-blue border-solid' playsInline ref={partnerVideo} autoPlay />}
					</div> */}
				</div>
			</div>
			<div className='h-24 w-3/4 bg-blue mx-auto rounded-lg flex gap-8 items-center justify-center px-8'>
				<Button onClick={() => setColor('blue')} className='bg-white text-blue hover:bg-[#F2F2F2]'>
					Change color
				</Button>
				{cameraOn && <BsCameraVideo color='white' size={32} className='cursor-pointer' onClick={toggleCamera} />}
				{!cameraOn && <BsCameraVideoOff color='#E14040' size={32} className='cursor-pointer' onClick={toggleCamera} />}
				{micOn && <BsMic color='white' size={32} className='cursor-pointer' onClick={toggleMic} />}
				{!micOn && <BsMicMute color='#E14040' size={32} className='cursor-pointer' onClick={toggleMic} />}
				<Button onClick={() => endSession()} className='bg-white text-blue hover:bg-[#F2F2F2]'>
					End session
				</Button>
			</div>
		</div>
	);
};

export default Session;
