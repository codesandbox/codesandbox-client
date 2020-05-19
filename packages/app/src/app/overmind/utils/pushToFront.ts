import * as request from "request";

export default ({
  feedback,
  emoji,
  sandboxId,
  username,
  email,
  version,
  browser,
}: {
  [key: string]: string;
}) => {
  return new Promise((resolve, reject) => {
    request("https://s2973.sse.codesandbox.io/inbound-message", {
      method: "POST",
      body: JSON.stringify({
            "name": username,
            "email": email,
            "body": feedback+"\nSandbox: https://codesandbox.io"+sandboxId+"\nVersion: "+version+"\nBrowser: "+browser
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*"
      }
    },
    err => {
      if (err) {
        console.error(err);
        reject();
      }
      resolve();
    });
  });
}
