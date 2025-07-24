/* * 
When proting to project need to make an action method "CheckUsername" in Home controller
as post that returns 200 ok when username is avalaiable else 404 
// go to line no ~54 and uncoment the block
* */

// places sets attribute only
function simulateInput(input , placeToPutdata , places = []) {
   let text = input.value.trim();
       placeToPutdata.innerText = text;
       if (places.length > 0) {
        places.forEach(place => {
            setCustomAttribute(place[0] , place[1] , text)
        })
       }
}
function simulateInputs(input , placesToPutData = []) {

    // placesToPutData[0]  = query selctor in string or element direct(to get visible value)
    // placesToPutData[1] = attribute name
    // placesToPutData[2] = element to get that attribute(if not given sets attribute to placesToPutData[0]) this can also be either string or element direct
    let value = input.value.trim();
  placesToPutData.forEach(placeSelector => {
    let element;
  if (placeSelector[0] instanceof Element) {
    element = placeSelector[0];
    element.innerText = value;
  }
  else if (typeof placeSelector[0] === "string") {
    element =  document.querySelector(placeSelector[0]);
   element.innerText = value;
  }
  if(placeSelector[1] != null && placeSelector[1] != "") {
    if (placeSelector[2] == null || placeSelector[2] == "") 
    element.setAttribute(placeSelector[1] , value);
else {
    let elementToHaveAttribute;
    if (typeof placeSelector[2] === 'string')
    elementToHaveAttribute = document.querySelector(placeSelector[2])
else
    elementToHaveAttribute = placeSelector[2];

    elementToHaveAttribute.setAttribute(placeSelector[1] , value);
       
    }
  }
  })

}
function setCustomAttribute(selecter , attributeName , attributeValue) {
    if (typeof(selecter) == 'object') {
   return selecter.setAttribute(attributeName , attributeValue)    
    }
    let element = document.querySelector(selecter);
   if (element != null) {
    element.setAttribute(attributeName , attributeValue)
   }
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
/* 
// uncomment this block to make working usenrame checks
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

   */
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
hideInputInternal(name)
    })
    document.querySelectorAll("#date").forEach(name => {
hideInputInternal(name)
    })
   
}

function convertMonthToNumber(monthToString) {
  if (!monthToString) return null;

  const normalized = monthToString.toString().trim().toLowerCase();

  // Check if it's already a valid number
  const num = Number(normalized);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return num;
  }

  // Map of month names to numbers
  const monthMap = {
    january: 1, jan: 1,
    february: 2, feb: 2,
    march: 3, mar: 3,
    april: 4, apr: 4,
    may: 5,
    june: 6, jun: 6,
    july: 7, jul: 7,
    august: 8, aug: 8,
    september: 9, sep: 9, sept: 9,
    october: 10, oct: 10,
    november: 11, nov: 11,
    december: 12, dec: 12
  };

  return monthMap[normalized] || null;
}


