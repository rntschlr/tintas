/** HEAD must answer 200. Monitors that do not send GET were reporting the notebook down. */
export default function healthHead() {
  return new Response(null, {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
    },
  });
}
