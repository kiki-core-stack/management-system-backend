import errorHandler from '@kikiutils/kiki-core-stack-pack/nitro/handlers/error';
import { processResponseEvent } from '@kikiutils/nitro-session';

export default defineNitroErrorHandler(async (error, event) => {
	await processResponseEvent(event);
	return errorHandler(error, event);
});
