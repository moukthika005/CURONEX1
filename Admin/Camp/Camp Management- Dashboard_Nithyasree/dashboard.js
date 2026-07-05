document.addEventListener("DOMContentLoaded",()=>{

    requireLogin();

    const username=
    sessionStorage.getItem(
        "curonex_username"
    );

    const profileName=
    document.getElementById(
        "profileName"
    );

    const avatar=
    document.querySelector(
        ".profile-avatar"
    );

    if(username){

        if(profileName){

            profileName.textContent=
            username;
            const welcome=
document.getElementById(
"welcomeText"
);

if(welcome){

    welcome.textContent=

    "Welcome back, " +

    username;

}

        }

        if(avatar){

            avatar.textContent=
            username
            .charAt(0)
            .toUpperCase();

        }

    }

    /* Animate stat cards */

    document
    .querySelectorAll(".stat-value")
    .forEach(el=>{

        const target=
        parseInt(
            el.textContent
            .replace(/[^0-9]/g,""),
            10
        );

        if(isNaN(target))
            return;

        let current=0;

        const step=
        Math.max(
            1,
            Math.ceil(target/30)
        );

        const timer=
        setInterval(()=>{

            current+=step;

            if(current>=target){

                current=target;

                clearInterval(timer);

            }

            el.textContent=current;

        },20);

    });

    /* Profile */

    document
    .getElementById("myProfileBtn")
    .addEventListener("click",(e)=>{

        e.preventDefault();

        goToProfile();

    });

    /* Logout */

    document
    .getElementById("logoutBtn")
    .addEventListener("click",(e)=>{

        e.preventDefault();

        logoutUser();

    });
sessionStorage.setItem(

"lastCampDashboardVisit",

new Date().toLocaleString()

);
});