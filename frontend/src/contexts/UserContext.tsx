import api from '@/services/axiosConfig';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

export const UserContext = createContext({
	name: '',
	tutor: false,
	update: () => {}
});

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [name, setName] = useState('');
	const [tutor, setTutor] = useState(false);

	useEffect(() => {
		update();
	}, []);

	const update = () => {
		const token = localStorage.getItem('token');
		if (token) {
			api.get(`/api/users/me?token=${token}`)
				.then((resp) => {
					setName(resp.data.name);
					setTutor(resp.data.verifiedTutor);
				})
				.catch((err) => {
					console.log(err);
					// localStorage.removeItem('token');
				});
		}
	};

	return <UserContext.Provider value={{ name, tutor, update }}>{children}</UserContext.Provider>;
};
