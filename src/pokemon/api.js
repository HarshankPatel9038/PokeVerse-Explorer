export const fetchJson = async (url, label = "request") => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Unable to load ${label}. Server returned ${response.status} ${response.statusText}.`
    );
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(`Unable to load ${label}. Server returned an invalid response.`);
  }

  return response.json();
};
