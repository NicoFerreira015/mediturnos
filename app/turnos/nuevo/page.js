"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import Link from "next/link";

import {
    useRouter
} from "next/navigation";

import Sidebar from "@/components/Sidebar";

import {
    obtenerPacientes,
    profesionales,
    horariosDisponibles,
    horarioEstaOcupado,
    guardarTurno
} from "@/lib/storage";


export default function NuevoTurno() {

    const router =
        useRouter();


    /*
    |--------------------------------------------------------------------------
    | ESTADOS
    |--------------------------------------------------------------------------
    */

    const [pacientes, setPacientes] =
        useState([]);


    const [pacienteId, setPacienteId] =
        useState("");


    const [
        profesionalId,
        setProfesionalId
    ] =
        useState("");


    const [fecha, setFecha] =
        useState("");


    const [hora, setHora] =
        useState("");


    const [errores, setErrores] =
        useState({});


    /*
    |--------------------------------------------------------------------------
    | FECHA MÍNIMA
    |--------------------------------------------------------------------------
    */

    const obtenerFechaHoy = () => {

        const hoy =
            new Date();


        const anio =
            hoy.getFullYear();


        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const dia =
            String(
                hoy.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            `${anio}-${mes}-${dia}`
        );
    };


    const fechaMinima =
        obtenerFechaHoy();


    /*
    |--------------------------------------------------------------------------
    | CARGAR PACIENTES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setPacientes(
            obtenerPacientes()
        );

    }, []);


    /*
    |--------------------------------------------------------------------------
    | PACIENTE SELECCIONADO
    |--------------------------------------------------------------------------
    */

    const pacienteSeleccionado =
        useMemo(
            () => {

                return pacientes.find(
                    paciente =>
                        String(
                            paciente.id
                        )
                        ===
                        String(
                            pacienteId
                        )
                );

            },
            [
                pacientes,
                pacienteId
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | PROFESIONAL SELECCIONADO
    |--------------------------------------------------------------------------
    */

    const profesionalSeleccionado =
        useMemo(
            () => {

                return profesionales.find(
                    profesional =>
                        String(
                            profesional.id
                        )
                        ===
                        String(
                            profesionalId
                        )
                );

            },
            [
                profesionalId
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | SELECCIONAR PROFESIONAL
    |--------------------------------------------------------------------------
    */

    const seleccionarProfesional = (
        id
    ) => {

        setProfesionalId(
            String(id)
        );


        /*
         * Al cambiar de profesional
         * limpiamos el horario seleccionado.
         */
        setHora("");


        setErrores(
            prev => ({
                ...prev,
                profesional: "",
                hora: ""
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | SELECCIONAR HORARIO
    |--------------------------------------------------------------------------
    */

    const seleccionarHorario = (
        horario
    ) => {

        /*
         * No permitir seleccionar
         * un horario ocupado.
         */
        if (
            horarioEstaOcupado(
                profesionalId,
                fecha,
                horario
            )
        ) {

            return;
        }


        setHora(
            horario
        );


        setErrores(
            prev => ({
                ...prev,
                hora: ""
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES
    |--------------------------------------------------------------------------
    */

    const validar = () => {

        const nuevosErrores = {};


        /*
         * Paciente
         */
        if (!pacienteId) {

            nuevosErrores.paciente =
                "Debe seleccionar un paciente.";

        }


        /*
         * Profesional
         */
        if (!profesionalId) {

            nuevosErrores.profesional =
                "Debe seleccionar un profesional.";

        }


        /*
         * Fecha
         */
        if (!fecha) {

            nuevosErrores.fecha =
                "Debe seleccionar una fecha.";

        } else if (
            fecha < fechaMinima
        ) {

            nuevosErrores.fecha =
                "No se pueden registrar turnos en fechas anteriores.";

        }


        /*
         * Horario
         */
        if (!hora) {

            nuevosErrores.hora =
                "Debe seleccionar un horario.";

        }


        /*
         * Verificar nuevamente que
         * el horario no esté ocupado.
         */
        if (
            profesionalId
            &&
            fecha
            &&
            hora
            &&
            horarioEstaOcupado(
                profesionalId,
                fecha,
                hora
            )
        ) {

            nuevosErrores.hora =
                "El horario seleccionado ya se encuentra ocupado.";

        }


        setErrores(
            nuevosErrores
        );


        return (
            Object.keys(
                nuevosErrores
            ).length === 0
        );
    };


    /*
    |--------------------------------------------------------------------------
    | CONFIRMAR TURNO
    |--------------------------------------------------------------------------
    */

    const confirmarTurno = () => {

        if (
            !validar()
        ) {

            return;
        }


        if (
            !pacienteSeleccionado
            ||
            !profesionalSeleccionado
        ) {

            return;
        }


        guardarTurno({

            pacienteId:
                pacienteSeleccionado.id,

            paciente:
                pacienteSeleccionado.nombre,

            profesionalId:
                profesionalSeleccionado.id,

            profesional:
                profesionalSeleccionado.nombre,

            especialidad:
                profesionalSeleccionado.especialidad,

            fecha,

            hora

        });


        alert(
            "Turno registrado correctamente. El turno quedó Pendiente."
        );


        router.push(
            "/turnos"
        );
    };


    /*
    |--------------------------------------------------------------------------
    | INTERFAZ
    |--------------------------------------------------------------------------
    */

    return (
        <div className="app">

            <Sidebar />


            <main className="content">

                <header className="header">

                    <div>

                        <p>
                            Gestión de Turnos
                        </p>

                        <h1>
                            Consulta y reserva de turno
                        </h1>

                    </div>


                    <Link
                        href="/turnos"
                        className="btn-secondary"
                    >
                        Volver al listado
                    </Link>

                </header>


                <div className="page-content">

                    <div className="turno-layout">


                        {/* =====================================================
                            CONTENIDO PRINCIPAL
                           ===================================================== */}

                        <section className="turno-main">


                            {/* PACIENTE */}

                            <div className="step-card">

                                <h3>
                                    1. Paciente
                                </h3>


                                <select
                                    className="form-select"
                                    value={
                                        pacienteId
                                    }
                                    onChange={
                                        e => {

                                            setPacienteId(
                                                e.target.value
                                            );


                                            setErrores(
                                                prev => ({
                                                    ...prev,
                                                    paciente: ""
                                                })
                                            );

                                        }
                                    }
                                >

                                    <option value="">
                                        Seleccionar paciente...
                                    </option>


                                    {
                                        pacientes.map(
                                            paciente => (

                                                <option
                                                    key={
                                                        paciente.id
                                                    }
                                                    value={
                                                        paciente.id
                                                    }
                                                >
                                                    {
                                                        paciente.nombre
                                                    }

                                                    {" — CI "}

                                                    {
                                                        paciente.cedula
                                                    }

                                                </option>

                                            )
                                        )
                                    }

                                </select>


                                {
                                    errores.paciente && (

                                        <span className="form-error">

                                            {
                                                errores.paciente
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* PROFESIONAL */}

                            <div className="step-card">

                                <h3>
                                    2. Profesional y especialidad
                                </h3>


                                <div className="profesionales-grid">

                                    {
                                        profesionales.map(
                                            profesional => {

                                                const seleccionado =
                                                    String(
                                                        profesionalId
                                                    )
                                                    ===
                                                    String(
                                                        profesional.id
                                                    );


                                                const iniciales =
                                                    profesional.nombre
                                                        .replace(
                                                            "Dra. ",
                                                            ""
                                                        )
                                                        .replace(
                                                            "Dr. ",
                                                            ""
                                                        )
                                                        .substring(
                                                            0,
                                                            2
                                                        )
                                                        .toUpperCase();


                                                return (

                                                    <button
                                                        type="button"
                                                        key={
                                                            profesional.id
                                                        }
                                                        className={
                                                            `profesional-card ${
                                                                seleccionado
                                                                    ? "selected"
                                                                    : ""
                                                            }`
                                                        }
                                                        onClick={
                                                            () =>
                                                                seleccionarProfesional(
                                                                    profesional.id
                                                                )
                                                        }
                                                    >

                                                        <div className="professional-avatar">

                                                            {
                                                                iniciales
                                                            }

                                                        </div>


                                                        <strong>

                                                            {
                                                                profesional.nombre
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                profesional.especialidad
                                                            }

                                                        </span>

                                                    </button>

                                                );

                                            }
                                        )
                                    }

                                </div>


                                {
                                    errores.profesional && (

                                        <span className="form-error">

                                            {
                                                errores.profesional
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* FECHA */}

                            <div className="step-card">

                                <h3>
                                    3. Fecha
                                </h3>


                                <input
                                    type="date"
                                    className="form-date"
                                    min={
                                        fechaMinima
                                    }
                                    value={
                                        fecha
                                    }
                                    onChange={
                                        e => {

                                            setFecha(
                                                e.target.value
                                            );


                                            /*
                                             * Si cambia la fecha,
                                             * limpiar horario.
                                             */
                                            setHora("");


                                            setErrores(
                                                prev => ({
                                                    ...prev,
                                                    fecha: "",
                                                    hora: ""
                                                })
                                            );

                                        }
                                    }
                                />


                                {
                                    errores.fecha && (

                                        <span className="form-error">

                                            {
                                                errores.fecha
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* HORARIOS */}

                            <div className="step-card">

                                <div className="schedule-title">

                                    <h3>
                                        4. Horario disponible
                                    </h3>


                                    <div className="schedule-legend">

                                        <span>
                                            □ Libre
                                        </span>

                                        <span>
                                            ▨ Ocupado
                                        </span>

                                        <span>
                                            ■ Seleccionado
                                        </span>

                                    </div>

                                </div>


                                <div className="horarios-grid">

                                    {
                                        horariosDisponibles.map(
                                            horario => {

                                                /*
                                                 * Sin profesional o fecha
                                                 * todavía no habilitamos
                                                 * los horarios.
                                                 */
                                                const ocupado =
                                                    !profesionalId
                                                    ||
                                                    !fecha
                                                    ||
                                                    horarioEstaOcupado(
                                                        profesionalId,
                                                        fecha,
                                                        horario
                                                    );


                                                const seleccionado =
                                                    hora === horario;


                                                return (

                                                    <button
                                                        type="button"
                                                        key={
                                                            horario
                                                        }
                                                        disabled={
                                                            ocupado
                                                        }
                                                        onClick={
                                                            () =>
                                                                seleccionarHorario(
                                                                    horario
                                                                )
                                                        }
                                                        className={
                                                            `horario-btn ${
                                                                ocupado
                                                                    ? "occupied"
                                                                    : ""
                                                            } ${
                                                                seleccionado
                                                                    ? "selected"
                                                                    : ""
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            horario
                                                        }

                                                    </button>

                                                );

                                            }
                                        )
                                    }

                                </div>


                                {
                                    errores.hora && (

                                        <span className="form-error">

                                            {
                                                errores.hora
                                            }

                                        </span>

                                    )
                                }

                            </div>

                        </section>


                        {/* =====================================================
                            RESUMEN
                           ===================================================== */}

                        <aside className="turno-summary">

                            <h3>
                                Resumen del turno
                            </h3>


                            <div className="summary-row">

                                <span>
                                    Paciente
                                </span>

                                <strong>

                                    {
                                        pacienteSeleccionado
                                            ?.nombre
                                        ||
                                        "-"
                                    }

                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Profesional
                                </span>

                                <strong>

                                    {
                                        profesionalSeleccionado
                                            ?.nombre
                                        ||
                                        "-"
                                    }

                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Especialidad
                                </span>

                                <strong>

                                    {
                                        profesionalSeleccionado
                                            ?.especialidad
                                        ||
                                        "-"
                                    }

                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Fecha
                                </span>

                                <strong>

                                    {
                                        fecha || "-"
                                    }

                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Hora
                                </span>

                                <strong>

                                    {
                                        hora || "-"
                                    }

                                </strong>

                            </div>


                            <div className="pending-notice">

                                ◷ El turno quedará como

                                <strong>
                                    {" "}Pendiente{" "}
                                </strong>

                                hasta confirmar.

                            </div>


                            <button
                                type="button"
                                className="btn-primary confirm-turno"
                                onClick={
                                    confirmarTurno
                                }
                            >
                                Confirmar turno
                            </button>

                        </aside>

                    </div>

                </div>

            </main>

        </div>
    );
}