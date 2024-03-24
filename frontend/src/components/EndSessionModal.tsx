import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import BarLoader from './BarLoader';

const EndSessionModal = ({ isOpen, setIsOpen, tutor }: { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>>; tutor: boolean }) => {
	const router = useRouter();

	const endSession = () => {
		if (tutor) {
			router.push('/tutor');
		} else {
			router.push('/student');
		}

		setIsOpen(false);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className='bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer'
				>
					<motion.div
						initial={{ scale: 0, rotate: '12.5deg' }}
						animate={{ scale: 1, rotate: '0deg' }}
						exit={{ scale: 0, rotate: '0deg' }}
						onClick={(e) => e.stopPropagation()}
						className='bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden'
					>
						<FiAlertCircle className='text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24' />
						<div className='relative z-10'>
							<div className='bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto'>
								<FiAlertCircle />
							</div>
							<h3 className='text-3xl font-bold text-center mb-2'>End session?</h3>
							<p className='text-center mb-6'>Are you sure you want to end this session? You won&apos;t be able to come back.</p>

							<div className='flex gap-2'>
								<button
									onClick={() => setIsOpen(false)}
									className='bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded'
								>
									Nah, go back
								</button>

								<button
									onClick={endSession}
									className='bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded'
								>
									Yes, I&apos;m done!
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default EndSessionModal;
