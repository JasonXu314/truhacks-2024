import api from '@/services/axiosConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const router = useRouter();

	const createAccount = () => {
		api.post('/api/users/login', {
			email,
			password
		})
			.then((resp) => {
				localStorage.setItem('token', resp.data.token);
				router.push('/student');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<motion.div
			initial='initial'
			whileInView='animate'
			transition={{
				staggerChildren: 0.05
			}}
			viewport={{ once: true }}
			className='flex items-center justify-center pb-4 pt-20 md:py-20'
		>
			<div className='mx-auto my-auto max-w-lg px-4 md:pr-0'>
				<motion.h1 variants={primaryVariants} className='mb-2 text-center text-4xl font-semibold'>
					Sign in to your account
				</motion.h1>
				<motion.p variants={primaryVariants} className='mb-8 text-center'>
					Unlock Your Potential: Ask, Learn, Excel with EducateAll!
				</motion.p>
				{error && <p className='text-red-400 text-center font-bold'>{error}</p>}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createAccount();
					}}
					className='w-full'
				>
					<motion.div variants={primaryVariants} className='mb-2 w-full'>
						<label htmlFor='email-input' className='mb-1 inline-block text-sm font-medium'>
							Email<span className='text-red-600'>*</span>
						</label>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							id='email-input'
							type='email'
							placeholder='Enter your email'
							className='w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-none'
							required
						/>
					</motion.div>

					<motion.div variants={primaryVariants} className='mb-2 w-full'>
						<label htmlFor='password-input' className='mb-1 inline-block text-sm font-medium'>
							Password<span className='text-red-600'>*</span>
						</label>
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							id='password-input'
							type='password'
							placeholder='Enter your password'
							className='w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-none'
							required
						/>
					</motion.div>

					<motion.button
						variants={primaryVariants}
						whileTap={{
							scale: 0.985
						}}
						type='submit'
						className='mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700'
					>
						Sign in
					</motion.button>
					<motion.p variants={primaryVariants} className='text-xs'>
						Don&apos;t have an account?{' '}
						<Link className='text-indigo-600 underline' href='/signup'>
							Sign up
						</Link>
					</motion.p>
				</form>
			</div>
		</motion.div>
	);
};

const primaryVariants = {
	initial: {
		y: 25,
		opacity: 0
	},
	animate: {
		y: 0,
		opacity: 1
	}
};

export default SignIn;
