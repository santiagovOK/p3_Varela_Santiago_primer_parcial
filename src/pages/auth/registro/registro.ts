import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

// Estructura del usuario que se guarda dentro del array "users" en localStorage.
// Incluye password porque el Paso 2 (login) valida email + password reales.
interface IUserRecord {
	email: string;
	password: string;
	role: Rol;
}

// Clave centralizada para evitar hardcoding de strings repetidos en varias lineas. Si se decide cambiar el nombre de la clave, se actualiza solo aqui.
const USERS_KEY = "users";

// La consigna pide "sin selector de rol" en el formulario de registro. Por eso el rol se decide por codigo y queda fijo en "client".
const DEFAULT_ROLE: Rol = "client";

// Referencias a elementos del DOM que vamos a usar en todo el flujo.

// Se tipan con tipos concretos para aprovechar autocompletado y chequeo de TS.
// Se permite null para poder validar su existencia antes de usar los elementos.
const form = document.getElementById("registro-form") as HTMLFormElement | null;
const inputEmail = document.getElementById("email") as HTMLInputElement | null;
const inputPassword = document.getElementById("password") as HTMLInputElement | null;

// Obtiene la lista de usuarios guardada en localStorage.
// Siempre devuelve un array valido para que el resto del flujo no se rompa.
const getUsers = (): IUserRecord[] => {
	// localStorage devuelve string | null. Si no existe la clave, llega null.
	const rawUsers = localStorage.getItem(USERS_KEY);

	// Caso base: aun no hay usuarios registrados.
	if (!rawUsers) {
		return [];
	}

	try {
		// Convertimos el JSON a un valor desconocido primero para no asumir tipo sin validar.
		const parsed = JSON.parse(rawUsers) as unknown;

		// Solo aceptamos arrays. Si el dato guardado fue alterado a otro tipo, devolvemos [] para mantener el flujo robusto.
		return Array.isArray(parsed) ? (parsed as IUserRecord[]) : [];
	} catch {
		// Si el JSON esta corrupto o no parsea, devolvemos [] en lugar de romper la app.
		return [];
	}
};

// Persiste el array completo de usuarios.
// localStorage solo guarda strings, por eso se serializa con JSON.stringify.
const saveUsers = (users: IUserRecord[]): void => {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Guard claúsula de seguridad: evita usar addEventListener sobre null.
// Si el HTML cambia y falta algun elemento requerido, falla temprano con error explicito.
if (!form || !inputEmail || !inputPassword) {
	throw new Error("No se encontraron los elementos del formulario de registro.");
}

// Evento principal del Paso 1: captura datos del formulario y registra el usuario.
form.addEventListener("submit", (event: SubmitEvent) => {
	console.log("[registro] Evento submit detectado");

	// Evita recarga de pagina para manejar la validacion y persistencia con TS.
	event.preventDefault();

	// Normalizamos email para comparar duplicados de forma consistente. Ejemplo: Example@Mail.com y example@mail.com deben contar como el mismo usuario.
	const email = inputEmail.value.trim().toLowerCase();

	// Se conserva la password tal como la ingresa el usuario.
	// En un entorno real se deberia hashear en backend, pero aqui es un TP frontend.
	const password = inputPassword.value;

	// Validacion minima para no guardar registros vacios.
	if (!email || !password) {
		console.log("[registro] Validacion fallida: email o password vacios");
		alert("Completá email y contraseña.");
		return;
	}

	// Cargamos el estado actual para evaluar duplicados y luego agregar el nuevo registro.
	const users = getUsers();

	// Evita registros duplicados comparando por email normalizado.
	const userExists = users.some((user) => user.email === email);
	if (userExists) {
		console.log("[registro] Registro rechazado: email duplicado", email);
		alert("Ese email ya está registrado.");
		return;
	}

	// La consigna pide no elegir rol en UI: se asigna client por defecto.
	const newUser: IUserRecord = {
		email,
		password,
		role: DEFAULT_ROLE,
	};

	// Agregamos el nuevo usuario al array y persistimos todo el conjunto actualizado.
	users.push(newUser);
	saveUsers(users);
	console.log("[registro] Usuario registrado correctamente", {
		email,
		role: DEFAULT_ROLE,
		totalUsers: users.length,
	});

	// Feedback simple de UX y limpieza del formulario para siguiente intento.
	alert("Registro exitoso. Ahora podés iniciar sesión.");
	form.reset();

	// Navega al login para continuar con el Paso 2 del trabajo practico.
	console.log("[registro] Redireccionando a login");
	navigate("../login/login.html");
});
