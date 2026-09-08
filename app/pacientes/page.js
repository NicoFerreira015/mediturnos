"use client";

import {
    useEffect,
    useState
} from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";

import {
    obtenerPacientes
} from "@/lib/storage";


export default function Pacientes() {

    const [pacientes, setPacientes] =
        useState([]);


    const [busqueda, setBusqueda] =
        useState("");


    useEffect(() => {

        setPacientes(
            obtenerPacientes()
        );

    }, []);


    const pacientesFiltrados =
        pacientes.filter(
            paciente => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();


                return (

                    paciente.nombre
                        .toLowerCase()
                        .includes(texto)

                    ||

                    paciente.cedula
                        .includes(texto)

                );
            }
        );


    return (
        <div className="app">

            <Sidebar />


            <main className="content">

                <header className="header">

                    <div>

                        <p>
                            Gestión de Pacientes
                        </p>

                        <h1>
                            Listado de pacientes
                        </h1>

                    </div>


                    <Link
                        href="/pacientes/nuevo"
                        className="btn-primary"
                    >
                        + Nuevo paciente
                    </Link>

                </header>


                <div className="page-content">

                    <section className="list-card">


                        <div className="list-toolbar">

                            <div>

                                <h2>
                                    Pacientes registrados
                                </h2>

                                <p>
                                    {
                                        pacientes.length
                                    } pacientes registrados
                                </p>

                            </div>


                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar por nombre o cédula..."
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
                                        <th>Cédula</th>
                                        <th>Teléfono</th>
                                        <th>Correo</th>
                                        <th>Dirección</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        pacientesFiltrados.map(
                                            paciente => (

                                                <tr
                                                    key={
                                                        paciente.id
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                paciente.nombre
                                                            }
                                                        </strong>

                                                    </td>

                                                    <td>
                                                        {
                                                            paciente.cedula
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            paciente.telefono
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            paciente.correo
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            paciente.direccion
                                                                ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }


                                    {
                                        pacientesFiltrados.length === 0 && (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="empty-table"
                                                >
                                                    No se encontraron pacientes.
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