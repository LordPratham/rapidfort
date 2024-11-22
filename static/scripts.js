const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/upload", { method: "POST", body: formData });
  const result = await response.json();

  if (response.ok) {
    const filepath = result.filepath;


    document.getElementById("actionButtons").innerHTML = `
            <button class="btn btn-secondary me-2" id="metadataBtn">Show Metadata</button>
            <button class="btn btn-success me-2" id="convertBtn">Convert to PDF</button>
            <input type="password" class="form-control me-2" id="passwordInput" placeholder="Enter Password" style="width: 200px;">
            <button class="btn btn-warning" id="protectBtn" disabled>Protect PDF</button>
        `;


    document
      .getElementById("metadataBtn")
      .addEventListener("click", () => getMetadata(filepath));
    document
      .getElementById("convertBtn")
      .addEventListener("click", () => convertToPdf(filepath));
    document
      .getElementById("protectBtn")
      .addEventListener("click", () => addPassword(filepath));
  } else {
    alert(result.error);
  }
});

async function getMetadata(filepath) {
  const response = await fetch(`/metadata?filepath=${filepath}`);
  const metadata = await response.json();

  document.getElementById("metadata").innerHTML = `
        <h4>Metadata</h4>
        <pre>${JSON.stringify(metadata, null, 2)}</pre>
    `;
}

async function convertToPdf(filepath) {
  const response = await fetch("/convert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filepath }),
  });

  if (response.ok) {
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "converted.pdf";
    link.click();


    document.getElementById("protectBtn").disabled = false;
  } else {
    alert("Failed to convert to PDF.");
  }
}

async function addPassword(filepath) {
  const password = document.getElementById("passwordInput").value;
  if (!password) {
    alert("Please enter a password!");
    return;
  }

  const response = await fetch("/add_password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filepath, password }),
  });

  if (response.ok) {
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "protected.pdf";
    link.click();
  } else {
    alert("Failed to protect the PDF.");
  }
}
