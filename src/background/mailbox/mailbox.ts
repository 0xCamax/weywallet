import { REQUESTS } from '../../common/constants/requests.ts';
import { mailbox } from '../init.ts';
import { handlers } from './handlers.ts';

Object.values(REQUESTS).forEach((v) => mailbox.on(v, handlers[v]));


