function adminLogin() {
  const id = document.getElementById("adminID").value;
  const password = document.getElementById("adminPassword").value;

  if (id === "admin" && password === "admin123") {
    alert("Login Successful!");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Invalid Admin ID or Password");
  }
}
