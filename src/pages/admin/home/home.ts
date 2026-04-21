import { runRouteGuard } from "../../../main";
import { logout } from "../../../utils/auth";

// NOTA respecto al repositorio base: la validacion de acceso se centralizo en src/main.ts para cumplir la consigna del Paso 3. Esta vista solo dispara el guard al cargar y delega la logica de autorizacion por rol.
runRouteGuard();

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});