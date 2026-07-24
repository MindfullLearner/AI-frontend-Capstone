/**
 * ThinkLens — Decision Setup form
 * Handles dynamic options/criteria and client-side validation.
 */

const MIN_TITLE_LENGTH = 5;
const MIN_CONTEXT_LENGTH = 20;
const MIN_OPTIONS = 2;
const MIN_CRITERIA = 1;
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 5;

const form = document.getElementById("decision-form");
const optionsList = document.getElementById("options-list");
const criteriaList = document.getElementById("criteria-list");
const addOptionBtn = document.getElementById("add-option-btn");
const addCriterionBtn = document.getElementById("add-criterion-btn");
const summarySection = document.getElementById("summary-section");
const summaryContent = document.getElementById("summary-content");
const editDecisionBtn = document.getElementById("edit-decision-btn");

let optionCounter = 0;
let criterionCounter = 0;

function createOptionRow(value = "") {
  optionCounter += 1;
  const id = optionCounter;

  const row = document.createElement("div");
  row.className = "dynamic-row";
  row.dataset.optionId = String(id);

  const label = document.createElement("label");
  label.setAttribute("for", `option-${id}`);
  label.textContent = `Option ${optionsList.children.length + 1}`;

  const input = document.createElement("input");
  input.type = "text";
  input.id = `option-${id}`;
  input.name = `option-${id}`;
  input.className = "option-input";
  input.value = value;
  input.setAttribute("aria-describedby", "options-error");
  input.autocomplete = "off";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-remove";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => removeOptionRow(row));

  row.append(label, input, removeBtn);
  return row;
}

function createCriterionRow(name = "", weight = MIN_WEIGHT) {
  criterionCounter += 1;
  const id = criterionCounter;

  const row = document.createElement("div");
  row.className = "dynamic-row";
  row.dataset.criterionId = String(id);

  const label = document.createElement("label");
  label.setAttribute("for", `criterion-name-${id}`);
  label.textContent = `Criterion ${criteriaList.children.length + 1}`;

  const fields = document.createElement("div");
  fields.className = "criterion-fields";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = `criterion-name-${id}`;
  nameInput.name = `criterion-name-${id}`;
  nameInput.className = "criterion-name";
  nameInput.value = name;
  nameInput.placeholder = "Criterion name";
  nameInput.setAttribute("aria-label", `Criterion ${criteriaList.children.length + 1} name`);
  nameInput.setAttribute("aria-describedby", "criteria-error");
  nameInput.autocomplete = "off";

  const weightSelect = document.createElement("select");
  weightSelect.id = `criterion-weight-${id}`;
  weightSelect.name = `criterion-weight-${id}`;
  weightSelect.className = "criterion-weight";
  weightSelect.setAttribute("aria-label", `Criterion ${criteriaList.children.length + 1} weight`);

  for (let value = MIN_WEIGHT; value <= MAX_WEIGHT; value += 1) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    weightSelect.append(option);
  }

  weightSelect.value = String(weight);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-remove";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => removeCriterionRow(row));

  fields.append(nameInput, weightSelect);
  row.append(label, fields, removeBtn);
  return row;
}

function refreshOptionLabels() {
  const rows = optionsList.querySelectorAll(".dynamic-row");
  rows.forEach((row, index) => {
    const label = row.querySelector("label");
    if (label) {
      label.textContent = `Option ${index + 1}`;
    }
  });
}

function refreshCriterionLabels() {
  const rows = criteriaList.querySelectorAll(".dynamic-row");
  rows.forEach((row, index) => {
    const label = row.querySelector("label");
    const nameInput = row.querySelector(".criterion-name");
    const weightSelect = row.querySelector(".criterion-weight");

    if (label) {
      label.textContent = `Criterion ${index + 1}`;
    }
    if (nameInput) {
      nameInput.setAttribute("aria-label", `Criterion ${index + 1} name`);
    }
    if (weightSelect) {
      weightSelect.setAttribute("aria-label", `Criterion ${index + 1} weight`);
    }
  });
}

