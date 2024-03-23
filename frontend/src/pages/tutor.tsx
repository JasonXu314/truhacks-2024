import SpringModal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const Tutor = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [subject, setSubject] = useState('');
	const [field, setField] = useState('');
	const [subjectList, setSubjectList] = useState([]);
	const [fieldList, setFieldList] = useState([]);
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

	const acceptRequest = () => {};

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full gap-10 justify-center'>
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
									<Button onClick={() => acceptRequest()} className='bg-blue text-white hover:bg-[#3631C9] mx-auto'>
										Accept
									</Button>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>
									How do I solve for x in 2x + 5 = 11?
								</TableCell>
								<TableCell>Aiturgan Talant</TableCell>
								<TableCell>Algebra 1</TableCell>
								<TableCell className='text-center'>
									<Button onClick={() => acceptRequest()} className='bg-blue text-white hover:bg-[#3631C9] mx-auto'>
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
