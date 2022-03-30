document.addEventListener("DOMContentLoaded", () => {
  const helpForm = document.querySelector("#help-form");

  if (helpForm) {
    const form = helpForm;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if ($(form).parsley().isValid()) {
        const url = form.action;
        const formData = new FormData(form);
        const errorContainer = form.querySelector(".help-modal__get-error");

        fetch(url, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response.json();
          })
          .then((data) => {
            console.log("Data", data);
            if (data.success == true) {
              form.reset();
              $(form).parsley().reset();
              console.log("Opening modal");
              window.openModal("#get-help-success");
              errorContainer.style.display = "none";
              errorContainer.textContent = "";
            } else {
              $(form).parsley().reset();
              errorContainer.style.display = "block";
              errorContainer.textContent = data.error;
            }
          })
          .catch((err) => {
            console.error(err);
            $(form).parsley().reset();
            errorContainer.style.display = "block";
            errorContainer.textContent = err.status + " : " + err.statusText;
          });
      }
    });
  }

 

  const thanksForm = document.querySelector("#thanks-form");

  if (thanksForm) {
    const form = thanksForm;

    const input = thanksForm.querySelector("input");
    const submitBtn = thanksForm.querySelector('button[type="submit"]');
    const statusFound = thanksForm.querySelector(".js-status-found");
    const statusNotFound = thanksForm.querySelector(".js-status-not-found");
    const statusError = thanksForm.querySelector(".js-status-error");

    const statuses = [statusFound, statusError, statusNotFound];

    const dataCheckUrl = input.getAttribute("data-check-url");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if ($(form).parsley().isValid()) {
        const url = form.action;
        const formData = new FormData(form);

        fetch(url, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response.json();
          })
          .then((data) => {
            console.log("Data", data);
            form.reset();
            statuses.forEach((status) => status.classList.remove("shown"));
            $(form).parsley().reset();
            window.openModal("#thanks-success");
          })
          .catch((err) => {
            console.error(err);
            statuses.forEach((status) => status.classList.remove("shown"));
            statusError.classList.add("shown");
          });
      }
    });

    const checkNumber = () => {
      if (!input.value.trim()) {
        submitBtn.disabled = true;
        input.classList.remove("request-error");
        statuses.forEach((status) => status.classList.remove("shown"));
        return;
      }

      fetch(`${dataCheckUrl}/${input.value.trim()}`, {
        method: "GET",
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
    };

    input.addEventListener("input", debounce(checkNumber, 300));
  }
});
