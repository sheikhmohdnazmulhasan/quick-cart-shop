import { Router } from "express"
import { UserRoutes } from "../modules/users/users.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router: Router = Router()

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router;