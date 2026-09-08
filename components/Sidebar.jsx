"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {

    const pathname = usePathname();

    const isActive = (route) => {

        if (route === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(route);
    };


    return (
        <aside className="sidebar">

            <div className="logo">

                <span className="logo-icon">
                    ✳
                </span>

                <span>
                    MediTurnos
                </span>

            </div>


            <nav className="menu">

                <Link
                    href="/"
                    className={
                        `menu-item ${
                            isActive("/")
                                ? "active"
                                : ""
                        }`
                    }
                >
                    <span>▦</span>

                    Panel Principal
                </Link>


                <Link
                    href="/pacientes"
                    className={
                        `menu-item ${
                            isActive("/pacientes")
                                ? "active"
                                : ""
                        }`
                    }
                >
                    <span>♙</span>

                    Gestión de Pacientes
                </Link>


                <Link
                    href="/turnos"
                    className={
                        `menu-item ${
                            isActive("/turnos")
                                ? "active"
                                : ""
                        }`
                    }
                >
                    <span>▣</span>

                    Gestión de Turnos
                </Link>

            </nav>


            <div className="user">

                <div className="avatar">
                    AG
                </div>

                <div>

                    <strong>
                        Ana Gómez
                    </strong>

                    <small>
                        Secretaría
                    </small>

                </div>

            </div>

        </aside>
    );
}