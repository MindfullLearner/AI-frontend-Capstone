/**
 * ThinkLens — Decision Setup Form
 * Handles dynamic fields, validation, draft saving, and form submission.
 */

const STORAGE_KEY = "thinklens_decision_draft";

const form = document.getElementById("decision-form");
const optionsList = document.getElementById("options-list");
const criteriaList = document.getElementById("criteria-list");
const successPanel = document.getElementById("success-panel");
const decisionSummary = document.getElementById("decision-summary");
const toast = document.getElementById("toast");

const MIN_OPTIONS = 2;
const MIN_CRITERIA = 1;

let optionCount = 0;
let criterionCount = 0;

// --- Dynamic field builders ---

function createOptionItem(value = "") {
  optionCount += 1;
  const id = `option-${optionCount}`;

  const item = document.createElement("div");
  item.className = "dynamic-item";
  item.dataset.id = id;

  item.innerHTML = `
    <input
      type="text"
      id="${id}"
      name="options[]"
      placeholder="Option ${optionCount}"
      value="${escapeHtml(value)}"
      maxlength="100"
      aria-label="Option ${optionCount}"
    >
    <button type="button" class="btn-remove" aria-label="Remove option ${optionCount}">×</button>
  `;

  item.querySelector(".btn-remove").addEventListener("click", () => removeItem(item, optionsList, MIN_OPTIONS));
  return item;
}

function createCriterionItem(name = "", weight = 3) {
  criterionCount += 1;
  const id = `criterion-${criterionCount}`;

  const item = document.createElement("div");
  item.className = "dynamic-item";
  item.dataset.id = id;

  item.innerHTML = `
    <input
      type="text"
      id="${id}"
      name="criteria[]"
      placeholder="e.g. Cost, Scalability, Time to market"
      value="${escapeHtml(name)}"
      maxlength="80"
      aria-label="Criterion ${criterionCount}"
    >
    <div class="weight-control">
      <label for="${id}-weight">Weight</label>
      <input
        type="range"
        id="${id}-weight"
        name="weights[]"
        min="1"
        max="5"
        value="${weight}"
        aria-valuemin="1"
        aria-valuemax="5"
        aria-valuenow="${weight}"
        aria-label="Weight for criterion ${criterionCount}"
      >
      <span class="weight-value" aria-hidden="true">${weight}</span>
    </div>
    <button type="button" class="btn-remove" aria-label="Remove criterion ${criterionCount}">×</button>
  `;

  const rangeInput = item.querySelector('input[type="range"]');
  const weightDisplay = item.querySelector(".weight-value");

  rangeInput.addEventListener("input", () => {
    weightDisplay.textContent = rangeInput.value;
    rangeInput.setAttribute("aria-valuenow", rangeInput.value);
  });

  item.querySelector(".btn-remove").addEventListener("click", () => removeItem(item, criteriaList, MIN_CRITERIA));
  return item;
}

