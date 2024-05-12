export const download = (name: string, content: string) => {
  const e = document.createElement("a");
  e.setAttribute("download", name);
  e.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
  );

  document.body.appendChild(e);

  e.click();

  document.body.removeChild(e);
};
