// Constants and Configurations
const CONFIG = {
  selectors: {
    faqQuestion: ".faq-question",
    faqAnswer: ".faq-answer",
    dropZone: "#dropZone",
    fileInput: "#resume",
    form: "#analysisForm",
    jobDescription: "#job_description",
    loadingSpinner: "#loadingSpinner",
    resultContainer: "#resultContainer",
    resultContent: "#resultContent",
    currentYear: "#currentYear",
    actionButtons: ".action-btn",
    resultAnalysis: "#resultAnalysis", // Added new selector
  },
  endpoints: {
    analyze: "/analyze",
  },
  classes: {
    highlight: "highlight",
    active: "active",
  },
  messages: {
    errors: {
      jobDescription: "Please enter a job description",
      noFile: "Please upload your resume",
      fileType: "Please upload a PDF file",
      generic: "An error occurred during analysis. Please try again.",
    },
    defaultDropzone: "Drag and drop your resume here or click to browse",
  },
};

// Utility functions
const utils = {
  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  },

  showError(message) {
    // Could be enhanced to use a custom toast/notification system
    alert(message);
  },

  async fadeInElement(element, delay = 100) {
    element.style.opacity = "0";
    await new Promise((resolve) => setTimeout(resolve, delay));
    element.style.transition = "opacity 0.5s ease-in";
    element.style.opacity = "1";
  },

  scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  },
};

// Class-based components
class FileUploadHandler {
  constructor(dropZoneSelector, fileInputSelector) {
    this.dropZone = document.querySelector(dropZoneSelector);
    this.fileInput = document.querySelector(fileInputSelector);
    this.label = this.dropZone.querySelector("p");
    this.init();
  }

  init() {
    this.setupDragAndDrop();
    this.setupClickHandler();
    this.setupFileInputChange();
  }

  setupDragAndDrop() {
    const dragEvents = ["dragenter", "dragover", "dragleave", "drop"];
    dragEvents.forEach((event) => {
      this.dropZone.addEventListener(event, utils.preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((event) => {
      this.dropZone.addEventListener(event, () =>
        this.dropZone.classList.add(CONFIG.classes.highlight)
      );
    });

    ["dragleave", "drop"].forEach((event) => {
      this.dropZone.addEventListener(event, () =>
        this.dropZone.classList.remove(CONFIG.classes.highlight)
      );
    });

    this.dropZone.addEventListener("drop", this.handleDrop.bind(this), false);
  }

  setupClickHandler() {
    this.dropZone.addEventListener("click", () => this.fileInput.click());
  }

  setupFileInputChange() {
    this.fileInput.addEventListener("change", (e) =>
      this.updateFileLabel(e.target.files[0])
    );
  }

  handleDrop(e) {
    const [file] = e.dataTransfer.files;
    this.fileInput.files = e.dataTransfer.files;
    this.updateFileLabel(file);
  }

  updateFileLabel(file) {
    this.label.textContent = file
      ? `Selected file: ${file.name}`
      : CONFIG.messages.defaultDropzone;
  }
}

class FAQHandler {
  constructor(selector) {
    this.questions = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.questions.forEach((question) => {
      question.addEventListener("click", () => this.toggleQuestion(question));
    });
  }

  toggleQuestion(question) {
    const answer = question.nextElementSibling;
    const isExpanded = question.getAttribute("aria-expanded") === "true";

    // Close all questions
    this.questions.forEach((q) => {
      const a = q.nextElementSibling;
      q.setAttribute("aria-expanded", "false");
      a.setAttribute("aria-hidden", "true");
      q.classList.remove(CONFIG.classes.active);
      if (a) a.style.maxHeight = "0px";
    });

    // Open current question if it was closed
    if (!isExpanded) {
      question.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");
      question.classList.add(CONFIG.classes.active);
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.form = document.querySelector(CONFIG.selectors.form);
    this.loadingSpinner = document.querySelector(
      CONFIG.selectors.loadingSpinner
    );
    this.resultContainer = document.querySelector(
      CONFIG.selectors.resultContainer
    );
    this.resultContent = document.querySelector(CONFIG.selectors.resultContent);

    this.setupActionButtons();
  }

  setupActionButtons() {
    document
      .querySelectorAll(CONFIG.selectors.actionButtons)
      .forEach((button) => {
        button.addEventListener("click", async () => {
          if (this.validateForm()) {
            await this.submitForm(button.dataset.action);
          }
        });
      });
  }

  validateForm() {
    const jobDescription = document
      .querySelector(CONFIG.selectors.jobDescription)
      .value.trim();
    const resumeFile = document.querySelector(CONFIG.selectors.fileInput)
      .files[0];

    if (!jobDescription) {
      utils.showError(CONFIG.messages.errors.jobDescription);
      return false;
    }

    if (!resumeFile) {
      utils.showError(CONFIG.messages.errors.noFile);
      return false;
    }

    if (!resumeFile.type.includes("pdf")) {
      utils.showError(CONFIG.messages.errors.fileType);
      return false;
    }

    return true;
  }

  async submitForm(action) {
    const formData = new FormData(this.form);
    formData.append("action", action);

    try {
      this.showLoading();

      const response = await fetch(CONFIG.endpoints.analyze, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      await this.displayResult(marked.parse(result));

      // Scroll to the Analysis Results heading
      utils.scrollToElement(CONFIG.selectors.resultAnalysis);
    } catch (error) {
      console.error("Error:", error);
      this.displayError();
    } finally {
      this.hideLoading();
    }
  }

  showLoading() {
    this.loadingSpinner.style.display = "flex";
    this.resultContainer.style.display = "block";
    this.resultContent.innerHTML = "";
    this.loadingSpinner.scrollIntoView({ behavior: "smooth" });
  }

  hideLoading() {
    this.loadingSpinner.style.display = "none";
  }

  async displayResult(content) {
    this.resultContent.innerHTML = content;
    await utils.fadeInElement(this.resultContent);
  }

  displayError() {
    this.resultContent.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${CONFIG.messages.errors.generic}</p>
      </div>
    `;
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Update copyright year
  document.querySelector(CONFIG.selectors.currentYear).textContent =
    new Date().getFullYear();

  // Initialize components
  new FileUploadHandler(CONFIG.selectors.dropZone, CONFIG.selectors.fileInput);
  new FAQHandler(CONFIG.selectors.faqQuestion);
  new FormHandler();
});
