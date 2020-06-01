function copy() {
  var copyText = document.getElementById("shortenUrl");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");

  document.getElementById("copyBtn").innerText = "Copied!";
}
