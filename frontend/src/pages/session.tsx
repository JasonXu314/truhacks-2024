import { Button } from '@/components/ui/button';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute } from 'react-icons/bs';
import Canvas from '@/components/Canvas';

const Session = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [open, setOpen] = useState(false);

	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);

	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!localStorage.getItem('token')) {
			// router.push('/signin');
		}

		api.get(`/api/users/me?token=${token}`)
			.then((resp) => {
				setName(resp.data.name);
				api.get('/api/fields')
					.then((resp2) => {
						console.log(resp2);
						setInit(false);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});

		setInit(false); // comment out later
	});

	const endSession = () => {};

	const toggleCamera = () => {
		if (cameraOn) {
			setCameraOn(false);
		} else {
			setCameraOn(true);
		}
	};

	const toggleMic = () => {
		if (micOn) {
			setMicOn(false);
		} else {
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
			<Button onClick={() => endSession()} className='bg-blue text-white hover:bg-[#3631C9] ml-auto'>
				End session
			</Button>
			<div className='flex border-[1px] border-blue rounded-lg bg-[#E1E1F6] h-full '>
				<div className='h-full w-full p-4'>
					{/* <div className='h-full w-full bg-white'></div> */}
                    <Canvas />
				</div>
				<div className='flex flex-col justify-between px-4 py-8 gap-4'>
					<div>
						<p>Eric Wong (Tutor)</p>
						<img src='/img/stocks.png' height={350} width={350}></img>
					</div>
					<div>
						<p>Aiturgan Talant (Student)</p>
						<img src='/img/stocks.png' height={350} width={350}></img>
					</div>
				</div>
			</div>
			<div className='h-28 w-3/4 bg-blue mx-auto rounded-lg flex gap-8 items-center justify-center'>
				{cameraOn && <BsCameraVideo color='white' size={32} className='cursor-pointer' onClick={toggleCamera} />}
				{!cameraOn && <BsCameraVideoOff color='white' size={32} className='cursor-pointer' onClick={toggleCamera} />}
				{micOn && <BsMic color='white' size={32} className='cursor-pointer' onClick={toggleMic} />}
				{!micOn && <BsMicMute color='white' size={32} className='cursor-pointer' onClick={toggleMic} />}
			</div>
		</div>
	);
};

export default Session;
