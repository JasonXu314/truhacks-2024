import Canvas from '@/components/Canvas';
import SpringModal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsCameraVideo, BsCameraVideoOff, BsEraserFill, BsMic, BsMicMute } from 'react-icons/bs';
const Session = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [open, setOpen] = useState(true);
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);

	const [stream, setStream] = useState<MediaStream>();
	// const [callerSignal, setCallerSignal] = useState<string>('');
	// const [callAccepted, setCallAccepted] = useState(false);

	const [color, setColor] = useState('black');
	const [eraserEquipped, setEraserEquipped] = useState(false);

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

	const endSession = () => {
		navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
			setStream(stream);
			if (userVideo.current) {
				console.log('a');
				userVideo.current.srcObject = stream;
			}
			// setScreenStream(stream);
		});
	};

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

    const changeColor = (newColor: string) => {
        setColor(newColor);
        setEraserEquipped(false);
    }

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full min-h-screen gap-3 justify-center py-8'>
			<SpringModal isOpen={open} setIsOpen={setOpen} />
			<div className='absolute top-10 left-20'>
				<p className=''>EducateAll</p>
			</div>
			<p className='text-text text-4xl font-bold text-center'>
				Welcome, {name}, to your <span className='text-blue'>Tutoring Session!</span>
			</p>
			<div className='flex border-[1px] border-blue rounded-lg bg-[#E1E1F6] h-full '>
				<div className='h-full w-full p-4'>
					{/* <div className='h-full w-full bg-white'></div> */}
					<Canvas color={color} />
				</div>
				<div className='flex flex-col justify-between px-4 py-8 gap-4 w-1/3'>
					<div>
						<p>Eric Wong (Tutor)</p>
						{stream && <video className='w-full border-2 border-blue border-solid' muted playsInline ref={userVideo} autoPlay />}
					</div>
					{/* <div>
						<p>Aiturgan Talant (Student)</p>
						{callAccepted && <video className='w-full border-2 border-blue border-solid' playsInline ref={partnerVideo} autoPlay />}
					</div> */}
				</div>
			</div>
			<div className='h-24 w-3/4 bg-blue mx-auto rounded-lg flex gap-6 items-center justify-center px-8'>
				<div className='flex gap-2 border-r-[1.5px] h-full items-center px-8 flex-grow'>
					<div className={`${color === 'black' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-black rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('black')}
						></div>
					</div>

					<div className={`${color === '#ef4444' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-red-500 rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('#ef4444')}
						></div>
					</div>

					<div className={`${color === '#38bdf8' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-sky-400 rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('#38bdf8')}
						></div>
					</div>

					<div className={`${color === '#FF69B4' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-[#FF69B4] rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('#FF69B4')}
						></div>
					</div>

					<div className={`${color === '#18A804' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-[#18A804] rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('#18A804')}
						></div>
					</div>

					<div className={`${color === '#ff9a36' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-[#ff9a36] rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('#ff9a36')}
						></div>
					</div>

					<div className={`${color === '#f8ff00' && !eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`}>
						<div
							className='h-11 w-11 bg-[#f8ff00] rounded-lg cursor-pointer selected:border-[1px] border-white'
							onClick={() => changeColor('#f8ff00')}
						></div>
					</div>

					<div className={`${eraserEquipped && 'border-b-[2.5px]'} p-2 cursor-pointer`} onClick={() => setEraserEquipped(true)}>
						<BsEraserFill color='white' size={43}></BsEraserFill>
					</div>
				</div>

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
