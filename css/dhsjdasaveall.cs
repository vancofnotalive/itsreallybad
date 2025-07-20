using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Unify.Application.Services.Authentication;
using Unify.Web.ViewModels;
using Unify.Web.WebInfo;

namespace Unify.Web.Controllers
{
    public class AccountController : UnifyController
    {
        private readonly IIdentityService _identityService;
        public AccountController(IIdentityService identityService)
        {
             _identityService = identityService;
        }

        [HttpGet]
        public IActionResult AccessDenied()
        {

            return View();
        }
        [HttpGet]
        public IActionResult Login()
        {
            var loginVM = new LoginVM();
            return View(loginVM);
        }

        [HttpPost]
            public async Task<IActionResult> Login([FromBody] LoginVM loginVM)
            {
            /* * 
            here in error messages "password:" in the start means to show this error at password text box. Same goes for email 
             * */

            var result = Validation.LoginVM(loginVM);
            
         if (!result.Success)
                return ErrorResponse(400 , result.Result , result.Errors.ToArray());

            if (loginVM.Method == StaticData.LoginMethods.Username)
            {
             var loginResult = await _identityService.AuthenticationService.SignInByUsernameAsync(loginVM.Username , loginVM.Password);
                if (!loginResult.Success)
                    return ErrorResponse(400, errorMessages: "password:Invalid login attempt");

                return CompleteResponse(200, new { redirectUrl = "/Home/Index" });
            }

            if (loginVM.Method == StaticData.LoginMethods.Email)
            {
                var loginResult = await _identityService.AuthenticationService.SignInByEmailAsync(loginVM.Email, loginVM.Password);
                if (!loginResult.Success)
                    return ErrorResponse(400, errorMessages: "password:Invalid login attempt");

                return CompleteResponse(200, new { redirectUrl = "/Home/Index" });

            }
            if (loginVM.Method == StaticData.LoginMethods.Both)
            {
                var loginResult = await _identityService.AuthenticationService.SignInByEmailAsync(loginVM.Email, loginVM.Password);
                if (!loginResult.Success)
                {
                    var usernameLoginResult = await _identityService.AuthenticationService.SignInByEmailAsync(loginVM.Username, loginVM.Password);
                    if (!usernameLoginResult.Success)
                    return ErrorResponse(400, errorMessages: "password:Invalid login attempt");
                }
                return CompleteResponse(200 , new {redirectUrl = "/Home/Index"});
            }
         
            return ErrorResponse(400 , errorMessages: "Something went wrong");
            }

        

    }
}

/* * 
<reminder date="18-07-2025"> 
Now in view of login, and here try to send success response 
and set redirect url and see if it gets redirected
and then move to sign in form


</reminder>

 * */