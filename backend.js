document.addEventListener("DOMContentLoaded", () => {
  const helpForm = document.querySelector("#help-form");

  if (helpForm) {
    const form = helpForm;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if ($(form).parsley().isValid()) {
        form.reset();
        $(form).parsley().reset();
        window.openModal("#get-help-success");
      }
    });
  }
  const thanksForm = document.querySelector("#thanks-form");

  if (thanksForm) {
    const form = helpForm;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if ($(form).parsley().isValid()) {
        form.reset();
        $(form).parsley().reset();
        window.openModal("#thanks-success");
      }
    });
  }
});
