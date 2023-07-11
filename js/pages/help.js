/*Bloque 1 */
emailjs.init("Eg6N9On_YF_oNoQ0g");

/*Bloque 2 */
window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);
});

/*Bloque 3 */
function handleSubmit(event) {
  event.preventDefault();

  // Obtén los valores de los campos del formulario
  const name = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("mensaje").value;

  // Envía el email utilizando EmailJS
  sendEmail(name, email, message)
    .then(() => {
      showMessage("success-message", "Mensaje enviado con éxito");
      clearForm();
    })
    .catch((error) => {
      showMessage("error-message", "Error al enviar el mensaje");
      console.error("Error al enviar el mensaje:", error);
    });
}

/*Bloque 4 */
function sendEmail(name, email, message) {
  // Configura los parámetros de EmailJS
  const serviceID = "service_et273tm"; 
  const templateID = "template_ddg9qr9";

  // Crea el objeto de parámetros para enviar el email
  const params = {
    from_name: name,
    from_email: email,
    message: message,
  };

  // Envía la solicitud para enviar el email
  return emailjs.send(serviceID, templateID, params);
}

/*Bloque 5 */
function clearForm() {
  // Limpia los campos del formulario
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mensaje").value = "";
}

/*Bloque 6 */
function showMessage(messageType, messageText) {
  const messagesContainer = document.getElementById("sec-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add(messageType);
  messageElement.textContent = messageText;

  messagesContainer.appendChild(messageElement);

  setTimeout(() => {
    messagesContainer.removeChild(messageElement);
  }, 3000);
}
