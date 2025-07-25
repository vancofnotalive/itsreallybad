/* 
<documentation>
// show specifc error and hide 
showError("Invalid email" ,  "password")
hideError("password")

// hide all errors
hideError("" , true)


// --login states
// default
loginUniversal(loginStates.normal)
// processing data
loginUniversal(loginStates.processing)




</documentation>
*/
function changeInput(inp) {
    let currentType = inp.getAttribute("inputType")
    document.querySelectorAll(`*[inputtype=${currentType}]`).forEach(input => {
        let main = input.closest("main");


        if (currentType == 'email') {
            input.querySelector("i").className = "fa-solid fa-signature";
            input.setAttribute("inputType", "username")
            main.querySelector("input").setAttribute("placeholder", "Username")
        }
        else if (currentType == 'username') {
            input.querySelector("i").className = "fa-solid fa-user";
            input.setAttribute("inputType", "both")
            main.querySelector("input").setAttribute("placeholder", "Email address or username")
        }
        else if (currentType == 'both') {
            input.querySelector("i").className = "fa-solid fa-envelope";
            input.setAttribute("inputType", "email")
            main.querySelector("input").setAttribute("placeholder", "Email address")
        }
    })
}

function showError(text, inputName) {
    //  document.querySelectorAll("#" + inputName).forEach(inp => {

    //    let parent = inp.closest(".form-content-input");
    //    let h2 = parent.querySelector("h2");
    //    h2.querySelector("strong").innerText = text;
    //    h2.style.scale = "1";
    //    h2.style.animation = "horizontal-shaking 200ms linear 3";
    //   })
    document.querySelectorAll("#" + inputName).forEach(element => {
        let errorMessage = element.querySelector("#errorMessage");
        let textContainer = errorMessage.querySelector("strong");
        textContainer.innerText = text;
        errorMessage.style.scale = "1";
        errorMessage.style.animation = "horizontal-shaking 200ms linear 3";
    })

}


function hideError(inputName, hideAll = false) {
    if (!hideAll) {

        document.querySelectorAll("#" + inputName).forEach(ele => {


            ele.querySelector("#errorMessage").style.scale = "0";
        })
        return "Removed"
    }
    document.querySelectorAll("#email").forEach(ele => {
        ele.querySelector("#errorMessage").style.scale = "0";
    })
    document.querySelectorAll("#password").forEach(ele => {
        ele.querySelector("#errorMessage").style.scale = "0";
    })
    return "Removed"




}

var loginStates = {
    "normal": "normal",
    "processing": "processing",
    "error": "error"
}
function login(state) {
    document.querySelectorAll(".form-content-login-button").forEach(btn => {

        if (state == loginStates.processing) {
            btn.className = "form-content-login-button form-content-login-button-processing"
            hitLogin();
        }
        else if (state == loginStates.normal) {

            btn.className = "form-content-login-button"

        }
    })
}
function loginPhone(state) {
    document.querySelectorAll(".form-content-login-button---phone").forEach(btn => {

        if (state == loginStates.processing) {
            btn.className = 'form-content-login-button---phone phone-login-processing'
            hitLogin();
        }
        else if (state == loginStates.normal) {

            btn.className = "form-content-login-button---phone"

        }
    })
}

function hitLogin() {
    let data = getData();
    $.ajax({
        url: '/Account/Login',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (response) => {
            loginUniversal(loginStates.normal)
            let redirectUrl = response.result.redirectUrl;
            window.location.replace(redirectUrl);
        },
        error: (response) => {
            let errors = response.responseJSON.errors;
            let firstError = errors[0];
            if (firstError.startsWith("password:")) {
                hideError("", true);
                showError(firstError.replace("password:", ""), "password")
            }
            else if (firstError.startsWith("email:")) {
                hideError("", true);
                firstError.replace("email:", "")
                showError(firstError.replace("email:", ""), "email")
            }
                loginUniversal(loginStates.normal)

            console.log(errors);
        }
        
    })

    

}






function loginUniversal(state) {
    login(state)
    loginPhone(state)


}


function loginGoogle() {

}
function loginFacebook() {

}

function getData() {

    let data = {
        "email": "",
        "username": "",
        "method": "",
        "password": ""
    }
    let allEmails = document.querySelectorAll("#email");
    let emails = [... new Set(Array.from(allEmails).map(ele => ele.querySelector("input").value))];
    if (emails.length > 1) {
        let currentDevice = getCurrentDeviceType();
        let currentDeviceEmail = Array.from(allEmails).filter(ae => ae.closest("if-block").getAttribute(currentDevice))
        data.email = currentDeviceEmail;
    }
    else {
      
        let inputType = allEmails[0].querySelector("main span").getAttribute("inputType");
        data.method = inputType;
        if (inputType == 'email') {
            data.email = emails[0];

        }
        else if (inputType == 'username') {
            data.username = emails[0];

        }
        else if (inputType == 'both') {
            data.username = emails[0];
            data.email = emails[0];

        }
          
        
    }
    let allPasswords = document.querySelectorAll("#password");
    let passwords = [... new Set(Array.from(allPasswords).map(ele => ele.querySelector("input").value))];
    if (passwords.length > 1) {
        let currentDevice = getCurrentDeviceType();
        let currentDevicePassword = Array.from(allPasswords).filter(ae => ae.closest("if-block").getAttribute(currentDevice))
        data.password = currentDevicePassword;
    }
    else {
        data.password = passwords[0];
    }

    return data;

}

