/*-----------------------------------------contact form-----------------------------------------*/

const form = document.querySelector(".contact-form");
const sendButton = document.querySelector(".send-mail");

sendButton.addEventListener("click", sendMail);

function sendMail(event) {
    event.preventDefault();

    var name= form.elements["name"].value;
    var subject = form.elements["subject"].value;
    var message = form.elements["message"].value;

    //create the link of the mail
    const mailtoLink = "mailto:terence.chardes@gmail.com" + 
    "?subject=" + encodeURIComponent(subject) + 
    "&body=" + encodeURIComponent("Nom : " + name + "\n\nMessage :\n" + message);

    //open the link
    window.open(mailtoLink, "_blank");
}

/*-----------------------------------------reveals animations-----------------------------------------*/

var reveals = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-bottom");
function onReveal(elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (element.isIntersecting) {
        element.target.classList.add("visible");
        }
    }
}
//observer is used to observe elements and see if they are visble or not, it triggers when (treshold * 100) % of the element is visible
var observer = new IntersectionObserver(onReveal, {threshold: 0.3});
for (var i = 0; i < reveals.length; i++) {
    observer.observe(reveals[i]);
}
