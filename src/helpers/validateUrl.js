function validateUrl(url) {
    // Definimos las listas de control
    const allowedHosts = [
        'api.proveedor.com',
        'proveedor-seguro.net'
    ];
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];

    try {
        // Usamos la clase URL nativa para desarmar y analizar la peticion
        const parsedUrl = new URL(url);

        // Verificamos que el protocolo sea estrictamente HTTP o HTTPS
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            console.error("[SEGURIDAD] Protocolo bloqueado:", parsedUrl.protocol);
            return false;
        }

        // Verificamos que el dominio esté en nuestra lista blanca
        if (!allowedHosts.includes(parsedUrl.hostname)) {
            console.error("[SEGURIDAD] Dominio no autorizado:", parsedUrl.hostname);
            return false;
        }

        // Bloqueamos explicitamente resoluciones a redes locales
        if (blockedHosts.includes(parsedUrl.hostname)) {
            console.error("[SEGURIDAD] Intento de escaneo de red interna bloqueado.");
            return false;
        }

        // si pasa todas las pruebas, devolvemos la URL intacta 
        // para que la ruta pueda procesarla de forma segura.
        return url;

    } catch (error) {
        // Si new URL() arroja un error, la URL enviada tiene un formato malicioso o invalido
        console.error("[SEGURIDAD] URL mal formada o inválida detectada.");
        return false;
    }
}

module.exports = { validateUrl };
