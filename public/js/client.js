const form = document.getElementById("form");

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const farmername = document.getElementById("farmername").value.trim();
    const phonenumber = document.getElementById("phonenumber").value.trim();
    const password = document.getElementById("password").value.trim();
    const land = document.getElementById("land").value.trim();
    const income = document.getElementById("income").value.trim();
    const investment = document.getElementById("investment").value.trim();

    if (validate()) {
        fetch("https://cognifyproject.onrender.com", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                farmername,
                phonenumber,
                password,
                land,
                income,
                investment
            })
        })
        .then(response => {
            if (response.status === 409) {
                // Duplicate phone number
                const phoneError = document.getElementById("phonenumber_error");
                phoneError.textContent = "Phone number already exists!";
                phoneError.style.display = "block";
            } else if (response.ok) {
                alert("Registered successfully");
                window.location.href = "/"; // redirect to home or reload
            } else {
                alert("Registration failed. Please try again.");
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            alert("Network error. Please try again.");
        });
    }
});

function validate() {
    const farmername = document.getElementById("farmername").value.trim();
    const phonenumber = document.getElementById("phonenumber").value.trim();
    const password = document.getElementById("password").value.trim();
    const land = document.getElementById("land").value.trim();
    const income = document.getElementById("income").value.trim();
    const investment = document.getElementById("investment").value.trim();

    let isfarmerName = false;
    let isphonenumber = false;
    let ispassword = false;
    let island = false;
    let isincome = false;
    let isinvestment = false;

    // Farmer Name
    if (farmername === '') {
        document.getElementById("farmername_error").style.display = "block";
    } else {
        document.getElementById("farmername_error").style.display = "none";
        isfarmerName = true;
    }

    // Phone Number
    const phonepattern = /^\+?[0-9\s-]{10,20}$/;
    if (phonenumber === '' || !phonepattern.test(phonenumber)) {
        document.getElementById("phonenumber_error").textContent = "Enter valid Phone Number";
        document.getElementById("phonenumber_error").style.display = "block";
    } else {
        document.getElementById("phonenumber_error").style.display = "none";
        isphonenumber = true;
    }

    // Password
    if (password === '') {
        document.getElementById("password_error").style.display = "block";
    } else {
        document.getElementById("password_error").style.display = "none";
        ispassword = true;
    }

    // Land
    if (land === '' || isNaN(land) || Number(land) <= 0) {
        document.getElementById("land_error").style.display = "block";
    } else {
        document.getElementById("land_error").style.display = "none";
        island = true;
    }

    // Income
    if (income === '' || isNaN(income) || Number(income) <= 0) {
        document.getElementById("income_error").style.display = "block";
    } else {
        document.getElementById("income_error").style.display = "none";
        isincome = true;
    }

    // Investment
    if (investment === '' || isNaN(investment) || Number(investment) <= 0) {
        document.getElementById("investment_error").style.display = "block";
    } else {
        document.getElementById("investment_error").style.display = "none";
        isinvestment = true;
    }

    return isfarmerName && isphonenumber && ispassword && island && isincome && isinvestment;
}
