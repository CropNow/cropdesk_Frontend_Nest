async function test() {
  try {
    const res = await fetch("http://localhost:8081/api/v1/predictions/farms/123", {
      headers: {
        "Authorization": "Bearer TEST", // might fail if auth is required
        "Content-Type": "application/json"
      }
    });
    console.log("Status:", res.status);
    console.log(await res.text());
  } catch (e) {
    console.log(e);
  }
}
test();
