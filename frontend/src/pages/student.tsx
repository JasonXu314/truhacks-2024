import SpringModal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IField, ISubject } from '@/interfaces/interfaces';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GrCamera, GrGroup, GrVolume } from 'react-icons/gr';

const Student = () => {
	const [name, setName] = useState('');
	const [init, setInit] = useState(true);
	const [subject, setSubject] = useState(1);
	const [field, setField] = useState(1);
	const [subjectList, setSubjectList] = useState<ISubject[] | undefined>([]);
	const [fieldList, setFieldList] = useState<IField[]>([]);
	const [open, setOpen] = useState(false);
	const [question, setQuestion] = useState('');

	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/signin');
		}

		api.get(`/api/users/me?token=${token}`)
			.then((resp) => {
				setName(resp.data.name);
				api.get('/api/fields')
					.then((resp2) => {
						setFieldList(resp2.data);
						setSubjectList(resp2.data[0].subjects);
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
	}, [router]);

	const requestTutor = () => {
		api.post('/api/topics/request', {
			description: question,
			fields: [field],
			subjects: [subject]
		})
			.then((resp) => {
				console.log(resp);
				setOpen(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full gap-10 justify-center '>
			<SpringModal isOpen={open} setIsOpen={setOpen} />
			<p className='text-text text-4xl font-bold'>
				Welcome, {name}, to your <span className='text-blue'>Student Hub!</span>
			</p>
			<div className='flex border-[1px] border-blue rounded-lg h-[55%] bg-[#E1E1F6]'>
				<div className='flex flex-col border-r-[1px] border-r-blue w-[90%] p-8 gap-5 h-full'>
					<p className='text-4xl text-blue font-medium'>Ask your question...</p>
					<div className='flex gap-5'>
						<div>
							<p>Field</p>
							<Select
								onValueChange={(e) => {
									let id = Number(e);
									setField(id);
									setSubject(fieldList[id - 1].subjects[0].id);
									setSubjectList(fieldList.find((el) => el.id === id)?.subjects);
								}}
								value={field.toString()}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='None' />
								</SelectTrigger>
								<SelectContent>
									{fieldList.map((field) => (
										<SelectItem value={field.id.toString()} key={field.id}>
											{field.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<p>Subject</p>
							<Select
								onValueChange={(e) => {
									let id = Number(e);
									setSubject(id);
								}}
								value={subject.toString()}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='None' />
								</SelectTrigger>
								<SelectContent>
									{subjectList?.map((subject) => (
										<SelectItem value={subject.id.toString()} key={subject.id}>
											{subject.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='h-full flex flex-col'>
						<p>Question</p>
						<Textarea
							className='h-full max-h-full resize-none focus:outline-none'
							placeholder='How do I calculate velocity?'
							id='question'
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
						/>
					</div>
					<Button onClick={() => requestTutor()} className='bg-blue text-white w-36 h-[5em] hover:bg-[#3631C9] mx-auto'>
						Request
					</Button>
				</div>
				<div className='flex flex-col items-center w-2/5 p-8 justify-around'>
					<p className='text-text text-4xl'>Guidelines</p>
					<div className='flex items-center gap-6'>
						<GrCamera color='#6C63FF' size={56} />
						<p className='text-textSimple text-lg'>Turn your camera on and check your surroundings</p>
					</div>
					<div className='flex items-center gap-6'>
						<GrVolume color='#6C63FF' size={48} />
						<p className='text-textSimple text-lg'>Check your sound and try to sit in a quiet area</p>
					</div>
					<div className='flex items-center gap-6'>
						<GrGroup color='#6C63FF' size={48} />
						<p className='text-textSimple text-lg'>Be respectful and keep the tutor&apos;s time in mind</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Student;
