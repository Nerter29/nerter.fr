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

