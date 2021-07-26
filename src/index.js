// JS Goes here - ES6 supported

import "./css/main.css";

import Range from "./range";
import Snackbar from "./snackbar";

document.addEventListener("DOMContentLoaded", () => {
  const range = new Range(document.getElementById("range"));
  const apiEndpoint = process.env.NODE_ENV === "production" ? "https://moon.aerokube.com/trial" : "http://localhost:8080/trial";
  const reset = function() {
    grecaptcha.reset();
  };
  const notify = function(color, message) {
    Snackbar.show({
      backgroundColor: color,
      pos: "top-center",
      showAction: false,
      duration: 7000,
      text: message
    });
  };
  const success = function(message) {
    notify("#43a047", message);
  };
  const failure = function(message) {
    notify("#d32f2f", message);
  };
  window.onSubmit = function() {
    $.ajax({
      url: apiEndpoint,
      data: $("form#trial-form").serialize(),
      success: function() {
        success("Done! We will contact you shortly.");
        reset();
      },
      error: function(xhr) {
        failure(`Failed to request Moon Cloud trial: ${xhr.responseText}`);
        reset();
      }
    });
  };
});
