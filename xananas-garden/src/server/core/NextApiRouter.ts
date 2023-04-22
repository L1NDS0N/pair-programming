import { NextApiRequest, NextApiResponse } from 'next';

export type Middleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	next: () => void
) => void;
type RouteHandler = (req: NextApiRequest, res: NextApiResponse) => void;

enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}

type Route = {
	method: HttpMethod;
	handler: RouteHandler;
	middlewares: Middleware[];
};

function createNextApiRouter() {
	const routes: Route[] = [];

	function get(handler: RouteHandler) {
		addRoute(HttpMethod.GET, handler);
	}

	function post(handler: RouteHandler) {
		addRoute(HttpMethod.POST, handler);
	}

	function put(handler: RouteHandler) {
		addRoute(HttpMethod.PUT, handler);
	}

	function deleteRoute(handler: RouteHandler) {
		addRoute(HttpMethod.DELETE, handler);
	}

	function patch(handler: RouteHandler) {
		addRoute(HttpMethod.PATCH, handler);
	}

	function use(middleware: Middleware) {
		routes.forEach(route => {
			route.middlewares.push(middleware);
		});
	}

	function addRoute(method: HttpMethod, handler: RouteHandler) {
		const route = routes.find(route => route.method === method);
		if (route) {
			throw new Error(`Já existe um handler para a rota ${method}`);
		}
		routes.push({ method, handler, middlewares: [] });
	}

	function handle() {
		return (req: NextApiRequest, res: NextApiResponse) => {
			const method = req.method as HttpMethod;
			const route = routes.find(route => route.method === method);
			if (route) {
				const middlewares: Middleware[] = [];
				route.middlewares.forEach(middleware => {
					middlewares.push(middleware);
				});
				middlewares.push(route.handler);
				runMiddlewares(req, res, middlewares);
			} else {
				res.status(404).json({ error: 'Rota não encontrada' });
			}
		};
	}

	function runMiddlewares(
		req: NextApiRequest,
		res: NextApiResponse,
		middlewares: Middleware[]
	) {
		function next() {
			const middleware = middlewares.shift();
			if (middleware) {
				middleware(req, res, next);
			}
		}
		next();
	}

	return {
		get,
		post,
		put,
		delete: deleteRoute,
		patch,
		use,
		handle,
	};
}

export default createNextApiRouter;
