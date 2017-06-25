// ------
// Wey, a modal!
//----

var termsBtn = document.getElementById("termsBtn");
var termsModal = document.getElementById('termsModal');
var closeTerms = document.getElementsByClassName("closeTerms")[0];
termsBtn.onclick = function() {
    termsModal.style.display = "block";
}
closeTerms.onclick = function() {
    termsModal.style.display = "none";
}

var privacyModal = document.getElementById('privacyModal');
var privacyBtn = document.getElementById("privacyBtn");
var closePrivacy = document.getElementsByClassName("closePrivacy")[0];

privacyBtn.onclick = function() {
    privacyModal.style.display = "block";
}
closePrivacy.onclick = function() {
    privacyModal.style.display = "none";
}

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == termsModal || event.target == privacyModal) {
        termsModal.style.display = "none";
        privacyModal.style.display = "none";
    }
}
