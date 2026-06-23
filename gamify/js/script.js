window.addEventListener('GreeterReady', function () {
    var xhr = new XMLHttpRequest();
    const date = new Date().getDate();

    const theme_list = [
        "../html/lain.html",
        "../html/lily.html", 
        "../html/hk.html",
        "../html/silksong.html"
    ];
    const theme_len = theme_list.length;

    xhr.open("GET", theme_list[date%theme_len], true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.documentElement.innerHTML = xhr.responseText;
            executeScripts();
        }
    };
    xhr.send();
});

function executeScripts() {
    const scripts = document.querySelectorAll("script");
    scripts.forEach((script) => {
        if (script.src) {
            const newScript = document.createElement("script");
            newScript.src = script.src;
            document.body.appendChild(newScript);
        } else {
            eval(script.innerText); // Run inline scripts
        }
    });
}
