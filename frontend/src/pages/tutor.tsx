import SpringModal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import api from '@/services/axiosConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GrCamera, GrGroup, GrVolume } from 'react-icons/gr';

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
			router.push('/signin');
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

	if (init) {
		return;
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto h-full gap-10 justify-center'>
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
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='None' />
								</SelectTrigger>
								<SelectContent>
									{fieldList.map((field) => (
										<SelectItem value={field} key={field}>
											{field}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<p>Subject</p>
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='None' />
								</SelectTrigger>
								<SelectContent>
									{subjectList.map((subject) => (
										<SelectItem value={subject} key={subject}>
											{subject}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='h-full flex flex-col'>
						<p>Question</p>
						<Textarea className='h-full max-h-full resize-none focus:outline-none' placeholder='How do I calculate velocity?' id='question' />
					</div>
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

export default Tutor;