function removeItem(item, list, minCount) {
  const items = list.querySelectorAll(".dynamic-item");
  if (items.length <= minCount) {
    showToast(`You need at least ${minCount} item${minCount > 1 ? "s" : ""}.`);
    return;
  }
  item.remove();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --- Validation ---

function validateForm() {
  let isValid = true;
  clearErrors();

  const title = document.getElementById("decision-title");
  const context = document.getElementById("decision-context");

  if (!title.value.trim()) {
    showFieldError("title-error", "Please enter a decision title.");
    title.classList.add("invalid");
    isValid = false;
  }

  if (!context.value.trim()) {
    showFieldError("context-error", "Please describe the context for this decision.");
    context.classList.add("invalid");
    isValid = false;
  }

  const optionInputs = optionsList.querySelectorAll('input[type="text"]');
  const filledOptions = Array.from(optionInputs).filter((input) => input.value.trim());

  if (filledOptions.length < MIN_OPTIONS) {
    showFieldError("options-error", `Add at least ${MIN_OPTIONS} options to compare.`);
    isValid = false;
  }

  const criterionInputs = criteriaList.querySelectorAll('input[type="text"]');
  const filledCriteria = Array.from(criterionInputs).filter((input) => input.value.trim());

  if (filledCriteria.length < MIN_CRITERIA) {
    showFieldError("criteria-error", "Add at least one evaluation criterion.");
    isValid = false;
  }

  const deadline = document.getElementById("decision-deadline");
  if (deadline.value) {
    const selected = new Date(deadline.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      deadline.classList.add("invalid");
      showToast("Deadline cannot be in the past.");
      isValid = false;
    }
  }

  return isValid;
}

function showFieldError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  document.querySelectorAll(".invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
}

// --- Data collection ---

function collectFormData() {
  const optionInputs = optionsList.querySelectorAll('input[type="text"]');
  const options = Array.from(optionInputs)
    .map((input) => input.value.trim())
    .filter(Boolean);

  const criterionItems = criteriaList.querySelectorAll(".dynamic-item");
  const criteria = Array.from(criterionItems)
    .map((item) => {
      const name = item.querySelector('input[type="text"]').value.trim();
      const weight = parseInt(item.querySelector('input[type="range"]').value, 10);
      return name ? { name, weight } : null;
    })
    .filter(Boolean);

  return {
    title: document.getElementById("decision-title").value.trim(),
    context: document.getElementById("decision-context").value.trim(),
    deadline: document.getElementById("decision-deadline").value || null,
    priority: document.getElementById("decision-priority").value,
    options,
    criteria,
    constraints: document.getElementById("decision-constraints").value.trim() || null,
    stakeholders: document.getElementById("decision-stakeholders").value.trim() || null,
    createdAt: new Date().toISOString(),
  };
}

function populateForm(data) {
  document.getElementById("decision-title").value = data.title || "";
  document.getElementById("decision-context").value = data.context || "";
  document.getElementById("decision-deadline").value = data.deadline || "";
  document.getElementById("decision-priority").value = data.priority || "medium";
  document.getElementById("decision-constraints").value = data.constraints || "";
  document.getElementById("decision-stakeholders").value = data.stakeholders || "";

  optionsList.innerHTML = "";
  optionCount = 0;
  const options = data.options?.length ? data.options : ["", ""];
  options.forEach((opt) => optionsList.appendChild(createOptionItem(opt)));

  criteriaList.innerHTML = "";
  criterionCount = 0;
  const criteria = data.criteria?.length ? data.criteria : [{ name: "", weight: 3 }];
  criteria.forEach((c) => criteriaList.appendChild(createCriterionItem(c.name, c.weight)));
}

// --- Draft persistence ---

function saveDraft() {
  const data = collectFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  showToast("Draft saved.");
}

function loadDraft() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;

  try {
    populateForm(JSON.parse(saved));
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

// --- UI helpers ---

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.hidden = true;
    }, 300);
  }, 2500);
}

function showSuccessPanel(data) {
  form.hidden = true;
  successPanel.hidden = false;
  decisionSummary.textContent = JSON.stringify(data, null, 2);
  successPanel.scrollIntoView({ behavior: "smooth" });
}

function showForm() {
  form.hidden = false;
  successPanel.hidden = true;
}

function resetForm() {
  form.reset();
  clearErrors();
  optionsList.innerHTML = "";
  criteriaList.innerHTML = "";
  optionCount = 0;
  criterionCount = 0;
  initDefaultFields();
  clearDraft();
  showForm();
}

function initDefaultFields() {
  optionsList.appendChild(createOptionItem());
  optionsList.appendChild(createOptionItem());
  criteriaList.appendChild(createCriterionItem());
}

// --- Event listeners ---

document.getElementById("add-option-btn").addEventListener("click", () => {
  optionsList.appendChild(createOptionItem());
  optionsList.lastElementChild.querySelector("input").focus();
});

document.getElementById("add-criterion-btn").addEventListener("click", () => {
  criteriaList.appendChild(createCriterionItem());
  criteriaList.lastElementChild.querySelector('input[type="text"]').focus();
});

document.getElementById("save-draft-btn").addEventListener("click", saveDraft);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const data = collectFormData();
  clearDraft();
  showSuccessPanel(data);
});

document.getElementById("edit-decision-btn").addEventListener("click", () => {
  showForm();
  form.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("new-decision-btn").addEventListener("click", resetForm);

form.addEventListener("input", (event) => {
  if (event.target.classList.contains("invalid")) {
    event.target.classList.remove("invalid");
  }
});

// --- Initialize ---

if (loadDraft()) {
  showToast("Draft restored.");
} else {
  initDefaultFields();
}
