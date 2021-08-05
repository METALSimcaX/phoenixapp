export const environment = {
    production: false,
    mandante: 100,
    defaultClient: '0005000000', // Cliente Mostrador
    tiempoAire: '50000123', // Servicio De Tiempo Aire
    mercurioComision: '50000069', // Mercurio Comisión Servicios Terceros
    mercurioCobro: '50000124', // Mercurio Cobro A Terceros
    abonoFinancing: '50000007', // Abono MacroPay
    urlStock: 'http://201.149.34.175:8001', // URL API SAP STOCK
    urlPayjoy: 'https://sandbox.payjoy.com/api/partner', // API PAYJOY 
    urlReanudarFin: 'http://10.1.2.15:8001', // API Reanudar Ticket: Listar y Notificar
    urlInfoAbonoComp:'dev/balance', // Extra de la ruta para serivicios.grupomacro
	urlInfoAbono: 'https://servicios.grupomacro.mx:4444', // API Get info abono SL
	urlSaveAbono: 'https://www.testappcredito.macropay.com.mx', // API Registrar Abono MacroPay
    authUserMP: 'CustomerPayment', // Authorization for API https://testcredito.macropay.com.mx
	authPassMP: 'r0irjhv20cl0z3c36r' // Authorization for API MacroPay https://testcredito.macropay.com.mx
};