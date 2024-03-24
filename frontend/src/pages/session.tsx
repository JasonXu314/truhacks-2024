import Canvas from '@/components/Canvas';
import EndSessionModal from '@/components/EndSessionModal';
import StudentModal from '@/components/StudentModal';
import TutorModal from '@/components/TutorModal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserContext } from '@/contexts/UserContext';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsCameraVideo, BsCameraVideoOff, BsEraserFill, BsMic, BsMicMute } from 'react-icons/bs';
import { LuScreenShare, LuScreenShareOff } from 'react-icons/lu';
import Peer from 'simple-peer';
const Session = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [open, setOpen] = useState(true);
	const [openEndModal, setOpenEndModal] = useState(false);
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);
	const [screenShareOn, setScreenShareOn] = useState(false);

	const [stream, setStream] = useState<MediaStream>();
	const [callAccepted, setCallAccepted] = useState(false);

	const [color, setColor] = useState('black');
	const [eraserEquipped, setEraserEquipped] = useState(false);

	const userVideo = useRef<any>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const partnerVideo = useRef<any>(null);

	const router = useRouter();
	const { tutor } = useContext(UserContext);

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			router.push('/signin');
		}

		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream);
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
			setInit(false);
		});
	}, [init]);

	useEffect(() => {
		// if (tutor) {
		// 	acceptCall();
		// } else {
		// 	callPeer();
		// }

		if (!router.query.otp) {
			console.error('no OTP');
		} else {
			const socket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_URL!.replace('http', 'ws')}/gateway`);

            let peer;
            if (tutor) {
                peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: stream
                });
            }
            else {
                peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: stream
                });
            }

            peer.on('signal', (data) => {
                console.log(data);
                socket.send(JSON.stringify({ event: 'SIGNAL', data: { signal: JSON.stringify(data) } }));
            });
    
            peer.on('stream', (stream) => {
                partnerVideo.current.srcObject = stream;
            });


			socket.addEventListener('open', () => {
				console.log('socket open');

				socket.send(JSON.stringify({ event: 'CLAIM', data: { otp: router.query.otp } }));

				socket.addEventListener(
					'message',
					(evt) => {
						const msg = JSON.parse(evt.data);

						if (msg.type === 'CLAIM_ACK') {
							console.log('claim success');

							socketRef.current = socket;
						}
                        else if (msg.type === 'SIGNAL') {
                            console.log(msg);
                            console.log(msg.data.signal)
                        }
					},
					{ once: true }
				);
			});

			socket.addEventListener('error', (evt) => {
				console.log('socket error', evt);
			});

			socket.addEventListener('close', (evt) => {
				console.log('socket died', evt);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const endSession = () => {
		setOpenEndModal(true);
	};

	const toggleCamera = () => {
		if (cameraOn && stream) {
			setCameraOn(false);
			stream.getVideoTracks()[0].enabled = false;
		} else if (stream) {
			setCameraOn(true);
			stream.getVideoTracks()[0].enabled = true;
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
	};

	const shareScreen = () => {
		if (screenShareOn) {
			navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
				setStream(stream);
				if (userVideo.current) {
					userVideo.current.srcObject = stream;
				}
			});
		} else {
			navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
				setStream(stream);
				if (userVideo.current) {
					userVideo.current.srcObject = stream;
				}
			});
		}
		setScreenShareOn(!screenShareOn);
	};

	// peer stuff
	const callPeer = () => {
		const token = localStorage.getItem('token');

		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		});

		peer.on('signal', (data) => {
			console.log(data);

            socketRef.current?.send(JSON.stringify(data));

			// api.post('/api/topics/offer', { token, data: JSON.stringify(data) })
			// 	.then((res) => {
			// 		const peerOffer = res.data;
			// 		console.log(peerOffer);
			// 		peer.signal(peerOffer);
			// 		setCallAccepted(true);
			// 		setOpen(false);
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	});
		});

		peer.on('stream', (stream) => {
			if (partnerVideo.current) {
				partnerVideo.current.srcObject = stream;
			}
		});
	};

	const acceptCall = () => {
		const token = localStorage.getItem('token');

		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		});
		peer.on('signal', (data) => {
			console.log(data);
			api.post('/api/topics/offer', {
				data: JSON.stringify(data),
				token
			}).then(() => {
				setCallAccepted(true);
				setOpen(false);
			});
		});

		peer.on('stream', (stream) => {
			partnerVideo.current.srcObject = stream;
		});

		// const { data } = router.query;

		// if (typeof data === 'string') {
		// 	console.log(JSON.parse(data));
		// 	peer.signal(JSON.parse(data));
		// }
	};

	if (init) {
		return;
	}

	return (
		<TooltipProvider delayDuration={150}>
			<div className='flex flex-col w-3/5 mx-auto h-full min-h-screen gap-3 justify-center py-8'>
				{tutor === false && <StudentModal isOpen={open} setIsOpen={setOpen} />}
				{tutor === true && <TutorModal isOpen={open} setIsOpen={setOpen} />}
				<EndSessionModal isOpen={openEndModal} setIsOpen={setOpenEndModal} tutor={tutor}></EndSessionModal>
				<div className='flex items-center flex-row gap-2 absolute top-6 left-10'>
					<img src='img/logo.png' alt='Logo EducateAll' width='36' height='36'></img>
					<p className='font-bold text-xl text-blue'>EducateAll</p>
				</div>
				<p className='text-text text-4xl font-bold text-center'>
					Welcome, {name}, to your <span className='text-blue'>Tutoring Session!</span>
				</p>
				<div className='flex border-[1px] border-blue rounded-lg bg-[#E1E1F6] h-screen z-[20]'>
					<div className='h-full w-full p-4'>
						{/* <div className='h-full w-full bg-white'></div> */}
						<Canvas color={color} eraserEquipped={eraserEquipped} socketRef={socketRef} />
					</div>
					<div className='flex flex-col justify-between px-4 py-8 gap-4 w-1/3'>
						<div>
							<p>Eric Wong (Tutor)</p>
							{stream && <video className='w-full border-2 border-blue border-solid' muted playsInline ref={userVideo} autoPlay />}
						</div>
						<div>
							<p>Aiturgan Talant (Student)</p>
							{callAccepted && <video className='w-full border-2 border-blue border-solid' playsInline ref={partnerVideo} autoPlay />}
						</div>
					</div>
				</div>
				<div className='h-24 w-[95%] bg-blue mx-auto rounded-lg flex gap-6 items-center justify-center px-8'>
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

					{!screenShareOn && (
						<Tooltip>
							<TooltipTrigger>
								<LuScreenShare color='white' size={32} className='cursor-pointer flex-shrink-0' onClick={shareScreen}></LuScreenShare>
							</TooltipTrigger>
							<TooltipContent>
								<p>Share screen</p>
							</TooltipContent>
						</Tooltip>
					)}
					{screenShareOn && (
                        <Tooltip>
                        <TooltipTrigger>
                        <LuScreenShareOff color='white' size={32} className='cursor-pointer flex-shrink-0' onClick={shareScreen}></LuScreenShareOff>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Stop sharing</p>
                        </TooltipContent>
                    </Tooltip>
						
					)}
					{cameraOn && <BsCameraVideo color='white' size={32} className='cursor-pointer flex-shrink-0' onClick={toggleCamera} />}
					{!cameraOn && <BsCameraVideoOff color='#E14040' size={32} className='cursor-pointer flex-shrink-0' onClick={toggleCamera} />}
					{micOn && <BsMic color='white' size={32} className='cursor-pointer flex-shrink-0' onClick={toggleMic} />}
					{!micOn && <BsMicMute color='#E14040' size={32} className='cursor-pointer flex-shrink-0' onClick={toggleMic} />}
					<Button onClick={() => endSession()} className='bg-white text-blue hover:bg-[#F2F2F2]'>
						End session
					</Button>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default Session;
