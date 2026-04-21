import type { IUser } from "./types/IUser";
import type { Rol } from "./types/Rol";
import { getUSer } from "./utils/localStorage";
import { navigate } from "./utils/navigate";

// Rutas usadas por el guard para redireccionar.
const LOGIN_PATH = "/src/pages/auth/login/login.html";
const ADMIN_HOME_PATH = "/src/pages/admin/home/home.html";
const CLIENT_HOME_PATH = "/src/pages/client/home/home.html";

type ProtectedRoute = {
	// Prefijo de pathname que identifica una zona protegida.
	routePrefix: string;
	// Rol obligatorio para acceder a esa zona.
	requiredRole: Rol;
	// Destino cuando el usuario esta logueado pero no cumple el rol.
	forbiddenRedirect: string;
};

// Matriz de autorizacion por prefijo de ruta.
const protectedRoutes: ProtectedRoute[] = [
	{
		routePrefix: "/src/pages/admin/",
		requiredRole: "admin",
		forbiddenRedirect: CLIENT_HOME_PATH,
	},
	{
		routePrefix: "/src/pages/client/",
		requiredRole: "client",
		forbiddenRedirect: ADMIN_HOME_PATH,
	},
];

// Devuelve la primera regla de proteccion que coincide con la ruta actual.
const getMatchedProtectedRoute = (pathname: string): ProtectedRoute | undefined => {
	return protectedRoutes.find((route) => pathname.includes(route.routePrefix));
};

// Parsea userData de manera segura para no romper la app con JSON invalido.
const parseSessionUser = (rawUser: string): IUser | null => {
	try {
		return JSON.parse(rawUser) as IUser;
	} catch {
		console.log("[guard] userData tiene formato invalido");
		return null;
	}
};

export const runRouteGuard = (): void => {
	const pathname = window.location.pathname;
	console.log("[guard] Evaluando ruta:", pathname);

	const protectedRoute = getMatchedProtectedRoute(pathname);

	// Si la ruta actual no es protegida, no hace falta validar rol/sesion.
	if (!protectedRoute) {
		console.log("[guard] Ruta publica, no se aplica control de acceso");
		return;
	}

	console.log("[guard] Ruta protegida detectada", {
		requiredRole: protectedRoute.requiredRole,
		routePrefix: protectedRoute.routePrefix,
	});

	const rawUser = getUSer();

	if (!rawUser) {
		console.log("[guard] Sin sesion activa, redirigiendo a login");
		navigate(LOGIN_PATH);
		return;
	}

	const sessionUser = parseSessionUser(rawUser);

	if (!sessionUser || !sessionUser.loggedIn) {
		console.log("[guard] Sesion ausente o invalida, redirigiendo a login");
		navigate(LOGIN_PATH);
		return;
	}

	console.log("[guard] Sesion valida", {
		email: sessionUser.email,
		role: sessionUser.role,
		loggedIn: sessionUser.loggedIn,
	});

	if (sessionUser.role !== protectedRoute.requiredRole) {
		console.log("[guard] Rol no autorizado para esta ruta, redirigiendo", {
			userRole: sessionUser.role,
			requiredRole: protectedRoute.requiredRole,
			target: protectedRoute.forbiddenRedirect,
		});
		navigate(protectedRoute.forbiddenRedirect);
		return;
	}

	console.log("[guard] Acceso permitido");
};