function updateRemoveButtons() {
  const optionRows = optionsList.querySelectorAll(".dynamic-row");
  const criterionRows = criteriaList.querySelectorAll(".dynamic-row");

  optionRows.forEach((row) => {
    const removeBtn = row.querySelector(".btn-remove");
    removeBtn.disabled = optionRows.length <= MIN_OPTIONS;
  });

  criterionRows.forEach((row) => {
    const removeBtn = row.querySelector(".btn-remove");
    removeBtn.disabled = criterionRows.length <= MIN_CRITERIA;
  });
}

function addOptionRow(value = "") {
  optionsList.append(createOptionRow(value));
  refreshOptionLabels();
  updateRemoveButtons();
}

function removeOptionRow(row) {
  if (optionsList.children.length <= MIN_OPTIONS) {
    return;
  }

  row.remove();
  refreshOptionLabels();
  updateRemoveButtons();
}

function addCriterionRow(name = "", weight = MIN_WEIGHT) {
  criteriaList.append(createCriterionRow(name, weight));
  refreshCriterionLabels();
  updateRemoveButtons();
}

function removeCriterionRow(row) {
  if (criteriaList.children.length <= MIN_CRITERIA) {
    return;
  }

  row.remove();
  refreshCriterionLabels();
  updateRemoveButtons();
}

function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.hidden = false;
}

function clearError(errorElement) {
  errorElement.textContent = "";
  errorElement.hidden = true;
}

function setFieldInvalid(field, isInvalid) {
  field.setAttribute("aria-invalid", isInvalid ? "true" : "false");
}

function getOptionValues() {
  return Array.from(optionsList.querySelectorAll(".option-input")).map((input) =>
    input.value.trim()
  );
}

function getCriteriaValues() {
  return Array.from(criteriaList.querySelectorAll(".dynamic-row")).map((row) => {
    const name = row.querySelector(".criterion-name").value.trim();
    const weight = Number(row.querySelector(".criterion-weight").value);
    return { name, weight };
  });
}

