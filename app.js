document.addEventListener("DOMContentLoaded", () => {
  const setWidth = () => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.setProperty(
      "--sb-width",
      scrollbarWidth + "px"
    );
  };

  setWidth();

  window.addEventListener("resize", setWidth);

  const lockScroll = bodyScrollLock.disableBodyScroll;
  const unlockScroll = bodyScrollLock.clearAllBodyScrollLocks;

  window.activeModal = null;

  function openModal(id, event) {
    const modal = document.querySelector(`.js-modal${id}`);
    if (!modal) {
      // console.error(`Modal with ID: ${id} not found`);
      return;
    }

    if (typeof window.closeMenu === "function") {
      window.closeMenu();
    }

    if (event) {
      event.preventDefault();
    }

    console.log("Opening modal", modal);

    const openHandler = () => {
      lockScroll(modal, {
        reserveScrollBarGap: true,
      });
      modal.classList.add("active");
      document.body.classList.add("modal-open");
      window.activeModal = modal;

      const openModalEvent = new CustomEvent("openmodal");
      document.dispatchEvent(openModalEvent);
    };
    if (window.activeModal) {
      closeModal(window.activeModal);

      setTimeout(() => {
        openHandler();
      }, 400);
    } else {
      openHandler();
    }
  }

  function closeModal(modal) {
    document.body.classList.remove("modal-open");
    unlockScroll();

    modal.classList.remove("active");

    window.activeModal = null;

    const closeModalEvent = new CustomEvent("closemodal");
    document.dispatchEvent(closeModalEvent);
  }

  window.openModal = openModal;

  window.closeModal = closeModal;

  document.addEventListener("click", (event) => {
    if (event.target.matches("a") || event.target.closest("a")) {
      const link = event.target.matches("a")
        ? event.target
        : event.target.closest("a");
      const hash = link.hash;
      if (!hash) return;
      openModal(hash, event);
    } else if (
      event.target.matches(".js-close-modal") ||
      event.target.closest(".js-close-modal")
    ) {
      event.preventDefault();
      const modalToClose = event.target.closest(".js-modal");
      closeModal(modalToClose);
    } else if (event.target.matches(".js-modal")) {
      event.preventDefault();
      const modalToClose = event.target;
      closeModal(modalToClose);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.which === 27 && window.activeModal) {
      closeModal(window.activeModal);
    }
  });

  window.Parsley.addValidator("phone", {
    requirementType: "string",
    validateString: function (value) {
      if (value.trim() === "") return true;
      return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
        value
      );
    },
    messages: {
      en: "This value should be a mobile number",
      ru: "Введите правильный номер мобильного телефона",
    },
  });

  Parsley.addMessages("ru", {
    defaultMessage: "Некорректное значение.",
    type: {
      email: "В данном поле может быть только E-mail",
      url: "Адрес сайта введен неверно.",
      number: "Введите число.",
      integer: "Введите целое число.",
      digits: "Введите только цифры.",
      alphanum: "Введите буквенно-цифровое значение.",
    },
    notblank: "Это поле должно быть заполнено.",
    required: "Обязательное поле",
    pattern: "Это значение некорректно.",
    min: "Это значение должно быть не менее чем %s.",
    max: "Это значение должно быть не более чем %s.",
    range: "Это значение должно быть от %s до %s.",
    minlength: "Это значение должно содержать не менее %s символов.",
    maxlength: "Это значение должно содержать не более %s символов.",
    length: "Это значение должно содержать от %s до %s символов.",
    mincheck: "Выберите не менее %s значений.",
    maxcheck: "Выберите не более %s значений.",
    check: "Выберите от %s до %s значений.",
    equalto: "Это значение должно совпадать.",
  });

  Parsley.setLocale("ru");

  const formsToValidate = Array.from(
    document.querySelectorAll("form[data-need-validation]")
  );

  formsToValidate.forEach((form) => {
    $(form).parsley();
  });

  const phoneInputs = Array.from(document.querySelectorAll(".js-phone-input"));

  phoneInputs.forEach((input) => {
    const instance = new Inputmask({ mask: "+7 (999) 999-99-99" });
    instance.mask(input);
  });

  const onlyNumericInputsNoFormatting = Array.from(
    document.querySelectorAll(".js-numeric-input")
  );

  onlyNumericInputsNoFormatting.forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.value;
      const newCleanedValue = parseInt(value.replace(/[^\d]+/g, ""), 10);
      if (isNaN(newCleanedValue)) {
        input.value = "";
      } else {
        input.value = newCleanedValue;
      }
    });
  });
});
