Spanish below

 directly from the database)

Approve or Reject Professor Change Request
Route: PUT /admin/approve-request/:requestId

Description: Allows an administrator to approve or reject a specific professor change request by its request ID.

Access: Private (Authentication is required)

Path Parameters:

requestId (string): The ID of the request to be approved or rejected.
Request:

PUT /admin/approve-request/:requestId
Responses:

200 OK: Returns a JSON object indicating the success of the action.
404 Not Found: If the specified request ID does not exist.
403 Forbidden: If the user does not have authorization to approve requests.
Reservation Routes
Create Reservation
Route: POST /create

Description: Allows a user to create a reservation request for a professor.

Access: Private (Authentication is required)

Request:

POST /create
Responses:

201 Created: Returns a JSON object with a success message.
500 Internal Server Error: If an error occurs during the reservation creation process.
Approve or Reject Reservation
Route: PUT /approve/:reservationId

Description: Allows a professor to approve or reject a reservation request by its ID.

Access: Private (Authentication is required)

Path Parameters:

reservationId (string): The ID of the reservation to be approved or rejected.
Request:

PUT /approve/:reservationId
Responses:

200 OK: Returns a JSON object indicating the success of the action.
403 Forbidden: If the professor does not have authorization to approve or reject the reservation.
404 Not Found: If the specified reservation ID does not exist.
500 Internal Server Error: If an error occurs during the update of the reservation status.
Correct Reservation
Route: PUT /correct/:reservationId

Description: Allows a professor to correct a reservation request if it has been rejected, and it's within a specific time frame.

Access: Private (Authentication is required)

Path Parameters:

reservationId (string): The ID of the reservation to be corrected.
Responses:

200 OK: Returns a JSON object indicating the success of the correction.
400 Bad Request: If it's not possible to correct the reservation at the moment.
403 Forbidden: If the professor does not have authorization to correct



---------------------------------------------------------------------------------------------
Sistema de Reservas - Backend
Este proyecto consiste en un backend desarrollado en Node.js y Express con una base de datos PostgreSQL. El sistema permite la creación de reservas con profesores o médicos, proporcionando una solución para la gestión de citas y reservas en entornos de servicios profesionales.

Estructura de la Base de Datos
La base de datos se estructura de la siguiente manera:

Registro de Usuario
Ruta: POST /register

Descripción: Registra un nuevo usuario con los detalles proporcionados.

Cuerpo de la Solicitud:

nombre (string): Nombre del usuario.
apellido (string): Apellido del usuario.
email (string): Dirección de correo electrónico del usuario.
password (string): Contraseña del usuario.
Respuestas:

201 Creado: Si el registro es exitoso.
400 Solicitud Incorrecta: Si el correo electrónico ya está en uso o la contraseña no cumple con los criterios.
500 Error Interno del Servidor: Si ocurre un error durante el registro.
Cambio de Contraseña
Ruta: PUT /change-password

Descripción: Permite a un usuario cambiar su contraseña.

Cuerpo de la Solicitud:

oldPassword (string): Contraseña actual del usuario.
newPassword (string): Nueva contraseña del usuario.
Respuestas:

200 OK: Si el cambio de contraseña es exitoso.
400 Solicitud Incorrecta: Si la contraseña anterior es incorrecta o la nueva contraseña no cumple con los criterios.
500 Error Interno del Servidor: Si ocurre un error durante el proceso de cambio de contraseña.
Actualizar Perfil de Usuario
Ruta: PUT /profile

Descripción: Permite a un usuario actualizar su información de perfil (nombre, apellido y número de teléfono).

Cuerpo de la Solicitud:

nombre (string): Nombre actualizado del usuario.
apellido (string): Apellido actualizado del usuario.
telefono (string): Número de teléfono actualizado del usuario.
Respuestas:

200 OK: Si la actualización del perfil es exitosa.
500 Error Interno del Servidor: Si ocurre un error durante el proceso de actualización del perfil.
Eliminar Cuenta de Usuario
Ruta: DELETE /delete-account

Descripción: Permite a un usuario eliminar su cuenta.

Respuestas:

200 OK: Si la eliminación de la cuenta es exitosa.
500 Error Interno del Servidor: Si ocurre un error durante el proceso de eliminación de la cuenta.
Rutas de Administrador
Listar Solicitudes Pendientes
Ruta: GET /admin/pending-requests

Descripción: Esta ruta permite a un administrador recuperar una lista de solicitudes pendientes que requieren su atención.

Acceso: Privado (se requiere autenticación)

Controlador: adminController.getPendingRequests

Aprobar Solicitud de Profesor por ID
Ruta: PUT /admin/approve-professor-request/:requestId

Descripción: Esta ruta permite a un administrador aprobar una solicitud específica de un profesor utilizando su ID de solicitud.

Acceso: Privado (se requiere autenticación)

Parámetros de Ruta:

requestId (string): El ID de la solicitud que se va a aprobar.
Controlador: adminController.approveProfessorRequest

Listar Solicitudes de Cambio de Profesor
Ruta: GET /admin/requests

Descripción: Permite a un administrador ver las solicitudes de cambios en el estado de un profesor.

Acceso: Privado (se requiere autenticación)

Controlador: N/A (Esta ruta obtiene datos directamente de la base de datos)

Aprobar o Rechazar Solicitud de Cambio de Profesor
Ruta: PUT /admin/approve-request/:requestId

Descripción: Permite a un administrador aprobar o rechazar una solicitud específica de cambio de profesor mediante su ID de solicitud.

Acceso: Privado (se requiere autenticación)

Parámetros de Ruta:

requestId (string): El ID de la solicitud que se va a aprobar o rechazar.
Solicitud:

PUT /admin/approve-request/:requestId
Respuestas:

200 OK: Devuelve un objeto JSON que indica el éxito de la acción.
404 No Encontrado: Si el ID de solicitud especificado no existe.
403 Prohibido: Si el usuario no tiene autorización para aprobar solicitudes.
Rutas de Reservas
Crear Reserva
Ruta: POST /create

Descripción: Permite a un usuario crear una solicitud de reserva para un profesor.

Acceso: Privado (se requiere autenticación)

Solicitud:

POST /create
Respuestas:

201 Creado: Devuelve un objeto JSON con un mensaje de éxito.
500 Error Interno del Servidor: Si ocurre un error durante el proceso de creación de la reserva.
Aprobar o Rechazar Reserva
Ruta: PUT /approve/:reservationId

Descripción: Permite a un profesor aprobar o rechazar una solicitud de reserva mediante su ID.

Acceso: Privado (se requiere autenticación)

Parámetros de Ruta:

reservationId (string): El ID de la reserva que se va a aprobar o rechazar.
Solicitud:

PUT /approve/:reservationId
Respuestas:

200 OK: Devuelve un objeto JSON que indica el éxito de la acción.
403 Prohibido: Si el profesor no tiene autorización para aprobar o rechazar la reserva.
404 No Encontrado: Si el ID de reserva especificado no existe.
500 Error Interno del Servidor: Si ocurre un error durante la actualización del estado de la reserva.
Corregir Reserva
Ruta: PUT /correct/:reservationId

Descripción: Permite a un profesor corregir una solicitud de reserva si ha sido rechazada y se encuentra dentro de un marco de tiempo específico.

Acceso: Privado (se requiere autenticación)

Parámetros de Ruta:

reservationId (string): El ID de la reserva que se va a corregir.
Respuestas:

200 OK: Devuelve un objeto JSON que indica el éxito de la corrección.
400 Solicitud Incorrecta: Si no es posible corregir la reserva en ese momento.
403 Prohibido: