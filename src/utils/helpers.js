export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Get day and add leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based index) and add leading zero if necessary
  const year = date.getFullYear(); // Get full year

  return `${day}.${month}.${year}`;
};

export async function apiCall(method, path, body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(path, options);

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message||'Something went wrong!' };
  }
}
