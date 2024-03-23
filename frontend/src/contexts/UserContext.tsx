import api from '@/services/axiosConfig';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import Peer from 'simple-peer';

export const UserContext = createContext({
	name: '',
	tutor: false,
	peer: new Peer()
});

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [name, setName] = useState('');
	const [tutor, setTutor] = useState(false);
	const [peer, setPeer] = useState<Peer.Instance>(new Peer());
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			api.get(`/api/auth/me?token=${token}`).then((resp) => {
                setName(resp.data.name);
                setTutor(resp.data.verifiedTutor)
            });
		}
	}, [localStorage.getItem('token')]);

	return <UserContext.Provider value={{ name, tutor, peer }}>{children}</UserContext.Provider>;
};
