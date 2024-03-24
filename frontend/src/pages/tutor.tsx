import SpringModal from '@/components/StudentModal';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserContext } from '@/contexts/UserContext';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

interface IField {
	id: number;
	name: string;
}

interface IAuthor {
	id: string;
	name: string;
}

interface IRequest {
	id: number;
	userId: string;
	description: string;
	author: IAuthor;
	fields: IField[];
}

const Tutor = () => {
	const [init, setInit] = useState(true);
	const [requestList, setRequestList] = useState<IRequest[]>([]);
	const [open, setOpen] = useState(false);

	const router = useRouter();

	const { name } = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/signin');
		}
		api.get('/api/topics').then((resp) => {
			console.log(resp.data);
			setRequestList(resp.data);
		});
		setInit(false);
	}, [router]);

	const acceptRequest = (id: number, author: string) => {
		api.post('/api/topics/tutor-join', {
			token: localStorage.getItem('token'),
			id: id.toString()
		})
			.then((resp) => {
				console.log(resp);
				router.push({ pathname: '/session', query: { data: resp.data.signal, otp: resp.data.otp, author: author } });
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
							{requestList.map((request) => (
								<TableRow key={request.id}>
									<TableCell className='font-medium'>{request.description}</TableCell>
									<TableCell>{request.author.name}</TableCell>
									<TableCell>{request.fields[0].name}</TableCell>
									<TableCell className='text-center'>
										<Button onClick={() => acceptRequest(request.id, request.author.name)} className='bg-blue text-white hover:bg-[#3631C9] mx-auto'>
											Accept
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Tutor;
