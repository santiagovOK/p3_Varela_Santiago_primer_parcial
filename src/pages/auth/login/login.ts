import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

// Tipo del usuario persistido en la clave "users" (registro completo con password).
interface IUserRecord {
  email: string;
  password: string;
  role: Rol;
}

const USERS_KEY = "users";
const SESSION_KEY = "userData";

// Referencias DOM del formulario de login.
const form = document.getElementById("form") as HTMLFormElement | null;
const inputEmail = document.getElementById("email") as HTMLInputElement | null;
const inputPassword = document.getElementById("password") as HTMLInputElement | null;

// Carga segura de usuarios desde localStorage.
const getUsers = (): IUserRecord[] => {
  const rawUsers = localStorage.getItem(USERS_KEY);

  if (!rawUsers) {
    console.log("[login] No hay usuarios registrados en localStorage");
    return [];
  }

  try {
    const parsed = JSON.parse(rawUsers) as unknown;
    if (!Array.isArray(parsed)) {
      console.log("[login] La clave users no contiene un array valido");
      return [];
    }
    return parsed as IUserRecord[];
  } catch {
    console.log("[login] Error parseando users desde localStorage");
    return [];
  }
};

// Guarda la sesion activa en userData.
const saveSession = (user: IUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

// Guard clause para evitar errores si cambia el HTML.
if (!form || !inputEmail || !inputPassword) {
  throw new Error("No se encontraron los elementos del formulario de login.");
}

// Evento principal de login.
form.addEventListener("submit", (event: SubmitEvent) => {
  console.log("[login] Evento submit detectado");
  event.preventDefault();

  // Normalizacion para comparar email de forma consistente.
  const email = inputEmail.value.trim().toLowerCase();
  const password = inputPassword.value;

  if (!email || !password) {
    console.log("[login] Validacion fallida: email o password vacios");
    alert("Completá email y contraseña.");
    return;
  }

  const users = getUsers();

  // Busca coincidencia real de credenciales (Paso 2).
  const matchedUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!matchedUser) {
    console.log("[login] Credenciales invalidas para", email);
    alert("Credenciales inválidas.");
    return;
  }

  // Construye la sesion en el formato tipado del proyecto.
  const userSession: IUser = {
    email: matchedUser.email,
    role: matchedUser.role,
    loggedIn: true,
  };

  saveSession(userSession);
  console.log("[login] Sesion iniciada correctamente", {
    email: userSession.email,
    role: userSession.role,
  });

  if (userSession.role === "admin") {
    console.log("[login] Redireccionando a home de admin");
    navigate("/src/pages/admin/home/home.html");
    return;
  }

  console.log("[login] Redireccionando a home de client");
  navigate("/src/pages/client/home/home.html");
});