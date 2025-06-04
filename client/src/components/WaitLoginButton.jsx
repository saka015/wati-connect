
// const CLIENT_ID = "YOUR_CLIENT_ID";
// const REDIRECT_URI = "http://localhost:5173/wati/callback";

// const WatiLoginButton = () => {
//   const handleLogin = () => {
//     const authUrl = `https://app.wati.io/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
//     window.location.href = authUrl;
//   };

//   return <button onClick={handleLogin}>Login with WhatsApp (WATI)</button>;
// };

// export default WatiLoginButton;

const CLIENT_ID = "YOUR_CLIENT_ID"; // Replace with actual client id when you get it
const REDIRECT_URI = "http://localhost:5173/wati/callback";

const WatiLoginButton = () => {
  const handleLogin = () => {
    const authUrl = `https://app.wati.io/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = authUrl;
  };

  return <button onClick={handleLogin}>Login with WhatsApp (WATI)</button>;
};

export default WatiLoginButton;
