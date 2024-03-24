import api from '@/services/axiosConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiArrowUpRight, FiStar } from 'react-icons/fi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const SignUp = () => {
	return (
		<section className="grid min-h-screen grid-cols-1 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
			<Form />
			<SupplementalContent />
		</section>
	);
};

const Form = () => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState<any>();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');

	const router = useRouter();

	const createAccount = () => {
		if (password != confirmPassword) {
			setError("Passwords don't match");
			return;
		}
		api.post('/api/users/signup', {
			name,
			email,
			phone: phone.toString(),
			password,
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
			initial="initial"
			whileInView="animate"
			transition={{
				staggerChildren: 0.05,
			}}
			viewport={{ once: true }}
			className="flex items-center justify-center pb-4 pt-20 md:py-20"
		>
			<div className=" mx-auto my-auto max-w-lg  md:pr-0 ">
				<motion.div variants={primaryVariants} className="flex items-center flex-row gap-1 mb-3 pl-16">
					<img src="img/logo.png" alt="Logo EducateAll" width="38" height="38" className=""></img>
					<p className="font-bold text-2xl text-blue">EducateAll</p>
				</motion.div>
				<motion.h1 variants={primaryVariants} className="mb-1 text-darkText text-center text-3xl font-semibold">
					Create your account
				</motion.h1>
				<motion.p variants={primaryVariants} className="mb-5 text-m text-center">
					Start your education journey today!
				</motion.p>
				{error && <p className="text-red-400 text-center font-bold">{error}</p>}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createAccount();
					}}
					className="w-full"
				>
					<motion.div variants={primaryVariants} className="mb-2 w-full">
						<label htmlFor="name-input" className="mb-1 inline-block text-base font-medium">
							Name<span className="text-red-600">*</span>
						</label>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							id="name-input"
							placeholder="Enter your name"
							className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-none"
							required
						/>
					</motion.div>

					<motion.div variants={primaryVariants} className="mb-2 w-full">
						<label htmlFor="phone-input" className="mb-1 inline-block text-base font-medium">
							Phone Number<span className="text-red-600">*</span>
						</label>
						<PhoneInput
							defaultCountry="US"
							placeholder="Enter phone number"
							value={phone}
							onChange={setPhone}
							style={{
								width: '100%',
								borderRadius: '.5em',
								border: '1px rgb(203 213 225) solid',
								padding: '.625rem .375rem',
								backgroundColor: 'white',
							}}
							numberInputProps={{
								className: 'focus:outline-none',
							}}
						/>
					</motion.div>

					<motion.div variants={primaryVariants} className="mb-2 w-full">
						<label htmlFor="email-input" className="mb-1 inline-block text-base font-medium">
							Email<span className="text-red-600">*</span>
						</label>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							id="email-input"
							type="email"
							placeholder="Enter your email"
							className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-none"
							required
						/>
					</motion.div>

					<motion.div variants={primaryVariants} className="mb-2 w-full">
						<label htmlFor="password-input" className="mb-1 inline-block text-base font-medium">
							Password<span className="text-red-600">*</span>
						</label>
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							id="password-input"
							type="password"
							placeholder="Enter your password"
							className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-none"
							required
						/>
					</motion.div>

					<motion.div variants={primaryVariants} className="mb-4 w-full">
						<label htmlFor="rt-password-input" className="mb-1 inline-block text-base font-medium">
							Confirm Password<span className="text-red-600">*</span>
						</label>
						<input
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							id="rt-password-input"
							type="password"
							placeholder="Confirm your password"
							className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-none"
							required
						/>
					</motion.div>

					<motion.button
						variants={primaryVariants}
						whileTap={{
							scale: 0.985,
						}}
						type="submit"
						className="mt-3 mb-2 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors  text-base hover:bg-indigo-700"
					>
						Sign up
					</motion.button>
					<motion.p variants={primaryVariants} className="text-s text-center">
						Already have an account?{' '}
						<Link className="text-indigo-600 underline hover:scale-105" href="/signin">
							Sign in
						</Link>
					</motion.p>
				</form>
			</div>
		</motion.div>
	);
};

const SupplementalContent = () => {
	return (
		<div className="group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem]  bg-slate-950 md:h-[calc(100vh_-_2rem)]">
			<img
				alt="An example image"
				src="img/student.jpg"
				className="h-full w-full bg-blue object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50 opacity-75"
			/>

			<div className="absolute right-2 top-4 z-10">
				<FiArrowUpRight className="rotate-45 text-6xl text-indigo-200 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
			</div>

			<motion.div
				initial="initial"
				whileInView="animate"
				transition={{
					staggerChildren: 0.05,
				}}
				viewport={{ once: true }}
				className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8"
			>
				<motion.h2 className="mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl" variants={primaryVariants}>
					Bringing Technology to
					<br />
					Students All Over the World
				</motion.h2>
				<motion.p variants={primaryVariants} className="mb-6 max-w-md text-sm text-slate-300">
					EducateAll is a platform that enables students to find personilized tutoring for free. Created by students for students. Become a part fo
					the community of education changemakers!
				</motion.p>
				{/* <div className="flex items-center gap-4">
					<div className="flex items-center">
						<motion.img
							variants={avatarVariants}
							className="h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
							alt="A placeholder testimonial image"
							src="/imgs/head-shots/1.jpg"
						/>
						<motion.img
							variants={avatarVariants}
							className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
							alt="A placeholder testimonial image"
							src="/imgs/head-shots/2.jpg"
						/>
						<motion.img
							variants={avatarVariants}
							className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
							alt="A placeholder testimonial image"
							src="/imgs/head-shots/3.jpg"
						/>
						<motion.img
							variants={avatarVariants}
							className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
							alt="A placeholder testimonial image"
							src="/imgs/head-shots/4.jpg"
						/>
						<motion.img
							variants={avatarVariants}
							className="-ml-4 h-8 w-8 rounded-full border-[1px] border-slate-100 object-cover shadow-inner"
							alt="A placeholder testimonial image"
							src="/imgs/head-shots/6.jpg"
						/>
					</div>
					<div>
						<motion.div variants={primaryVariants} className="flex gap-0.5">
							<FiStar className="fill-yellow-300 text-sm text-yellow-300" />
							<FiStar className="fill-yellow-300 text-sm text-yellow-300" />
							<FiStar className="fill-yellow-300 text-sm text-yellow-300" />
							<FiStar className="fill-yellow-300 text-sm text-yellow-300" />
							<FiStar className="fill-yellow-300 text-sm text-yellow-300" />
							<span className="ml-2 text-sm text-white">5.0</span>
						</motion.div>
						<motion.p variants={primaryVariants} className="text-xs text-slate-300">
							more than 3,000 lines of code
						</motion.p>
					</div>
				</div> */}
			</motion.div>
		</div>
	);
};

const primaryVariants = {
	initial: {
		y: 25,
		opacity: 0,
	},
	animate: {
		y: 0,
		opacity: 1,
	},
};

const avatarVariants = {
	initial: {
		x: 10,
		opacity: 0,
	},
	animate: {
		x: 0,
		opacity: 1,
	},
};

export default SignUp;
