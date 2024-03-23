import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Session = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [open, setOpen] = useState(false);

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

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full gap-10 justify-center'>
			<p className='text-text text-4xl font-bold'>
				Welcome, {name}, to your <span className='text-blue'>Tutoring Session!</span>
			</p>
			<div>
				<p className='text-2xl mb-3'>Tutor requests</p>
				<div className='flex flex-col border-[1px] border-blue rounded-lg bg-[#E1E1F6]'></div>
			</div>
		</div>
	);
};

export default Session;
