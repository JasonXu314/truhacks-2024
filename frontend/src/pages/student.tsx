import { useState } from 'react';
import api from '@/services/axiosConfig';

const Student = () => {
	const [name, setName] = useState('');
	return (
		<div className='flex flex-col w-4/5 mx-auto justify-evenly h-full'>
			<p className='text-text text-4xl font-bold'>
				Welcome, {name}, to your <span className='text-blue'>Student Hub!</span>
			</p>
			<div className='flex border-[1px] border-blue rounded-lg h-1/2'>
				<div className='flex flex-col'>
					<p>Ask your question...</p>
					<p>Subject</p>
				</div>
				<div className='flex flex-col items-center'></div>
			</div>
		</div>
	);
};

export default Student;
