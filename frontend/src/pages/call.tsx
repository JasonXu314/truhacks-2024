import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

const Call = () => {
	const [stream, setStream] = useState<MediaStream>();
	const [callerSignal, setCallerSignal] = useState<string>('');
	const [callAccepted, setCallAccepted] = useState(false);

	const userVideo = useRef<any>(null);
	const partnerVideo = useRef<any>(null);

	const [test, setTest] = useState('');

	const [tempPeer, setTempPeer] = useState<Peer.Instance>();

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream);
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
		});
	}, []);

	function callPeer(id: any) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		});
		setTempPeer(peer);

		peer.on('signal', (data) => {
			console.log(data);
			setTest(JSON.stringify(data));
		});

		peer.on('stream', (stream) => {
			if (partnerVideo.current) {
				partnerVideo.current.srcObject = stream;
			}
		});
	}

	function acceptAgain() {
		setCallAccepted(true);
		tempPeer!.signal(JSON.parse(test));
	}

	function acceptCall() {
		setCallAccepted(true);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		});
		peer.on('signal', (data) => {
			console.log(data);
			setTest(JSON.stringify(data));
		});

		peer.on('stream', (stream) => {
			console.log('dasdasda');
			partnerVideo.current.srcObject = stream;
		});

		peer.signal(JSON.parse(callerSignal));
	}

	return (
		<div className='h-screen w-full flex flex-col'>
			<div className='flex w-full'>
				{stream && <video className='w-1/2 h-1/2 border-2 border-blue border-solid' playsInline muted ref={userVideo} autoPlay />}
				{callAccepted && <video className='w-1/2 h-1/2 border-2 border-blue border-solid' playsInline ref={partnerVideo} autoPlay />}
			</div>
			<div className='flex w-full'>
				<button onClick={() => callPeer('123')}>das</button>
			</div>
			<input value={callerSignal} onChange={(e) => setCallerSignal(e.target.value)} className='text-black'></input>
			<button onClick={() => acceptCall()}>accept call</button>

			<textarea value={test} onChange={(e) => setTest(e.target.value)} className='text-black'></textarea>

			<button onClick={() => acceptAgain()}>accept call AGAIN</button>
		</div>
	);
};

export default Call;
