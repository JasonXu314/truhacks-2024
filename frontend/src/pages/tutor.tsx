import SpringModal from '@/components/StudentModal';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserContext } from '@/contexts/UserContext';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
const Tutor = () => {
	const [init, setInit] = useState(true);
	const [subject, setSubject] = useState('');
	const [field, setField] = useState('');
	const [subjectList, setSubjectList] = useState([]);
	const [fieldList, setFieldList] = useState([]);
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const { name } = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/signin');
		}
		setInit(false);
	}, [router]);

	const acceptRequest = (id: number) => {
		api.post('/api/topics/tutor-join', {
			token: localStorage.getItem('token'),
			id: id.toString()
		})
			.then((resp) => {
				console.log(resp);
				router.push({ pathname: '/session', query: { data: resp.data.signal, otp: resp.data.otp } });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full gap-10 pt-[5%]'>
			<SpringModal isOpen={open} setIsOpen={setOpen} />
			<p className='text-text text-4xl font-bold'>
				Welcome, {name}, to your <span className='text-blue'>Tutor Hub!</span>
			</p>
			<div>
				<p className='text-2xl mb-3'>Tutor requests</p>
				<div className='flex flex-col border-[1px] border-blue rounded-lg bg-[#E1E1F6]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Question</TableHead>
								<TableHead>Student</TableHead>
								<TableHead>Subject</TableHead>
								<TableHead className='text-center'>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell className='font-medium'>How do I solve for x in 2x + 5 = 11?</TableCell>
								<TableCell>Eric Wong</TableCell>
								<TableCell>Physics 1</TableCell>
								<TableCell className='text-center'>
									<Button onClick={() => acceptRequest(1)} className='bg-blue text-white hover:bg-[#3631C9] mx-auto'>
										Accept
									</Button>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>How do I solve for x in 2x + 5 = 11?</TableCell>
								<TableCell>Eric Wong</TableCell>
								<TableCell>Physics 1</TableCell>
								<TableCell className='text-center'>
									<Button onClick={() => acceptRequest(139)} className='bg-blue text-white hover:bg-[#3631C9] mx-auto'>
										Accept
									</Button>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Tutor;
