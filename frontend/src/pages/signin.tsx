import { UserContext } from '@/contexts/UserContext';
import api from '@/services/axiosConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import 'react-phone-number-input/style.css';

const SignIn = () => {
	return (
		<section className='grid min-h-screen grid-cols-1 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]'>
			<Form />
			<SupplementalContent />
		</section>
	);
};

const Form = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const router = useRouter();
	const { update } = useContext(UserContext);

	const createAccount = () => {
		api.post('/api/users/login', {
			email,
			password
		})
			.then((resp) => {
				localStorage.setItem('token', resp.data.token);
				update();
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
			className='flex items-center justify-center pb-4 h-full pt-0'
		>
			<div className='mx-auto my-auto w-full max-w-lg py-10 px-16 items-center flex flex-col rounded-lg justify-center'>
				<motion.div variants={primaryVariants} className='flex items-center flex-row gap-1 mb-3'>
					<img src='img/logo.png' alt='Logo EducateAll' width='38' height='38' className=''></img>
					<p className='font-bold text-2xl text-blue'>EducateAll</p>
				</motion.div>
				<motion.p variants={primaryVariants} className='mb-2 text-darkText text-3xl font-semibold text-center'>
					Sign in into your account
				</motion.p>
				<motion.p variants={primaryVariants} className='mb-6 text-darkText text-lg text-center'>
					Spreading knowledge to everyone!
				</motion.p>
				{/*
				bg-white border-2 shadow-lg border-blue
				*/}
				{error && <p className='text-red-400 text-center font-bold'>{error}</p>}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createAccount();
					}}
					className='w-full'
				>
					<motion.div variants={primaryVariants} className='mb-2 w-full'>
						<label htmlFor='email-input' className='mb-1 inline-block text-base font-medium'>
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
						<label htmlFor='password-input' className='mb-1 inline-block text-base font-medium'>
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
						className='mb-3 mt-4 w-full rounded bg-blue px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 hover:scale-150 '
					>
						Sign in
					</motion.button>
					<motion.p variants={primaryVariants} className='text-s text-center'>
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

const SupplementalContent = () => {
	return (
		<div className='group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem]  bg-slate-950 md:h-[calc(100vh_-_2rem)]'>
			<img
				alt='An example image'
				src='img/student.jpg'
				className='h-full w-full bg-blue object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50 opacity-75'
			/>

			<div className='absolute right-2 top-4 z-10'>
				<FiArrowUpRight className='rotate-45 text-6xl text-indigo-200 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100' />
			</div>

			<motion.div
				initial='initial'
				whileInView='animate'
				transition={{
					staggerChildren: 0.05
				}}
				viewport={{ once: true }}
				className='absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8'
			>
				<motion.h2 className='mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl' variants={primaryVariants}>
					Bringing Technology to
					<br />
					Students All Over the World
				</motion.h2>
				<motion.p variants={primaryVariants} className='mb-6 max-w-md text-sm text-slate-300'>
					EducateAll is a platform that enables students to find personilized tutoring for free. Created by students for students. Become a part of
					the community of education changemakers!
				</motion.p>
			</motion.div>
		</div>
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

const avatarVariants = {
	initial: {
		x: 10,
		opacity: 0
	},
	animate: {
		x: 0,
		opacity: 1
	}
};

export default SignIn;