function hideInputInternal(name) {
         let errorMessage =  name.querySelector("#errorMessage");
         errorMessage.style.transition = "0ms";
         errorMessage.style.transform = "scale(0)"
         errorMessage.transition = "400ms";
         
        }
        function isLeapYear(year) {
  year = Number(year);
  if (isNaN(year)) return false;

  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

        
        function getFormData()  {
            
            let name = document.querySelector("#name").querySelector("input").value.trim();
            let email = document.querySelector("#email").querySelector("input").value.trim();
            let password = document.querySelector("#password").querySelector("input").value.trim();
            let username = document.querySelector("#username").querySelector("input").value.trim();
            
            var returnData = {
                "valid" : true,
                "data": null
            }
            let breakLoop = false;
    hideAllErrors()
    

   if (name == "")  {

       showError("Name cannot be empty" , "name");
       returnData.valid = false
    }
  
const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
if (isEmailInvalid) {
        returnData.valid = false
        showError("Invalid Email" , "email");
    }
    if (!email.includes('@')) {
        returnData.valid = false
        showError("Email must have '@'" , "email");
    }
    if (email == "")  {
returnData.valid = false
showError("Email cannot be empty" , "email");
}
    
    if (password.length < 4) {
        showError("Password must be more than 4 characters long" , "password");
    }
    
    if (password.length > 64) {
        
        showError("Password must be smaller than 64 characters" , "password");
    }

    const passwordHasNumbers = /\d/.test(password);

if (!passwordHasNumbers) {
returnData.valid = false
        showError("Passord must contain at least one number" , "password");
}

    const passwordHasSpecialChars = /[!@#$%^&*()\-\_=+\[\]{}\\|;:'",<.>\/?`~]/.test(password);

    if (!passwordHasSpecialChars) {
        returnData.valid = false
        showError("Passord must contain at least one special character" , "password");
    }
    if (password == "")  {
returnData.valid = false
       showError("Password cannot be empty" , "password");
    }
    
   if (username == "")  {
returnData.valid = false
       showError("Username cannot be empty" , "username");
    }

   var data = {
    "name": name,
    "email": email,
    "password": password,
    "username": username
   }
  var dates = document.querySelectorAll("#date");
   dates.forEach(date => {
date.querySelectorAll("*").forEach(el => {
    
       
        if (!breakLoop) {

        
         if (el.hasAttribute('data-year')) {
               let value = el.getAttribute("data-year");
            if (value == "" || value == null) {
                breakLoop = true;
                returnData.valid = false
                showError("Year cannot be empty" , "date")
            }
          else  if (Number(value) > new Date().getFullYear()) {
            breakLoop = true;
            returnData.valid = false
                   showError("Year cannot be more than current year" , "date")
            }
            else if (Number(value) < 1900 && Number(value) > 0) {
                breakLoop = true;
                returnData.valid = false
showError("Invalid year, you can't be this old" , "date")
            }
            else {

            data.year = el.getAttribute("data-year");
            }
        }
       else  if (el.hasAttribute('data-month')) {
               let value = el.getAttribute("data-month");
            if (value == "" || value == null) {
                breakLoop = true;
                returnData.valid = false
                showError("Month cannot be empty" , "date")
            }
            else if (Number(value) > 12 || Number(value) <= 0) {
                breakLoop = true;
                returnData.valid = false
                showError("Invalid month" , "date")
            }
            else if (!isMonthCorrect(value)) {
                breakLoop = true;
                returnData.valid = false
                showError("Invalid month" , "date")
            }
            
            
            else {

            data.month = convertMonthToNumber(el.getAttribute("data-month"));
            }
        }
        else if (el.hasAttribute('data-day')) {
            let value = el.getAttribute("data-day");
            const matches = [...el.getAttribute("data-day").matchAll(/[a-z]/gi)];
            if (matches.length > 0) {
                breakLoop = true;
                returnData.valid = false
                showError("Invaid day" , "date")
            }
             else if (value == "" || value == null) {
                breakLoop = true;
                returnData.valid = false
                showError("Day cannot be empty" , "date")
            }
            else if(Number(value) > 31 || Number(value) <= 0) {
                breakLoop = true;
                returnData.valid = false
showError("Invalid day" , "date")
            }
           
            else {
                data.day = value;
            }
        }
    }
    })
    if (data != null) {
        if (!isValidDate(data.day , data.month , data.year)) {
            if (date.querySelector("#errorMessage").style.transform == "scale(0)")
                showError("Invalid date" , "date")
            returnData.valid = false;
        }
    }
})


if (returnData.valid && !breakLoop)  {

    hideAllErrors();
    returnData.data = data;
}


   return returnData;
}
function isValidDate(day, month, year) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);

  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return false;

  const testDate = new Date(y, m - 1, d);

  return (
    testDate.getFullYear() === y &&
    testDate.getMonth() + 1 === m &&
    testDate.getDate() === d
  );
}

function isMonthCorrect(monthName) {
  if (!monthName) return false;

  const normalized = monthName.toString().trim().toLowerCase();

  const validMonths = new Set([
    // Full names
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
    // Abbreviated names
    "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
    // Numbers as strings
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
    "01", "02", "03", "04", "05", "06", "07", "08", "09"
  ]);

  return validMonths.has(normalized);
}


