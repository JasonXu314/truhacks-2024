import api from '@/services/axiosConfig';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import Peer from 'simple-peer';

var wrtc = require('wrtc');

export const UserContext = createContext({
	name: '',
	tutor: false,
	peer: new Peer({ wrtc: wrtc }),
	setPeer: (e: Peer.Instance) => {}
});

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [name, setName] = useState('');
	const [tutor, setTutor] = useState(false);
	const [peer, setPeer] = useState<Peer.Instance>(new Peer({ wrtc: wrtc }));
	useEffect(() => {
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
	}, []);

	return <UserContext.Provider value={{ name, tutor, peer, setPeer }}>{children}</UserContext.Provider>;
};
