/* * 
When proting to project need to make an action method "CheckUsername" in Home controller
as post that returns 200 ok when username is avalaiable else 404 
* */

function simulateInput(input , placeToPutdata) {
   let text = input.value.trim();
       placeToPutdata.innerText = text;
}

function showError(text , inputName) {
    document.querySelectorAll("#" + inputName).forEach(element => {
        let errorMessage = element.querySelector("#errorMessage")
        let errorMessageText = element.querySelector("#errorMessageText")
        errorMessageText.innerText = text;
        errorMessage.style.transform = "scale(1)";
       errorMessage.style.animation = "errorMessageShow 200ms";
       setTimeout(() => {
           
           errorMessage.style.animation = "horizontal-shaking 200ms 3";
    }, 200)
    });
}

function usernameTaken() {
    document.querySelectorAll("#username").forEach(username => {
         let errorMessage = username.querySelector("#errorMessage")
        let errorMessageText = username.querySelector("#errorMessageText")
        errorMessageText.innerText = "This username is already taken";
        errorMessage.style.transform = "scale(1)";
       errorMessage.style.animation = "errorMessageShow 200ms";
       setTimeout(() => {
           
           errorMessage.style.animation = "horizontal-shaking 200ms 3";
    }, 200)
    })
}
let userCheckCall;

   document.querySelectorAll("#username").forEach(username => username.addEventListener("input" , () => {
   clearTimeout(userCheckCall)
   var usernameText = document.querySelector("#username").querySelector("input").value.trim();
   if (usernameText.length <= 0) {
    return showError("Username can't be empty"  , "username")
   }
   userCheckCall = setTimeout(() => {
$.ajax({
      url: "Home/CheckUsername",
      type: "POST",
      data: {
        "username": usernameText
      },
      error: () => {
        usernameTaken();
      }
    })
    }, 300);
   }));
function hideError(inputName) {
document.querySelectorAll("#" + inputName).forEach(element => {
 hideInputInternal(element)
})
}
function hideAllErrors() {
    document.querySelectorAll("#name").forEach(name => {
 hideInputInternal(name)
    })
    document.querySelectorAll("#email").forEach(name => {
 hideInputInternal(name)
    })
    document.querySelectorAll("#password").forEach(name => {
   hideInputInternal(name)
    })
    document.querySelectorAll("#username").forEach(name => {

    })
   
}

function hideInputInternal(name) {
         let errorMessage =  name.querySelector("#errorMessage");
      errorMessage.style.opacity = "0";
      setTimeout(() => {    
          errorMessage.style.transform = "scale(0)"
          setTimeout(() => {
errorMessage.style.opacity = "1";
          }, 400)
      }, 300)
}

function getFormData()  {
   let name = document.querySelector("name").querySelector("input").value.trim()
   let email = document.querySelector("email").querySelector("input").value.trim()
   let password = document.querySelector("password").querySelector("input").value.trim()
   let username = document.querySelector("username").querySelector("input").value.trim()
   var data = {
    "name": name,
    "email": email,
    "password": password,
    "username": username
   }

   return data;
}



function createAccount() { 
 let formContent = document.querySelector(".form-content");
 let formContentImage = document.querySelector(".form-image");
 
 formContentImage.className = "form-image form-image-deactivate"
 formContentImage.querySelector("main img").style.opacity = "0";
    setTimeout(() => {
      formContentImage.className = "form-image form-image-deactivate form-image-deactivate-2" 
      setTimeout(() => {
          formContentImage.querySelector("main img").style.filter = "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7472%) hue-rotate(206deg) brightness(114%) contrast(100%)";
          formContentImage.style.zIndex = "+2";
          setTimeout(() => {
              formContentImage.querySelector("main img").style.opacity = "1";
             let emailContent = formContentImage.querySelector(".form-email-sent-container")
             emailContent.className = 'form-email-sent-container-active form-email-sent-container'
          }, 1)
      }, 300)
    }, 500)
 formContent.className = "form-content form-content-deactivate"

}

// function backToForm() {
//       let formContent = document.querySelector(".form-content");
//  let formContentImage = document.querySelector(".form-image");
//  let emailContent = formContentImage.querySelector(".form-email-sent-container")
//  formContent.style.transition = "400ms";
//  formContent.className = "form-content form-content-active";
//  formContentImage.className = "form-image-deactivate-2";
//  formContentImage.style.backgroundColor = "rgb(255 , 255 , 255 , 1)";
//  setTimeout(() => {
     
// formContentImage.className = "form-image";
// formContentImage.style.removeProperty("background-color")

// formContentImage.querySelector("main img").removeAttribute("style")
// formContentImage.querySelector("main img").style.opacity = "1";

//  }, 400)

// }
function backToForm() {
    let formContent = document.querySelector(".form-content");
 let formContentImage = document.querySelector(".form-image");
 let emailContent = formContentImage.querySelector(".form-email-sent-container")
 formContent.style.transition = "400ms";
 formContentImage.style.transition = "400ms";
 formContentImage.className = "form-image form-image-deactivate"
 formContent.className = "form-content form-content-active"
 formContentImage.querySelector("main img").style.filter = "";
 
 emailContent.className = 'form-email-sent-container'
 formContentImage.className = "form-image" 
    setTimeout(() => {
      setTimeout(() => {
          formContentImage.style.zIndex = "unset";
          setTimeout(() => {
              
             
             
          }, 1)
      }, 300)
    }, 500)

}

