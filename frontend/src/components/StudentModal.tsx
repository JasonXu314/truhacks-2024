import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import BarLoader from './BarLoader';
import { useRouter } from 'next/router';

const StudentModal = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
    const router = useRouter();

    const cancelRequest = () => {
        router.push('/student');
        setIsOpen(false);
    }

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
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
							<h3 className='text-3xl font-bold text-center mb-2'>Tutor requested!</h3>
							<p className='text-center mb-6'>Please wait patiently until a tutor has accepted your request.</p>
							<div className='h-20 mb-8 grid place-content-center '>
								<BarLoader></BarLoader>
							</div>

							<div className='flex gap-2'>
								<button
									onClick={cancelRequest}
									className='bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded'
								>
									Cancel request
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default StudentModal;
