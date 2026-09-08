const PACIENTES_KEY =
    "mediturnos_pacientes";

const TURNOS_KEY =
    "mediturnos_turnos";


export const profesionales = [

    {
        id: 1,
        nombre: "Dr. Molina",
        especialidad: "Clínica Médica"
    },

    {
        id: 2,
        nombre: "Dra. Aquino",
        especialidad: "Pediatría"
    },

    {
        id: 3,
        nombre: "Dr. Ríos",
        especialidad: "Traumatología"
    }

];


export const horariosDisponibles = [

    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30"

];


const pacientesIniciales = [

    {
        id: 1,
        nombre: "Lucía Fernández Ortiz",
        cedula: "4582910",
        telefono: "0981234567",
        correo: "lucia.fernandez@email.com",
        fechaNacimiento: "1995-04-12",
        direccion: "Av. Mariscal López 1234, Asunción"
    },

    {
        id: 2,
        nombre: "Marcos Duarte",
        cedula: "3219884",
        telefono: "0971123456",
        correo: "marcos.duarte@email.com",
        fechaNacimiento: "1988-08-23",
        direccion: "San Lorenzo"
    },

    {
        id: 3,
        nombre: "Rosa Benítez",
        cedula: "2904117",
        telefono: "0982123456",
        correo: "rosa.benitez@email.com",
        fechaNacimiento: "1992-02-15",
        direccion: "Fernando de la Mora"
    }

];


const turnosIniciales = [

    {
        id: 1,
        pacienteId: 1,
        paciente: "Lucía Fernández Ortiz",
        profesionalId: 1,
        profesional: "Dr. Molina",
        especialidad: "Clínica Médica",
        fecha: "2026-09-08",
        hora: "09:00",
        estado: "Confirmado"
    },

    {
        id: 2,
        pacienteId: 2,
        paciente: "Marcos Duarte",
        profesionalId: 2,
        profesional: "Dra. Aquino",
        especialidad: "Pediatría",
        fecha: "2026-09-08",
        hora: "09:30",
        estado: "Pendiente"
    },

    {
        id: 3,
        pacienteId: 3,
        paciente: "Rosa Benítez",
        profesionalId: 1,
        profesional: "Dr. Molina",
        especialidad: "Clínica Médica",
        fecha: "2026-09-08",
        hora: "10:15",
        estado: "Confirmado"
    }

];


/*
|--------------------------------------------------------------------------
| PACIENTES
|--------------------------------------------------------------------------
*/

export function obtenerPacientes() {

    if (
        typeof window === "undefined"
    ) {
        return [];
    }


    const datos =
        localStorage.getItem(
            PACIENTES_KEY
        );


    if (!datos) {

        localStorage.setItem(
            PACIENTES_KEY,
            JSON.stringify(
                pacientesIniciales
            )
        );

        return pacientesIniciales;
    }


    try {

        return JSON.parse(
            datos
        );

    } catch {

        return pacientesIniciales;
    }
}


export function guardarPaciente(
    paciente
) {

    const pacientes =
        obtenerPacientes();


    const nuevoPaciente = {

        ...paciente,

        id: Date.now()

    };


    const nuevosPacientes = [

        nuevoPaciente,

        ...pacientes

    ];


    localStorage.setItem(
        PACIENTES_KEY,
        JSON.stringify(
            nuevosPacientes
        )
    );


    return nuevoPaciente;
}


export function existeCedula(
    cedula
) {

    const pacientes =
        obtenerPacientes();


    return pacientes.some(
        paciente =>
            paciente.cedula.trim()
            ===
            cedula.trim()
    );
}


/*
|--------------------------------------------------------------------------
| TURNOS
|--------------------------------------------------------------------------
*/

export function obtenerTurnos() {

    if (
        typeof window === "undefined"
    ) {
        return [];
    }


    const datos =
        localStorage.getItem(
            TURNOS_KEY
        );


    if (!datos) {

        localStorage.setItem(
            TURNOS_KEY,
            JSON.stringify(
                turnosIniciales
            )
        );

        return turnosIniciales;
    }


    try {

        return JSON.parse(
            datos
        );

    } catch {

        return turnosIniciales;
    }
}


export function guardarTurno(
    turno
) {

    const turnos =
        obtenerTurnos();


    const nuevoTurno = {

        ...turno,

        id: Date.now(),

        estado: "Pendiente"

    };


    const nuevosTurnos = [

        nuevoTurno,

        ...turnos

    ];


    localStorage.setItem(
        TURNOS_KEY,
        JSON.stringify(
            nuevosTurnos
        )
    );


    return nuevoTurno;
}


export function actualizarEstadoTurno(
    id,
    estado
) {

    const turnos =
        obtenerTurnos();


    const nuevosTurnos =
        turnos.map(
            turno => {

                if (
                    String(turno.id)
                    ===
                    String(id)
                ) {

                    return {

                        ...turno,

                        estado

                    };

                }


                return turno;
            }
        );


    localStorage.setItem(
        TURNOS_KEY,
        JSON.stringify(
            nuevosTurnos
        )
    );


    return nuevosTurnos;
}


export function horarioEstaOcupado(
    profesionalId,
    fecha,
    hora
) {

    const turnos =
        obtenerTurnos();


    return turnos.some(
        turno =>

            String(
                turno.profesionalId
            )
            ===
            String(
                profesionalId
            )

            &&

            turno.fecha === fecha

            &&

            turno.hora === hora

            &&

            turno.estado !== "Cancelado"

    );
}