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

    const input = thanksForm.querySelector("input");
    const submitBtn = thanksForm.querySelector('button[type="submit"]');
    const statusFound = thanksForm.querySelector(".js-status-found");
    const statusNotFound = thanksForm.querySelector(".js-status-not-found");
    const statusError = thanksForm.querySelector(".js-status-error");

    const statuses = [statusFound, statusError, statusNotFound];

    input.addEventListener("input", () => {
      if (!input.value.trim()) {
        submitBtn.disabled = true;
        input.classList.remove("request-error");
        statuses.forEach((status) => status.classList.remove("shown"));
        return;
      }
      
      const formData = new FormData(form);

      const url = form.action;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status == 404) {
              submitBtn.disabled = true;
              input.classList.add("request-error");
              statuses.forEach((status) => status.classList.remove("shown"));
              statusNotFound.classList.add("shown");

              return;
            } else {
              const responseError = {
                statusText: response.statusText,
                status: response.status,
              };
              throw responseError;
            }
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);

          submitBtn.disabled = false;
          input.classList.remove("request-error");
          statuses.forEach((status) => status.classList.remove("shown"));
          statusFound.classList.add("shown");
        })
        .catch((err) => {
          submitBtn.disabled = true;
          input.classList.add("request-error");
          statuses.forEach((status) => status.classList.remove("shown"));
          statusError.classList.add("shown");
          console.error(err);
        });
    });

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
