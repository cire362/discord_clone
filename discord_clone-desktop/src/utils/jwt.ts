export function getUserPayload() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Нет токена");
    return null;
  }

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4) {
      base64 += "=";
    }

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Ошибка при парсинге токена:", error);
    return null;
  }
}
