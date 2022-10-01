**README FILE**

**Auswertung von Serverzugriffen von EPA**

To start up the project open it in VS-Code, open a terminal, go to the project directory and enter ‘node index.js’. The app will be hosted locally @ http://127.0.0.1:8080

**Technologies used:**

NodeJS
JavaScript + jQuery
HTML / CSS
AnyChart CDN from https://www.anychart.com/de/

**USING ANOTHER epa-http.txt**

Add these header-names to the first line of the custom 'epa-http.txt' document.

**host timestamp method url protocol response_code document_size**

Make sure that the data in the 'epa-http.txt' is in following order:

**141.243.1.172 [29:23:53:25] "GET /Software.html HTTP/1.0" 200 1497**