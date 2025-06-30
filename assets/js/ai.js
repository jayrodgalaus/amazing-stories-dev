async function callMyAI(prompt) {
  const response = await fetch("/api/hug", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();
  console.log(data);
}
