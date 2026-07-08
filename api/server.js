import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// allow all CORS requests without any restrictions
server.use(cors());

// use middleware
server.use(middlewares);

// use router
server.use(router);

server.listen(5001, () => {
	console.log('JSON Server is running on http://localhost:5001');
});
