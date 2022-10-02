**README FILE**

**Auswertung von Serverzugriffen von EPA**

This web-application CHECKS local storage for settings, then LOADS in data from epa-http.txt
The data is FORMATTED to fit the json structure in 'access_log_EPA_Jul95_parsed.json'
The data is SPLIT up into 4 sets, COUNTED through and DISPLAYED in 4 separate charts from 'AnyChart' (CDN Extension)

To start up the project open it in VS-Code, open a terminal, go to the project directory and enter ‘node server.js’. 

The app will be hosted locally @ http://127.0.0.1:8080

**Technologies used:**

NodeJS / JavaScript + jQuery HTML / CSS + AnyChart CDN from https://www.anychart.com/de/

**USING ANOTHER epa-http.txt**

Add these header-names to the first line of any custom 'epa-http.txt':

**host timestamp method url protocol response_code document_size**