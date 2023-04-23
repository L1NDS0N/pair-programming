// Importe as dependências necessárias
import { AuthController } from '@/server/controllers/auth-controller';
import createNextApiRouter from '@/server/core/NextApiRouter';

const router = createNextApiRouter();
const authController = new AuthController(router);
authController.login();
export default authController.handler();
