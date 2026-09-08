import "./globals.css";

export const metadata = {
    title: "MediTurnos",
    description: "Sistema Web de Gestión de Citas y Turnos Médicos",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                {children}
            </body>
        </html>
    );
}