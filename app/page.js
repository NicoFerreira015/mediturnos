"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import {
    obtenerTurnos
} from "@/lib/storage";


export default function Home() {

    const [turnos, setTurnos] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | CARGAR TURNOS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setTurnos(
            obtenerTurnos()
        );

    }, []);


    /*
    |--------------------------------------------------------------------------
    | FECHA ACTUAL LOCAL
    |--------------------------------------------------------------------------
    */

    const fechaActual = () => {

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


    const hoy =
        fechaActual();


    /*
    |--------------------------------------------------------------------------
    | TURNOS DE HOY
    |--------------------------------------------------------------------------
    */

    const turnosHoy =
        useMemo(
            () => {

                return turnos.filter(
                    turno =>
                        turno.fecha === hoy
                );

            },
            [
                turnos,
                hoy
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | CONTADORES
    |--------------------------------------------------------------------------
    */

    const pendientes =
        turnosHoy.filter(
            turno =>
                turno.estado === "Pendiente"
        ).length;


    const confirmados =
        turnosHoy.filter(
            turno =>
                turno.estado === "Confirmado"
        ).length;


    const cancelados =
        turnosHoy.filter(
            turno =>
                turno.estado === "Cancelado"
        ).length;


    /*
    |--------------------------------------------------------------------------
    | PRÓXIMOS TURNOS
    |--------------------------------------------------------------------------
    */

    const proximosTurnos =
        useMemo(
            () => {

                return turnosHoy
                    .filter(
                        turno =>
                            turno.estado
                            !==
                            "Cancelado"
                    )
                    .sort(
                        (a, b) =>
                            a.hora.localeCompare(
                                b.hora
                            )
                    )
                    .slice(
                        0,
                        5
                    );

            },
            [
                turnosHoy
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | FECHA PARA CABECERA
    |--------------------------------------------------------------------------
    */

    const fechaCabecera =
        new Date().toLocaleDateString(
            "es-PY",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    return (
        <div className="app">

            <Sidebar />


            <main className="content">

                <header className="header">

                    <div>

                        <h1>
                            Panel Principal
                        </h1>

                        <p>
                            Resumen de la actividad de hoy
                        </p>

                    </div>


                    <div className="date">
                        {fechaCabecera}
                    </div>

                </header>


                <div className="page-content">


                    {/* BIENVENIDA */}

                    <section className="welcome">

                        <h2>
                            Hola, Ana
                        </h2>

                        <p>
                            Esto es lo que está pasando
                            en la agenda hoy.
                        </p>

                    </section>


                    {/* ESTADÍSTICAS */}

                    <section className="stats">


                        <div className="stat-card">

                            <div className="stat-icon cyan">
                                ▣
                            </div>

                            <strong>
                                {
                                    turnosHoy.length
                                }
                            </strong>

                            <span>
                                Turnos hoy
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon yellow">
                                ◷
                            </div>

                            <strong>
                                {
                                    pendientes
                                }
                            </strong>

                            <span>
                                Pendientes
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon green">
                                ✓
                            </div>

                            <strong>
                                {
                                    confirmados
                                }
                            </strong>

                            <span>
                                Confirmados
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon red">
                                ×
                            </div>

                            <strong>
                                {
                                    cancelados
                                }
                            </strong>

                            <span>
                                Cancelados
                            </span>

                        </div>

                    </section>


                    {/* MÓDULOS */}

                    <section className="modules">


                        <div className="module-card">

                            <div className="module-header">

                                <div className="module-icon">
                                    ♙
                                </div>


                                <div>

                                    <h3>
                                        Gestión de Pacientes
                                    </h3>

                                    <p>
                                        Alta de nuevos pacientes
                                        y listado general.
                                    </p>

                                </div>

                            </div>


                            <div className="buttons">

                                <Link
                                    href="/pacientes/nuevo"
                                    className="btn-primary"
                                >
                                    + Nuevo paciente
                                </Link>


                                <Link
                                    href="/pacientes"
                                    className="btn-secondary"
                                >
                                    Ver listado
                                </Link>

                            </div>

                        </div>


                        <div className="module-card">

                            <div className="module-header">

                                <div className="module-icon">
                                    ▣
                                </div>


                                <div>

                                    <h3>
                                        Gestión de Turnos
                                    </h3>

                                    <p>
                                        Consultá disponibilidad
                                        y agendá nuevos turnos.
                                    </p>

                                </div>

                            </div>


                            <div className="buttons">

                                <Link
                                    href="/turnos/nuevo"
                                    className="btn-primary"
                                >
                                    + Nuevo turno
                                </Link>


                                <Link
                                    href="/turnos"
                                    className="btn-secondary"
                                >
                                    Ver listado
                                </Link>

                            </div>

                        </div>

                    </section>


                    {/* PRÓXIMOS TURNOS */}

                    <section className="turnos-card">

                        <div className="turnos-header">

                            <h3>
                                Próximos turnos de hoy
                            </h3>


                            <Link
                                href="/turnos"
                                className="link-button"
                            >
                                Ver todos →
                            </Link>

                        </div>


                        <div className="table-scroll">

                            <table>

                                <thead>

                                    <tr>
                                        <th>Hora</th>
                                        <th>Paciente</th>
                                        <th>Profesional</th>
                                        <th>Estado</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        proximosTurnos.map(
                                            turno => (

                                                <tr
                                                    key={
                                                        turno.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            turno.hora
                                                        }
                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                turno.paciente
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            turno.profesional
                                                        }

                                                        {" · "}

                                                        {
                                                            turno.especialidad
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                `badge ${
                                                                    turno.estado
                                                                        .toLowerCase()
                                                                }`
                                                            }
                                                        >
                                                            {
                                                                turno.estado
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }


                                    {
                                        proximosTurnos.length
                                        ===
                                        0
                                        && (

                                            <tr>

                                                <td
                                                    colSpan="4"
                                                    className="empty-table"
                                                >
                                                    No existen turnos
                                                    registrados para hoy.
                                                </td>

                                            </tr>

                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}