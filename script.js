const DATA_URL = "./data.json";

function normalizeVersion(version) {
  if (typeof version !== "string") {
    return "";
  }

  const trimmedVersion = version.trim();

  if (!trimmedVersion) {
    return "";
  }

  return `v${trimmedVersion.replace(/^v/i, "")}`;
}

function normalizeDownloadUrl(url) {
  if (typeof url !== "string") {
    return "#";
  }

  const trimmedUrl = url.trim();

  return trimmedUrl || "#";
}

function updateDownloadLink(link, url) {
  if (!link) {
    return;
  }

  const normalizedUrl = normalizeDownloadUrl(url);
  const isUnavailable = normalizedUrl === "#";

  link.href = normalizedUrl;
  link.setAttribute("aria-disabled", String(isUnavailable));

  if (isUnavailable) {
    link.dataset.unavailable = "true";
    return;
  }

  delete link.dataset.unavailable;
}

function applyLandingData(data) {
  const versionElement = document.querySelector("[data-app-version]");
  const windowsLink = document.querySelector('[data-download-platform="windows"]');
  const androidLink = document.querySelector('[data-download-platform="android"]');
  const downloads = data && typeof data.downloadUrl === "object" ? data.downloadUrl : {};
  const versionLabel = normalizeVersion(data && data.appVersion);

  if (versionElement && versionLabel) {
    versionElement.textContent = versionLabel;
  }

  updateDownloadLink(windowsLink, downloads.windows);
  updateDownloadLink(androidLink, downloads.android);
}

async function loadLandingData() {
  const response = await fetch(DATA_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Nie udalo sie pobrac data.json (${response.status}).`);
  }

  return response.json();
}

async function initLandingData() {
  try {
    const data = await loadLandingData();
    applyLandingData(data);
  } catch (error) {
    console.warn(
      "Nie udalo sie zaladowac data.json. Otworz landing przez lokalny serwer HTTP, aby dynamiczne dane mogly zostac wczytane.",
      error
    );
  }
}

initLandingData();