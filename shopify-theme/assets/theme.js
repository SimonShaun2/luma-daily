(function () {
  document.documentElement.classList.add("luma-theme-loaded");

  function initProductFilters() {
    var tabs = document.querySelectorAll(".filter-tab[data-filter]");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.dataset.filter || "all";
        tabs.forEach(function (item) {
          item.classList.toggle("filter-tab--active", item === tab);
          item.setAttribute("aria-selected", item === tab ? "true" : "false");
        });

        document.querySelectorAll(".product-card[data-tags]").forEach(function (card) {
          var tags = card.dataset.tags || "";
          card.hidden = filter !== "all" && tags.indexOf(filter) === -1;
        });
      });
    });
  }

  function initQuiz() {
    var quiz = document.querySelector("[data-luma-quiz]");
    if (!quiz) return;

    var state = { step: 1, answers: {}, products: {} };
    var steps = Array.prototype.slice.call(quiz.querySelectorAll(".quiz-step"));
    var back = quiz.querySelector("[data-quiz-back]");
    var next = quiz.querySelector("[data-quiz-next]");
    var progress = quiz.querySelector("[data-quiz-progress]");
    var label = quiz.querySelector("[data-quiz-step-label]");
    var percent = quiz.querySelector("[data-quiz-percent]");

    function progressValue(step) {
      return step === 1 ? 0 : step === 2 ? 33 : step === 3 ? 67 : 100;
    }

    function render() {
      steps.forEach(function (stepEl) {
        stepEl.classList.toggle("is-active", Number(stepEl.dataset.step) === state.step);
      });
      var value = progressValue(state.step);
      if (progress) progress.style.width = value + "%";
      if (label) label.textContent = "Step " + state.step + " of 4";
      if (percent) percent.textContent = value + "%";
      if (back) back.disabled = state.step === 1;
      if (next) {
        next.disabled = !state.answers[state.step];
        next.textContent = state.step === 4 ? "See My Ritual" : "Next";
      }
    }

    function selectOption(button) {
      var activeStep = Number(button.closest(".quiz-step").dataset.step);
      state.answers[activeStep] = button.dataset.answer;
      if (button.dataset.product) state.products.primary = button.dataset.product;
      button.closest(".quiz-options").querySelectorAll(".quiz-option").forEach(function (option) {
        option.classList.toggle("is-selected", option === button);
      });
      render();
    }

    function recommendedHandles() {
      var primary = state.products.primary || "luma-energy-gummies";
      var routine = state.answers[3] || "simple";
      var handles;

      if (routine === "full") {
        handles = ["luma-energy-gummies", "luma-calm-gummies", "luma-sleep-gummies", "luma-glow-gummies", "luma-focus-gummies", "luma-gut-gummies"];
      } else if (routine === "balanced") {
        handles = primary === "luma-glow-gummies" || primary === "luma-gut-gummies"
          ? [primary, "luma-energy-gummies", "luma-calm-gummies"]
          : [primary, "luma-calm-gummies", "luma-sleep-gummies"];
      } else {
        handles = [primary];
      }

      return handles.filter(function (handle, index) {
        return handles.indexOf(handle) === index;
      });
    }

    function fetchVariant(handle) {
      return fetch("/products/" + handle + ".js")
        .then(function (response) {
          if (!response.ok) throw new Error("Product not found: " + handle);
          return response.json();
        })
        .then(function (product) {
          return product.variants && product.variants[0] ? product.variants[0].id : null;
        })
        .catch(function () {
          return null;
        });
    }

    function completeQuiz() {
      if (!next || next.disabled) return;
      next.disabled = true;
      next.textContent = "Building...";

      Promise.all(recommendedHandles().map(fetchVariant))
        .then(function (variantIds) {
          var items = variantIds.filter(Boolean).map(function (id) {
            return { id: id, quantity: 1 };
          });
          if (!items.length) {
            window.location.href = "/collections/all";
            return null;
          }
          return fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: items })
          });
        })
        .then(function () {
          var cartButton = document.querySelector("[data-cart-trigger]");
          if (cartButton) cartButton.click();
          else window.location.href = "/cart";
        })
        .catch(function () {
          window.location.href = "/cart";
        })
        .finally(function () {
          next.disabled = false;
          next.textContent = "See My Ritual";
        });
    }

    quiz.querySelectorAll(".quiz-option").forEach(function (button) {
      button.addEventListener("click", function () {
        selectOption(button);
      });
    });

    if (back) {
      back.addEventListener("click", function () {
        state.step = Math.max(1, state.step - 1);
        render();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        if (!state.answers[state.step]) return;
        if (state.step === 4) completeQuiz();
        else {
          state.step += 1;
          render();
        }
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProductFilters();
    initQuiz();
  });
})();
