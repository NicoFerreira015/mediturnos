"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import {
    obtenerTurnos,
    actualizarEstadoTurno
} from "@/lib/storage";


export default function Turnos() {

    const [turnos, setTurnos] =
        useState([]);


    const [filtro, setFiltro] =
        useState("Todos");


    const [busqueda, setBusqueda] =
        useState("");


    useEffect(() => {

        setTurnos(
            obtenerTurnos()
        );

    }, []);


    const cambiarEstado = (
        id,
        estado
    ) => {

        const nuevosTurnos =
            actualizarEstadoTurno(
                id,
                estado
            );


        setTurnos(
            nuevosTurnos
        );
    };


    const contador = (
        estado
    ) => {

        if (
            estado === "Todos"
        ) {
            return turnos.length;
        }


        return turnos.filter(
            turno =>
                turno.estado === estado
        ).length;
    };


    const turnosFiltrados =
        useMemo(
            () => {

                return turnos.filter(
                    turno => {

                        const cumpleEstado =
                            filtro === "Todos"
                            ||
                            turno.estado === filtro;


                        const texto =
                            busqueda
                                .trim()
                                .toLowerCase();


                        const cumpleBusqueda =
                            !texto
                            ||
                            turno.paciente
                                .toLowerCase()
                                .includes(
                                    texto
                                )
                            ||
                            turno.profesional
                                .toLowerCase()
                                .includes(
                                    texto
                                );


                        return (
                            cumpleEstado
                            &&
                            cumpleBusqueda
                        );

                    }
                );

            },
            [
                turnos,
                filtro,
                busqueda
            ]
        );


    const formatearFecha = (
        fecha
    ) => {

        if (!fecha) {
            return "-";
        }


        const partes =
            fecha.split("-");


        if (
            partes.length !== 3
        ) {
            return fecha;
        }


        return (
            `${partes[2]}/${partes[1]}/${partes[0]}`
        );
    };


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
                            Listado y gestión de turnos
                        </h1>

                    </div>


                    <Link
                        href="/turnos/nuevo"
                        className="btn-primary"
                    >
                        + Nuevo turno
                    </Link>

                </header>


                <div className="page-content">

                    <section className="list-card">


                        <div className="turnos-toolbar">


                            <div className="filters">

                                {
                                    [
                                        "Todos",
                                        "Pendiente",
                                        "Confirmado",
                                        "Cancelado"
                                    ].map(
                                        estado => (

                                            <button
                                                key={
                                                    estado
                                                }
                                                type="button"
                                                className={
                                                    `filter-btn ${
                                                        filtro
                                                        ===
                                                        estado
                                                            ? "active"
                                                            : ""
                                                    }`
                                                }
                                                onClick={
                                                    () =>
                                                        setFiltro(
                                                            estado
                                                        )
                                                }
                                            >

                                                {
                                                    estado
                                                }

                                                <span>
                                                    {
                                                        contador(
                                                            estado
                                                        )
                                                    }
                                                </span>

                                            </button>

                                        )
                                    )
                                }

                            </div>


                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar paciente..."
                                value={
                                    busqueda
                                }
                                onChange={
                                    e =>
                                        setBusqueda(
                                            e.target.value
                                        )
                                }
                            />

                        </div>


                        <div className="table-scroll">

                            <table>

                                <thead>

                                    <tr>
                                        <th>Paciente</th>
                                        <th>Profesional</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        turnosFiltrados.map(
                                            turno => (

                                                <tr
                                                    key={
                                                        turno.id
                                                    }
                                                >

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

                                                        <div className="table-secondary">
                                                            {
                                                                turno.especialidad
                                                            }
                                                        </div>

                                                    </td>


                                                    <td>
                                                        {
                                                            formatearFecha(
                                                                turno.fecha
                                                            )
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            turno.hora
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


                                                    <td>

                                                        <div className="actions-cell">

                                                            {
                                                                turno.estado
                                                                ===
                                                                "Pendiente"
                                                                && (

                                                                    <button
                                                                        type="button"
                                                                        className="action-confirm"
                                                                        onClick={
                                                                            () =>
                                                                                cambiarEstado(
                                                                                    turno.id,
                                                                                    "Confirmado"
                                                                                )
                                                                        }
                                                                    >
                                                                        Confirmar
                                                                    </button>

                                                                )
                                                            }


                                                            {
                                                                turno.estado
                                                                !==
                                                                "Cancelado"
                                                                && (

                                                                    <button
                                                                        type="button"
                                                                        className="action-cancel"
                                                                        onClick={
                                                                            () =>
                                                                                cambiarEstado(
                                                                                    turno.id,
                                                                                    "Cancelado"
                                                                                )
                                                                        }
                                                                    >
                                                                        Cancelar
                                                                    </button>

                                                                )
                                                            }


                                                            {
                                                                turno.estado
                                                                ===
                                                                "Cancelado"
                                                                && (

                                                                    <span className="no-actions">
                                                                        —
                                                                    </span>

                                                                )
                                                            }

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }


                                    {
                                        turnosFiltrados.length
                                        ===
                                        0
                                        && (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="empty-table"
                                                >
                                                    No se encontraron turnos.
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