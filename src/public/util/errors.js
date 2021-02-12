export function error(msg){
	const errorDiv = document.getElementById("error");
  errorDiv.style.display = "";
  const errorText = document.getElementById('errorText');
  errorText.innerHTML = msg;
  errorDiv.onclick = () => {
    errorDiv.style.display = "none";
  }
	// how to get 
}