function validateForm() {
  let isValid = true;

  const titleInput = document.getElementById("decision-title");
  const contextInput = document.getElementById("decision-context");
  const categorySelect = document.getElementById("decision-category");

  const titleError = document.getElementById("title-error");
  const contextError = document.getElementById("context-error");
  const categoryError = document.getElementById("category-error");
  const optionsError = document.getElementById("options-error");
  const criteriaError = document.getElementById("criteria-error");

  clearError(titleError);
  clearError(contextError);
  clearError(categoryError);
  clearError(optionsError);
  clearError(criteriaError);

  setFieldInvalid(titleInput, false);
  setFieldInvalid(contextInput, false);
  setFieldInvalid(categorySelect, false);

  optionsList.querySelectorAll(".option-input").forEach((input) => setFieldInvalid(input, false));
  criteriaList.querySelectorAll(".criterion-name").forEach((input) => setFieldInvalid(input, false));
  criteriaList.querySelectorAll(".criterion-weight").forEach((select) => setFieldInvalid(select, false));

  const title = titleInput.value.trim();
  if (!title) {
    showError(titleError, "Decision title is required.");
    setFieldInvalid(titleInput, true);
    isValid = false;
  } else if (title.length < MIN_TITLE_LENGTH) {
    showError(titleError, `Decision title must be at least ${MIN_TITLE_LENGTH} characters.`);
    setFieldInvalid(titleInput, true);
    isValid = false;
  }

  const context = contextInput.value.trim();
  if (!context) {
    showError(contextError, "Decision context is required.");
    setFieldInvalid(contextInput, true);
    isValid = false;
  } else if (context.length < MIN_CONTEXT_LENGTH) {
    showError(contextError, `Decision context must be at least ${MIN_CONTEXT_LENGTH} characters.`);
    setFieldInvalid(contextInput, true);
    isValid = false;
  }

  const category = categorySelect.value;
  if (!category) {
    showError(categoryError, "Please select a category.");
    setFieldInvalid(categorySelect, true);
    isValid = false;
  }

  const options = getOptionValues();
  const optionInputs = optionsList.querySelectorAll(".option-input");

  if (options.length < MIN_OPTIONS) {
    showError(optionsError, `Add at least ${MIN_OPTIONS} options.`);
    isValid = false;
  } else {
    const emptyOptionIndexes = options
      .map((value, index) => (value ? null : index))
      .filter((index) => index !== null);

    if (emptyOptionIndexes.length > 0) {
      showError(optionsError, "Each option must contain text.");
      emptyOptionIndexes.forEach((index) => setFieldInvalid(optionInputs[index], true));
      isValid = false;
    }
  }

  const criteria = getCriteriaValues();
  const criterionRows = criteriaList.querySelectorAll(".dynamic-row");

  if (criteria.length < MIN_CRITERIA) {
    showError(criteriaError, `Add at least ${MIN_CRITERIA} evaluation criterion.`);
    isValid = false;
  } else {
    let criteriaMessage = "";

    criteria.forEach((criterion, index) => {
      const nameInput = criterionRows[index].querySelector(".criterion-name");
      const weightSelect = criterionRows[index].querySelector(".criterion-weight");
      let rowInvalid = false;

      if (!criterion.name) {
        criteriaMessage = "Each criterion must have a name.";
        rowInvalid = true;
      }

      if (
        Number.isNaN(criterion.weight) ||
        criterion.weight < MIN_WEIGHT ||
        criterion.weight > MAX_WEIGHT
      ) {
        criteriaMessage = `Each criterion weight must be between ${MIN_WEIGHT} and ${MAX_WEIGHT}.`;
        rowInvalid = true;
      }

      if (rowInvalid) {
        setFieldInvalid(nameInput, !criterion.name);
        setFieldInvalid(weightSelect, Number.isNaN(criterion.weight) || criterion.weight < MIN_WEIGHT || criterion.weight > MAX_WEIGHT);
        isValid = false;
      }
    });

    if (criteriaMessage) {
      showError(criteriaError, criteriaMessage);
    }
  }

  return isValid;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSummary(decision) {
  const optionsHtml = decision.options
    .map((option) => `<li>${escapeHtml(option)}</li>`)
    .join("");

  const criteriaHtml = decision.criteria
    .map(
      (criterion) =>
        `<li>${escapeHtml(criterion.name)} <span class="summary-weight">(weight: ${criterion.weight})</span></li>`
    )
    .join("");

  summaryContent.innerHTML = `
    <div class="summary-block">
      <h3>Title</h3>
      <p>${escapeHtml(decision.title)}</p>
    </div>
    <div class="summary-block">
      <h3>Context</h3>
      <p>${escapeHtml(decision.context)}</p>
    </div>
    <div class="summary-block">
      <h3>Category</h3>
      <p>${escapeHtml(decision.category)}</p>
    </div>
    <div class="summary-block">
      <h3>Options</h3>
      <ul>${optionsHtml}</ul>
    </div>
    <div class="summary-block">
      <h3>Evaluation criteria</h3>
      <ul>${criteriaHtml}</ul>
    </div>
  `;
}

function collectDecisionData() {
  return {
    title: document.getElementById("decision-title").value.trim(),
    context: document.getElementById("decision-context").value.trim(),
    category: document.getElementById("decision-category").value,
    options: getOptionValues(),
    criteria: getCriteriaValues(),
  };
}

function showSummary(decision) {
  renderSummary(decision);
  form.closest(".form-section").hidden = true;
  summarySection.hidden = false;
  summarySection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showForm() {
  summarySection.hidden = true;
  form.closest(".form-section").hidden = false;
  document.getElementById("decision-title").focus();
}

function initializeForm() {
  addOptionRow();
  addOptionRow();
  addCriterionRow();
}

addOptionBtn.addEventListener("click", () => addOptionRow());
addCriterionBtn.addEventListener("click", () => addCriterionRow());

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  const decision = collectDecisionData();
  showSummary(decision);
});

editDecisionBtn.addEventListener("click", showForm);

initializeForm();
