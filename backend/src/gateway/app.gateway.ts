import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { TopicRequest, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { WebSocket } from 'ws';
import { ClaimAcknowledgeDTO, ClaimCodeDTO, ClientErrorDTO, EavesdropDTO, NewStrokeDTO } from '../gateway.dtos';

interface UserData extends Pick<User, 'id' | 'name'> {
	socket: WebSocket;
}

interface Session {
	tutor: UserData | null;
	student: UserData | null;
	claims: Map<string, (client: WebSocket) => UserData>;
	topic: TopicRequest;
	offer: string | null;
	resolver: ((offer: string) => void) | null;
}

@Injectable()
@WebSocketGateway({ path: '/gateway' })
export class AppGateway implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket> {
	private readonly logger = new ConsoleLogger('Gateway');
	private readonly sockTimeouts: Map<WebSocket, NodeJS.Timeout> = new Map();
	private sessions: Session[] = [];

	private readonly eavesdroppers: WebSocket[][] = [];

	public allocateSession(topic: TopicRequest, author: Pick<User, 'id' | 'name'>): string {
		const session: Session = { tutor: null, student: null, claims: new Map(), topic, offer: null, resolver: null };
		this.sessions.push(session);

		const otp = randomBytes(64).toString('hex');

		const timeout = setTimeout(() => {
			session.claims.delete(otp);
		}, 2500);

		session.claims.set(otp, (client: WebSocket) => {
			clearTimeout(timeout);

			if (this.sockTimeouts.has(client)) {
				clearTimeout(this.sockTimeouts.get(client));
			}

			session.claims.delete(otp);

			const userData: UserData = { ...author, socket: client };
			session.student = userData;

			return userData;
		});

		this.eavesdroppers[topic.id] = [];

		return otp;
	}

	public createTutorOTP(topicId: number, user: Pick<User, 'id' | 'name'>): { signal: string; otp: string } {
		const otp = randomBytes(64).toString('hex');
		const session = this.sessions.find((s) => s.topic.id === topicId);

		if (!session) {
			throw new BadRequestException('Bad topic');
		}

		const timeout = setTimeout(() => {
			session.claims.delete(otp);
		}, 2500);

		session.claims.set(otp, (client: WebSocket) => {
			clearTimeout(timeout);

			if (this.sockTimeouts.has(client)) {
				clearTimeout(this.sockTimeouts.get(client));
			}

			session.claims.delete(otp);

			const userData: UserData = { ...user, socket: client };
			session.tutor = userData;

			return userData;
		});

		return { otp, signal: session.offer! };
	}

	// Returns promise for return offer
	public async makeOffer(id: string, data: string): Promise<string> {
		for (const session of this.sessions) {
			if (session.student?.id === id) {
				if (session.tutor !== null) {
					session.resolver?.(data);

					return session.offer!;
				} else {
					return new Promise((resolve) => {
						session.resolver = resolve;
						session.offer = data;
					});
				}
			} else if (session.tutor?.id === id) {
				if (session.student !== null) {
					session.resolver?.(data);

					return session.offer!;
				} else {
					return new Promise((resolve) => {
						session.resolver = resolve;
						session.offer = data;
					});
				}
			}
		}

		throw new BadRequestException('Bad offer');
	}

	public handleConnection(client: WebSocket) {
		const timeout = setTimeout(() => {
			client.close(1008);
			this.sockTimeouts.delete(client);
		}, 2500);

		this.sockTimeouts.set(client, timeout);
	}

	public handleDisconnect(client: WebSocket) {
		for (const room of this.sessions) {
			if (client === room.tutor?.socket) {
				this.logger.log(`Tutor ${room.tutor.name} disconnected`);
				room.tutor = null;
				room.student?.socket.send(JSON.stringify({ type: 'ROOM_CLOSE' }));
				room.student?.socket.close(1000);
				return;
			} else if (client === room.student?.socket) {
				this.logger.log(`Student ${room.student.name} disconnected`);
				room.student = null;
				return;
			}
		}

		for (const topic of this.eavesdroppers) {
			if (topic) {
				let idx;

				if ((idx = topic.indexOf(client)) !== -1) {
					topic.splice(idx, 1);
					return;
				}
			}
		}

		this.logger.warn('Client disconnect did not find socket');
	}

	@SubscribeMessage('CLAIM')
	public async claimCode(@MessageBody() { otp }: ClaimCodeDTO, @ConnectedSocket() client: WebSocket): Promise<ClaimAcknowledgeDTO | ClientErrorDTO> {
		this.logger.log(`claiming ${otp}`);
		for (const session of this.sessions) {
			if (session.claims.has(otp)) {
				const claim = session.claims.get(otp)!;

				const user = claim(client);
				this.logger.log(`claimed ${otp} for ${user.name}`);

				// caution: reference equality
				if (user === session.student) {
					if (session.tutor !== null) {
						setImmediate(() => session.tutor!.socket.send(JSON.stringify({ type: 'JOIN', user: this._pruneSocket(user) })));
					}
				} else if (user === session.tutor) {
					if (session.student !== null) {
						setImmediate(() => session.student!.socket.send(JSON.stringify({ type: 'JOIN', user: this._pruneSocket(user) })));
					}
				} else {
					this.logger.warn('not tutor or student');
					setImmediate(() => client.close(1008));
					return { type: 'CLIENT_ERROR' };
				}

				return { type: 'CLAIM_ACK' };
			}
		}

		setImmediate(() => client.close(1008));
		return { type: 'CLIENT_ERROR' };
	}

	@SubscribeMessage('EAVESDROP')
	public async eavesdrop(@MessageBody() { id }: EavesdropDTO, @ConnectedSocket() client: WebSocket): Promise<void | ClientErrorDTO> {
		this.logger.log(`eavesdropping ${id}`);

		if (this.eavesdroppers[id] !== undefined) {
			this.eavesdroppers[id].push(client);
		} else {
			this.eavesdroppers[id] = [client];
		}

		if (this.sockTimeouts.has(client)) {
			clearTimeout(this.sockTimeouts.get(client));
		}
	}

	@SubscribeMessage('NEW_STROKE')
	public async newStroke(@MessageBody() { id, pts, color }: NewStrokeDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (data === null) {
			setImmediate(() => client.close(1008));
			return { type: 'CLIENT_ERROR' };
		} else {
			const msg = JSON.stringify({ type: 'NEW_STROKE', id, pts, color });

			if (data.user === data.session.tutor) {
				data.session.student?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else if (data.user === data.session.student) {
				data.session.tutor?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else {
				this.logger.warn('not tutor or student');
				setImmediate(() => client.close(1008));
				return { type: 'CLIENT_ERROR' };
			}
		}
	}

	@SubscribeMessage('EXTEND')
	public async extend(@MessageBody() pt: [number, number], @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (data === null) {
			setImmediate(() => client.close(1008));
			return { type: 'CLIENT_ERROR' };
		} else {
			const msg = JSON.stringify({ type: 'EXTEND', pt });

			if (data.user === data.session.tutor) {
				data.session.student?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else if (data.user === data.session.student) {
				data.session.tutor?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else {
				this.logger.warn('not tutor or student');
				setImmediate(() => client.close(1008));
				return { type: 'CLIENT_ERROR' };
			}
		}
	}

	@SubscribeMessage('END_STROKE')
	public async endStroke(@ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (data === null) {
			setImmediate(() => client.close(1008));
			return { type: 'CLIENT_ERROR' };
		} else {
			const msg = JSON.stringify({ type: 'END_STROKE' });

			if (data.user === data.session.tutor) {
				data.session.student?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else if (data.user === data.session.student) {
				data.session.tutor?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else {
				this.logger.warn('not tutor or student');
				setImmediate(() => client.close(1008));
				return { type: 'CLIENT_ERROR' };
			}
		}
	}

	@SubscribeMessage('DELETE_STROKE')
	public async deleteStroke(@MessageBody() id: string, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (data === null) {
			setImmediate(() => client.close(1008));
			return { type: 'CLIENT_ERROR' };
		} else {
			const msg = JSON.stringify({ type: 'DELETE_STROKE', id });

			if (data.user === data.session.tutor) {
				data.session.student?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else if (data.user === data.session.student) {
				data.session.tutor?.socket.send(msg);
				this.eavesdroppers[data.session.topic.id]?.forEach((eve) => eve.send(msg));
			} else {
				this.logger.warn('not tutor or student');
				setImmediate(() => client.close(1008));
				return { type: 'CLIENT_ERROR' };
			}
		}
	}

	@SubscribeMessage('SIGNAL')
	public async signal(@MessageBody() signal: string, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (data === null) {
			setImmediate(() => client.close(1008));
			return { type: 'CLIENT_ERROR' };
		} else {
			const msg = JSON.stringify({ type: 'SIGNAL', signal });

			if (data.user === data.session.tutor) {
				data.session.student?.socket.send(msg);
			} else if (data.user === data.session.student) {
				data.session.tutor?.socket.send(msg);
			} else {
				this.logger.warn('not tutor or student');
				setImmediate(() => client.close(1008));
				return { type: 'CLIENT_ERROR' };
			}
		}
	}

	private _pruneSocket<T extends Record<string, any>>(obj: T): { [K in keyof T]: T[K] extends WebSocket ? never : T[K] } {
		return Object.fromEntries(Object.entries(obj).filter(([, val]) => !(val instanceof WebSocket))) as any;
	}

	private _resolve(client: WebSocket): { user: UserData; session: Session } | null {
		for (const session of this.sessions) {
			if (client === session.tutor?.socket) {
				return { user: session.tutor, session };
			} else if (client === session.student?.socket) {
				return { user: session.student, session };
			}
		}

		return null;
	}
}

