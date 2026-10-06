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


const API_URL =
    "https://jsonplaceholder.typicode.com/users";


export default function Pacientes() {

    const [pacientes, setPacientes] =
        useState([]);


    const [busqueda, setBusqueda] =
        useState("");


    // Estados de la demostración GET
    const [datosSimulados, setDatosSimulados] =
        useState([]);

    const [estadoGET, setEstadoGET] =
        useState("cargando");

    const [errorGET, setErrorGET] =
        useState("");


    useEffect(() => {

        setPacientes(
            obtenerPacientes()
        );

    }, []);


    /*
    |--------------------------------------------------------------------------
    | 3.3 IMPLEMENTACIÓN DE GET CON FETCH()
    |--------------------------------------------------------------------------
    | Se consulta una API pública de prueba. Los datos recibidos se
    | transforman para que puedan visualizarse como pacientes simulados.
    */

    useEffect(() => {

        const obtenerDatosSimulados = async () => {

            setEstadoGET("cargando");
            setErrorGET("");

            try {

                const response =
                    await fetch(API_URL);

                if (!response.ok) {

                    throw new Error(
                        "No fue posible obtener los datos."
                    );

                }

                const data =
                    await response.json();

                setDatosSimulados(
                    data.slice(0, 5)
                );

                setEstadoGET("exito");

            } catch (error) {

                setEstadoGET("error");

                setErrorGET(
                    error.message
                    ||
                    "Ocurrió un error al consultar la API."
                );

            }

        };


        obtenerDatosSimulados();

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

                    {/* =====================================================
                        LISTADO ACTUAL DEL MVP
                       ===================================================== */}

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


                    {/* =====================================================
                        3.1 - 3.5 DEMOSTRACIÓN DE CONSUMO GET
                       ===================================================== */}

                    <section className="list-card api-demo-card">

                        <div className="api-demo-header">

                            <div>

                                <span className="api-demo-label">
                                    GET · DATOS SIMULADOS
                                </span>

                                <h2>
                                    Pacientes obtenidos desde una API de prueba
                                </h2>

                                <p>
                                    Esta sección demuestra el consumo de una
                                    fuente externa mediante <strong>fetch()</strong>.
                                    No reemplaza todavía la fuente de datos
                                    propia del sistema.
                                </p>

                            </div>


                            <span
                                className={
                                    `api-status ${
                                        estadoGET
                                    }`
                                }
                            >
                                {
                                    estadoGET === "cargando"
                                        ? "Cargando..."
                                        : estadoGET === "exito"
                                            ? "Consulta exitosa"
                                            : "Error"
                                }
                            </span>

                        </div>


                        {/* 3.5 ESTADO: CARGA */}

                        {
                            estadoGET === "cargando"
                            && (

                                <div className="api-message">
                                    <span className="api-spinner">
                                        ◌
                                    </span>

                                    Obteniendo datos simulados...
                                </div>

                            )
                        }


                        {/* 3.5 ESTADO: ERROR */}

                        {
                            estadoGET === "error"
                            && (

                                <div className="api-message api-error">
                                    <strong>
                                        No se pudieron cargar los datos.
                                    </strong>

                                    <span>
                                        {errorGET}
                                    </span>
                                </div>

                            )
                        }


                        {/* 3.4 VISUALIZACIÓN DE DATOS */}

                        {
                            estadoGET === "exito"
                            && (

                                <div className="table-scroll">

                                    <table>

                                        <thead>

                                            <tr>
                                                <th>ID</th>
                                                <th>Paciente simulado</th>
                                                <th>Correo</th>
                                                <th>Teléfono</th>
                                                <th>Ciudad</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {
                                                datosSimulados.map(
                                                    dato => (

                                                        <tr
                                                            key={
                                                                dato.id
                                                            }
                                                        >

                                                            <td>
                                                                {
                                                                    dato.id
                                                                }
                                                            </td>

                                                            <td>

                                                                <strong>
                                                                    {
                                                                        dato.name
                                                                    }
                                                                </strong>

                                                            </td>

                                                            <td>
                                                                {
                                                                    dato.email
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    dato.phone
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    dato.address?.city
                                                                    ||
                                                                    "-"
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>

                            )
                        }


                        <div className="api-info-grid">

                            <div>

                                <span>
                                    Endpoint utilizado
                                </span>

                                <strong>
                                    GET /users
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Fuente
                                </span>

                                <strong>
                                    JSONPlaceholder
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Registros mostrados
                                </span>

                                <strong>
                                    {
                                        datosSimulados.length
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* =====================================================
                        3.6 FUTURA OPERACIÓN POST
                       ===================================================== */}

                    <section className="architecture-card">

                        <div className="architecture-title">

                            <span className="api-demo-label">
                                POST · OPERACIÓN FUTURA
                            </span>

                            <h2>
                                Registro de un nuevo paciente
                            </h2>

                            <p>
                                El formulario existente de “Nuevo paciente”
                                será conectado posteriormente con el backend
                                propio.
                            </p>

                        </div>


                        <div className="post-info">

                            <div>
                                <span>
                                    Formulario
                                </span>

                                <strong>
                                    Nuevo paciente
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Datos a enviar
                                </span>

                                <strong>
                                    Nombre, cédula, teléfono, correo,
                                    fecha de nacimiento y dirección
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Operación futura
                                </span>

                                <strong>
                                    POST /pacientes
                                </strong>
                            </div>

                        </div>

                    </section>


                    {/* =====================================================
                        3.7 ARQUITECTURA FUTURA
                       ===================================================== */}

                    <section className="architecture-card">

                        <div className="architecture-title">

                            <span className="api-demo-label">
                                ARQUITECTURA FUTURA
                            </span>

                            <h2>
                                Evolución de la integración
                            </h2>

                            <p>
                                En esta etapa la API utilizada es externa y
                                solamente sirve para demostrar el consumo GET.
                            </p>

                        </div>


                        <div className="architecture-flow">

                            <div className="architecture-node">
                                <strong>Frontend</strong>
                                <span>Next.js + React</span>
                            </div>

                            <div className="architecture-arrow">
                                →
                                <small>fetch()</small>
                            </div>

                            <div className="architecture-node">
                                <strong>API / Backend</strong>
                                <span>Próxima etapa</span>
                            </div>

                            <div className="architecture-arrow">
                                →
                            </div>

                            <div className="architecture-node">
                                <strong>Base de datos</strong>
                                <span>PostgreSQL</span>
                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}
