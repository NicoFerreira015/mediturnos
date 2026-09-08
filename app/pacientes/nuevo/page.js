"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";

import {
    existeCedula,
    guardarPaciente
} from "@/lib/storage";


export default function NuevoPaciente() {

    const router =
        useRouter();


    /*
    |--------------------------------------------------------------------------
    | FORMULARIO
    |--------------------------------------------------------------------------
    */

    const [form, setForm] =
        useState({

            nombre: "",
            cedula: "",
            telefono: "",
            correo: "",
            fechaNacimiento: "",
            direccion: ""

        });


    /*
    |--------------------------------------------------------------------------
    | ERRORES
    |--------------------------------------------------------------------------
    */

    const [errores, setErrores] =
        useState({});


    /*
    |--------------------------------------------------------------------------
    | CAMBIO DE CAMPOS
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            prev => ({

                ...prev,

                [name]: value

            })
        );


        setErrores(
            prev => ({

                ...prev,

                [name]: ""

            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | VALIDACIONES
    |--------------------------------------------------------------------------
    */

    const validarFormulario = () => {

        const nuevosErrores = {};


        /*
         * NOMBRE
         */

        if (
            !form.nombre.trim()
        ) {

            nuevosErrores.nombre =
                "El nombre completo es obligatorio.";

        } else if (
            form.nombre.trim().length < 3
        ) {

            nuevosErrores.nombre =
                "El nombre debe tener al menos 3 caracteres.";

        }


        /*
         * CÉDULA
         */

        if (
            !form.cedula.trim()
        ) {

            nuevosErrores.cedula =
                "La cédula es obligatoria.";

        } else if (
            !/^[0-9]+$/.test(
                form.cedula
            )
        ) {

            nuevosErrores.cedula =
                "La cédula debe contener solamente números.";

        } else if (
            form.cedula.trim().length < 5
        ) {

            nuevosErrores.cedula =
                "Ingrese una cédula válida.";

        } else if (
            existeCedula(
                form.cedula
            )
        ) {

            nuevosErrores.cedula =
                "Ya existe un paciente registrado con esta cédula.";

        }


        /*
         * TELÉFONO
         */

        if (
            !form.telefono.trim()
        ) {

            nuevosErrores.telefono =
                "El teléfono es obligatorio.";

        } else if (
            !/^[0-9]+$/.test(
                form.telefono
            )
        ) {

            nuevosErrores.telefono =
                "El teléfono debe contener solamente números.";

        } else if (
            form.telefono.trim().length < 9
        ) {

            nuevosErrores.telefono =
                "Ingrese un número de teléfono válido.";

        }


        /*
         * CORREO
         */

        if (
            !form.correo.trim()
        ) {

            nuevosErrores.correo =
                "El correo electrónico es obligatorio.";

        } else {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(
                    form.correo
                )
            ) {

                nuevosErrores.correo =
                    "Ingrese un correo electrónico válido.";

            }

        }


        /*
         * FECHA NACIMIENTO
         */

        if (
            form.fechaNacimiento
        ) {

            const nacimiento =
                new Date(
                    `${form.fechaNacimiento}T00:00:00`
                );


            const hoy =
                new Date();


            if (
                nacimiento > hoy
            ) {

                nuevosErrores.fechaNacimiento =
                    "La fecha de nacimiento no puede ser futura.";

            }

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
    | GUARDAR PACIENTE
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (
        e
    ) => {

        e.preventDefault();


        if (
            !validarFormulario()
        ) {

            return;
        }


        guardarPaciente({

            nombre:
                form.nombre.trim(),

            cedula:
                form.cedula.trim(),

            telefono:
                form.telefono.trim(),

            correo:
                form.correo
                    .trim()
                    .toLowerCase(),

            fechaNacimiento:
                form.fechaNacimiento,

            direccion:
                form.direccion.trim()

        });


        alert(
            "Paciente registrado correctamente."
        );


        router.push(
            "/pacientes"
        );
    };


    /*
    |--------------------------------------------------------------------------
    | CANCELAR
    |--------------------------------------------------------------------------
    */

    const cancelar = () => {

        router.push(
            "/pacientes"
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


                {/* HEADER */}

                <header className="header">

                    <div>

                        <p>
                            Gestión de Pacientes
                        </p>

                        <h1>
                            Registrar nuevo paciente
                        </h1>

                    </div>


                    <Link
                        href="/pacientes"
                        className="btn-secondary"
                    >
                        Volver al listado
                    </Link>

                </header>


                {/* CONTENIDO */}

                <div className="page-content">

                    <div className="patients-layout">


                        {/* FORMULARIO */}

                        <section className="form-card">


                            <div className="form-title">

                                <h2>
                                    Datos del paciente
                                </h2>

                                <p>
                                    Completá los datos necesarios para registrar
                                    un nuevo paciente en MediTurnos.
                                </p>

                            </div>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                noValidate
                            >


                                {/* NOMBRE */}

                                <div className="form-group full">

                                    <label htmlFor="nombre">
                                        Nombre completo *
                                    </label>


                                    <input
                                        id="nombre"
                                        type="text"
                                        name="nombre"
                                        value={
                                            form.nombre
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Ej: Lucía Fernández Ortiz"
                                        autoComplete="name"
                                    />


                                    {
                                        errores.nombre && (

                                            <span className="form-error">

                                                {
                                                    errores.nombre
                                                }

                                            </span>

                                        )
                                    }

                                </div>


                                <div className="form-grid">


                                    {/* CÉDULA */}

                                    <div className="form-group">

                                        <label htmlFor="cedula">
                                            Cédula de identidad *
                                        </label>


                                        <input
                                            id="cedula"
                                            type="text"
                                            name="cedula"
                                            inputMode="numeric"
                                            value={
                                                form.cedula
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Ej: 4582910"
                                        />


                                        {
                                            errores.cedula && (

                                                <span className="form-error">

                                                    {
                                                        errores.cedula
                                                    }

                                                </span>

                                            )
                                        }

                                    </div>


                                    {/* TELÉFONO */}

                                    <div className="form-group">

                                        <label htmlFor="telefono">
                                            Teléfono *
                                        </label>


                                        <input
                                            id="telefono"
                                            type="text"
                                            name="telefono"
                                            inputMode="numeric"
                                            value={
                                                form.telefono
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Ej: 0981234567"
                                            autoComplete="tel"
                                        />


                                        {
                                            errores.telefono && (

                                                <span className="form-error">

                                                    {
                                                        errores.telefono
                                                    }

                                                </span>

                                            )
                                        }

                                    </div>


                                    {/* CORREO */}

                                    <div className="form-group">

                                        <label htmlFor="correo">
                                            Correo electrónico *
                                        </label>


                                        <input
                                            id="correo"
                                            type="email"
                                            name="correo"
                                            value={
                                                form.correo
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Ej: paciente@email.com"
                                            autoComplete="email"
                                        />


                                        {
                                            errores.correo && (

                                                <span className="form-error">

                                                    {
                                                        errores.correo
                                                    }

                                                </span>

                                            )
                                        }

                                    </div>


                                    {/* FECHA NACIMIENTO */}

                                    <div className="form-group">

                                        <label htmlFor="fechaNacimiento">
                                            Fecha de nacimiento
                                        </label>


                                        <input
                                            id="fechaNacimiento"
                                            type="date"
                                            name="fechaNacimiento"
                                            value={
                                                form.fechaNacimiento
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />


                                        {
                                            errores.fechaNacimiento && (

                                                <span className="form-error">

                                                    {
                                                        errores.fechaNacimiento
                                                    }

                                                </span>

                                            )
                                        }

                                    </div>

                                </div>


                                {/* DIRECCIÓN */}

                                <div className="form-group full">

                                    <label htmlFor="direccion">
                                        Dirección
                                    </label>


                                    <input
                                        id="direccion"
                                        type="text"
                                        name="direccion"
                                        value={
                                            form.direccion
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Ej: Av. Mariscal López 1234, Asunción"
                                        autoComplete="street-address"
                                    />

                                </div>


                                {/* ACCIONES */}

                                <div className="form-actions">


                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={
                                            cancelar
                                        }
                                    >
                                        Cancelar
                                    </button>


                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        Guardar paciente
                                    </button>

                                </div>

                            </form>

                        </section>


                        {/* PANEL INFORMATIVO */}

                        <aside className="validation-card">


                            <div className="validation-icon">
                                ⓘ
                            </div>


                            <h3>
                                Validación de datos
                            </h3>


                            <p>
                                MediTurnos verifica los campos
                                obligatorios antes de registrar
                                al paciente.
                            </p>


                            <p>
                                También controla que la cédula
                                contenga solamente números y
                                que no exista otro paciente
                                registrado con la misma cédula.
                            </p>


                            <p>
                                El correo electrónico y el
                                teléfono también son validados
                                antes de guardar.
                            </p>


                            <p>
                                Una vez registrado, el paciente
                                quedará disponible inmediatamente
                                para agendar nuevos turnos.
                            </p>

                        </aside>

                    </div>

                </div>

            </main>

        </div>
    );
}