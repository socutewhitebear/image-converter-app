const dropZone = document.getElementById("drop-zone");
const formatSelect = document.getElementById("format");
const statusText = document.getElementById("status");
const fileInput = document.getElementById("file-input");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#ffffff10";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.backgroundColor = "#ffffff08";
});

dropZone.addEventListener("drop", async (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#ffffff08";

  const file = e.dataTransfer.files[0];
  if (!file) return;

  handleFile(file);
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
});

async function handleFile(file) {
  const format = formatSelect.value;
  statusText.textContent = "Converting...";

  try {
    const fileBuffer = await readFileAsBuffer(file);
    const result = await window.converter.convertImage(
      fileBuffer,
      file.name,
      format
    );
    if (result.success) {
      statusText.innerHTML = `✅ Saved to Downloads: <br><code>${result.outputPath}</code>`;
    } else {
      statusText.textContent = `❌ Error: ${result.error}`;
    }
  } catch (err) {
    statusText.textContent = `❌ Unexpected Error: ${err.message}`;
  }
}

function readFileAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

dropZone.addEventListener("click", () => {
  fileInput.click();
});
