const API_URL = "/api/v1";
let token = localStorage.getItem("token") || "";

const resultado = document.getElementById("resultado");
const estadoLogin = document.getElementById("estadoLogin");

const mostrar = (data) => {
  resultado.textContent = JSON.stringify(data, null, 2);
};

const headersAuth = () => ({
  Authorization: `Bearer ${token}`,
});

const getJson = async (endpoint) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: headersAuth(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

document.getElementById("btnLogin").addEventListener("click", async () => {
  try {
    const email = document.getElementById("email").value;
    const contrasenia = document.getElementById("contrasenia").value;

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contrasenia }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      throw data;
    }

    token = data.token;
    localStorage.setItem("token", token);

    estadoLogin.textContent = "Sesión iniciada correctamente";
    estadoLogin.className = "mt-3 mb-0 small text-success fw-bold";

    mostrar(data);
  } catch (error) {
    estadoLogin.textContent = "Error al iniciar sesión";
    estadoLogin.className = "mt-3 mb-0 small text-danger fw-bold";
    mostrar(error);
  }
});

document.getElementById("btnEspecialidades").addEventListener("click", async () => {
  try {
    mostrar(await getJson("/especialidades"));
  } catch (error) {
    mostrar(error);
  }
});

document.getElementById("btnMedicos").addEventListener("click", async () => {
  try {
    mostrar(await getJson("/medicos"));
  } catch (error) {
    mostrar(error);
  }
});

document.getElementById("btnMedicosEspecialidad").addEventListener("click", async () => {
  try {
    mostrar(await getJson("/medicos/especialidad/1"));
  } catch (error) {
    mostrar(error);
  }
});

document.getElementById("btnTurnos").addEventListener("click", async () => {
  try {
    mostrar(await getJson("/turnos-reservas"));
  } catch (error) {
    mostrar(error);
  }
});

document.getElementById("btnEstadisticas").addEventListener("click", async () => {
  try {
    mostrar(await getJson("/estadisticas/generales"));
  } catch (error) {
    mostrar(error);
  }
});

document.getElementById("btnPdf").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/reportes/turnos/pdf`, {
      headers: headersAuth(),
    });

    if (!res.ok) {
      const error = await res.json();
      throw error;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (error) {
    mostrar(error);
  }
});

if (token) {
  estadoLogin.textContent = "Token guardado en navegador";
  estadoLogin.className = "mt-3 mb-0 small text-success fw-bold";
}