import admin from './admin';
import { session } from './session';

honoApp.use(session());
honoApp.use(admin);