function createAccount(email , isContinue = false) { 
 let formContent = document.querySelector(".form-content");
 let formContentImage = document.querySelector(".form-image");
 
 formContentImage.className = "form-image form-image-deactivate"
 formContentImage.querySelector("main img").style.opacity = "0";
 if (!isContinue) {
  setTimeout(() => {
      formContentImage.className = "form-image form-image-deactivate form-image-deactivate-2" 
      setTimeout(() => {
          formContentImage.querySelector("main img").style.filter = "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7472%) hue-rotate(206deg) brightness(114%) contrast(100%)";
          formContentImage.style.zIndex = "+2";
          setTimeout(() => {
              formContentImage.querySelector("main img").style.opacity = "1";
             showEmailFormContent(email)
          }, 1)
      }, 300)
    }, 500)
 }
  else {
     setTimeout(() => {
      formContentImage.className = "form-image form-image-deactivate form-image-deactivate-2" 
      setTimeout(() => {
          formContentImage.querySelector("main img").style.filter = "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7472%) hue-rotate(206deg) brightness(114%) contrast(100%)";
          formContentImage.style.zIndex = "+2";
          setTimeout(() => {
              formContentImage.querySelector("main img").style.opacity = "1";
             showEmailFormContent(email)
          }, 1)
      }, 300)
    }, 0)
  }
 formContent.className = "form-content form-content-deactivate"

}

function createAccountLoading() {
    let data = getFormData();
    if (data.valid) {
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
             createAccountLoadingInCard();
          }, 1)
      }, 300)
    }, 500)
 formContent.className = "form-content form-content-deactivate"

    }
else {
    let continueBtn = document.querySelector(".form-content .continue-email")
         continueBtn.style.display = "none";
}
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
 
formContentImage.setAttribute("continue" , "true");
 let emailContent = formContentImage.querySelector(".form-email-sent-container")
 formContent.style.transition = "400ms";
 formContentImage.style.transition = "400ms";
 formContentImage.className = "form-image form-image-deactivate"
 formContent.className = "form-content form-content-active"
 formContentImage.querySelector("main img").style.filter = "";
 let continueBtn = document.querySelector(".form-content .continue-email")
         continueBtn.style.display = "flex";
 emailContent.className = 'form-email-sent-container'
 formContentImage.className = "form-image" 

    setTimeout(() => {
      setTimeout(() => {
          formContentImage.style.zIndex = "unset";
         
      }, 300)
    }, 500)

}


function showEmailFormContent(emailText = null) {
let emailContent = document.querySelector(".form-email-sent-container")
emailContent.style.transition = "400ms"
             emailContent.className = 'form-email-sent-container-active form-email-sent-container'
             if (emailText != null)
             emailContent.querySelector(".email-sent-text a").innerText = emailText;
             setTimeout(() => {
                emailContent.style.transition = "";
             }, 400);
             // pending => when this function is called set inputs to empty when design final
}



function createAccountLoadingInCard() {
let formCreating = document.querySelector(".form-creating");
formCreating.style.transform = "scale(1)";
setTimeout(() => {
    createAccountPost();
    
}, 1000)
}


function createAccountPost() {
let data = getFormData();
if (data.valid) {
    
    
    setTimeout(() => {
        
        let formCreating = document.querySelector(".form-creating");
        let formContentImage = formCreating.closest(".form-image");
        // $.ajax({
            //     url: ""
            // })
            
            // this on success function
            formContentImage.setAttribute("continue" , "false");
            let continueBtn = document.querySelector(".form-content .continue-email")
            continueBtn.style.display = "none";
            formCreating.style.transition = "600ms"
            formCreating.style.transform = "scale(0)";
            formCreating.style.opacity = "0";
            setTimeout(() => {
                
                formCreating.style.opacity = "1";
                formCreating.style.transition = "0"
            }, 600)
            showEmailFormContent(data.data.email);
        }, 3000)
    }
    }
    
    function continuteForm() {
        createAccount(null , true);
    }

    


    function continueWithGoogle() {
// get data from backend and fill in form and then show alert data has been filed, now desiced username and password
    }
    function continueWithFacebook() {
// get data from backend and fill in form and then show alert data has been filed, now desiced username and password
    }

    
    function phoneSignUpBtn() {
       let formData = getFormData();
       // this is where loading starts of creating accout animation
    }

    function startContentLoading() {
        // this is the function that triggers phone's loading screen of creating account animation
    }

    