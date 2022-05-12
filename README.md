# Proiect-CloudComputing-Back
Covid test results

Student: Vișan Andreea-Manuela, SIMPRE, grupa 1119
Introducere
În cadrul acestui proiect am ales să creez o aplicație web, folosind ca tehnologii Node.js și React. 
Am folosit ca servicii în Cloud:
	Baza de date SQL a Google Cloud Platform – pentru stocarea mesajelor trimise de către cadrele medicale pacienților prin email
	Translation API de la Google Cloud Platform – pentru traducerea mailurilor trimise către pacienți
	SendGrid – serviciu de cloud care permite trimiterea mailurilor de la o adresă definită, pe baza unui API Key, către mai mulți destinatari
	Heroku – pentru deploymentul aplicației dezvoltate

Linkurile către repository-urile publice sunt următoarele:
https://github.com/manuelavisan/Proiect-CloudComputing-Back 
https://github.com/manuelavisan/Proiect-CloudComputing-Front 
Linkul către prezentarea video este următorul:

Descriere problemă
Am ales să îmbin în tema acestui proiect 2 subiecte de actualitate, și anume pandemia de Covid 19 și războiul care are loc în Ucraina. În cadrul aplicației, cadrele medicale introduc rezultatele testelor pacienților, alături de adresa lor de email și pot selecta o limbă de traducere pentru a trimite pe email acest rezultat. 
În ceea ce privește situația țării vecine, am ales să introduc elemente care să arate sprijinul României pentru refugiații din Ucraina și pentru a trage un semnal de alarmă: războiul trebuie să înceteze, întrucât problema este virusul, nu oamenii.
Am ales în mod special mesajul din footer – “We are in this together – and we will get through this together!” pentru că surprinde întocmai responsabilitatea pe care o avem cu toții: aceea de a ne proteja pe noi înșine și pe ceilalți de virus, dar și de a-i sprijini pe cei aflați în impas și de a ne exprima solidaritatea prin diverse măsuri care să grăbească sfârșitul războiului.


Descriere API
Am folosit API-ul de translate din cadrul Google Cloud Platform, API REST, pentru care am definit două endpointuri, două puncte în care eu interacționez cu acesta pentru a obține informațiile de care am nevoie:
Astfel, pot interacționa cu acesta prin requesturi de tip GET și POST:
	http://localhost:8080/utils/detect   GET
Exemplu de request: {
    "text": "Salut! Je suis Manu!"
}

Exemplu de response: {
    "language": "fr"
}

Eroarea pe care am definit-o este următoarea: în cazul în care se încearcă trimiterea unui body gol, din care lipsește unicul parametru, utilizatorul primește cod 400 Bad Request și mesajul “Missing parameters!”.


	http://localhost:8080/utils/translate   GET
Exemplu de request: {
    "text": "Buna! Eu sunt Manu!"
    "language": "FRENCH
}

Exemplu de response: {
    "translatedText": "Salut, je m'appelle Manu !"
}

Erorile pe care le-am definit sunt următoarele: 
•	în cazul în care se încearcă trimiterea unui body gol sau din care lipsește un parametru, utilizatorul primește cod 400 Bad Request și mesajul “Missing parameters!”.
•	în cazul în care pe cheia “language” se introduce o limbă care nu se află în whitelistul pe care l-am definit, utilizatorul primește cod 400 Bad Request și mesajul “Invalid language!”.

Alte endpointuri sunt definite la baza de date și sunt următoarele:
Metode GET: prin care citesc date
o	http://localhost:8080/messages - prin care obțin toate testele din baza de date
Exemplu de request: http://localhost:8080/messages
Exemplu de response: {
    "messages": [
        {
            "entryID": 16,
            "senderName": "Manu",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "manu_monnet@yahoo.com",
            "messageContent": "Your test result is negative!"
        },
        {
            "entryID": 18,
            "senderName": "Andreea",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "visanmanuela2@gmail.com",
            "messageContent": "Your Covid test result is positive..."
        },
        {
            "entryID": 19,
            "senderName": "Andreea Manuela Visan",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "visanmanuela2@gmail.com",
            "messageContent": "Poti pleca in concediu, testul covid e negativ!"
        },
        {
            "entryID": 20,
            "senderName": "Roxana",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "visanmanuela@gmail.com",
            "messageContent": "Your PCR test result is negative!"
        },
        {
            "entryID": 21,
            "senderName": "Manutu",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "mirelutzavisan@yahoo.com",
            "messageContent": "test test test"
        },
        {
            "entryID": 23,
            "senderName": "Ioana Vladoescu",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "manu_monnet@yahoo.com",
            "messageContent": "Testul dvs este pozitiv. Va rugam luati legatura cu medicul de familie!"
        },
        {
            "entryID": 24,
            "senderName": "Marian Dobra",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "dobra_marian99@yahoo.ro",
            "messageContent": "Testul dvs este negativ! "
        },
        {
            "entryID": 25,
            "senderName": "Marian Dobra",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "dobra_marian99@yahoo.ro",
            "messageContent": "Testul dvs este negativ! "
        }
    ]
}


o	http://localhost:8080/messages/19 - prin care obțin din baza de date doar testul cu id-ul specificat
Exemplu de request: http://localhost:8080/messages/19
Exemplu de response: {
    "messages": [
        {
            "entryID": 19,
            "senderName": "Andreea Manuela Visan",
            "senderMail": "aplicatieLicenta2021@gmail.com",
            "receiverMail": "visanmanuela2@gmail.com",
            "messageContent": "Poti pleca in concediu, testul covid e negativ!"
        }
    ]
}

Eroarea pe care am definit-o este următoarea: în cazul în care se încearcă apelarea cu un id inexistent, utilizatorul primește cod 400 Bad Request și mesajul “Message not found”.


Metode POST: prin care creez date (se poate face doar creare, editarea se face prin PUT)
o	http://localhost:8080/messages - inserez un nou test de Covid in baza de date
Exemplu de request: { 
"senderName": "Andreea Manuela Visan",
"senderMail": "aplicatieLicenta2021@gmail.com",
"receiverMail": "visanmanuela2@gmail.com",
"messageContent": "Testul COVID din data de 12.05. 2022 este pozitiv. Va rugam sa va izolati si sa contactati medicul de familie."}

Exemplu de response: {
    "results": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 29,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}

Eroarea pe care am definit-o este următoarea: în cazul în care se încearcă trimiterea unui body din care lipsește un parametru, utilizatorul primește cod 400 Bad Request și mesajul “Missing parameters!”

o	http://localhost:8080/utils/send  - prin care trimit un mail cu testul COVID către un pacient
Endpointul este definit la serviciul Sendgrid.
Exemplu de request: {
"senderName": "Andreea Manuela Visan",
"senderMail": "aplicatieLicenta2021@gmail.com",
"receiverMail": "visanmanuela2@gmail.com",
"messageContent": "This is a test message!" }
Exemplu de response:
Din păcate, din cauza suprasolicitării serviciului Sendgrid, datele au fost trimise cu succes, însă nu sunt procesate la timp, după cum se poate vedea și în printscreenul din terminal:
 

Eroarea pe care am definit-o este următoarea: în cazul în care se încearcă trimiterea unui body din care lipsește un parametru, utilizatorul primește cod 400 Bad Request și mesajul “Missing parameters!”

http://localhost:8080/messages/foreign - prin care trimit un mail cu testul COVID către un pacient, cu rezultatul tradus în limba oferită ca parametru
Exemplu de request:
"senderName": "Andreea Manuela Visan",
"senderMail": "aplicatieLicenta2021@gmail.com",
"receiverMail": "visanmanuela2@gmail.com",
"messageContent": "This is a test message!",
 "language": "FRENCH"
}
Exemplu de response: {
    "translationData": {
        "translatedText": "Ceci est un message test!"
    }
}

Erorile pe care le-am definit sunt următoarele:
•	în cazul în care se încearcă trimiterea unui body gol sau din care lipsește un parametru, utilizatorul primește cod 400 Bad Request și mesajul “Missing parameters!”.
•	în cazul în care pe cheia “language” se introduce o limbă care nu se află în whitelistul pe care l-am definit și nu este nici “ALL”, utilizatorul primește cod 400 Bad Request și mesajul “Invalid language!”.

Metoda PUT: prin care updatez date
o	http://localhost:8080/messages/24 - pe baza id-ului indicat, updatez testul de COVID
Exemplu de request: http://localhost:8080/messages/24
Exemplu de response: {
    "results": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
        "protocol41": true,
        "changedRows": 1
    }
}

Erorile pe care le-am definit sunt următoarele:
•	în cazul în care se încearcă apelarea fără un id sau lipsește un parametru, utilizatorul primește cod 400 Bad Request și mesajul “Bad request. Missing parameters!”
•	în cazul în care nu există rezultate, utilizatorul primește cod 404 și mesajul “Message not found”.

Metoda DELETE: prin care șterg date
o	http://localhost:8080/messages/29 - pe baza id-ului indicat, șterg testul de COVID din baza de date
Exemplu de request: http://localhost:8080/messages/29
Exemplu de response: {
    "results": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}

Erorile pe care le-am definit sunt următoarele: 
•	în cazul în care se încearcă apelarea fără un id, utilizatorul primește cod 400 Bad Request și mesajul “Bad request. Missing parameters!”
•	în cazul în care nu există rezultate, utilizatorul primește cod 404 și mesajul “Message not found”.

În Postman mi-am definit o colecție în care să stochez toate aceste request-uri HTTP, pentru a facilita call-urile pe rutele create. Lucrând în acest mod, totul este mai organizat și pot apela foarte repede requestul de care am nevoie.
 

Captură din ecranul aplicației
 


Concluzii
Pentru a dezvolta mai departe această aplicație, mă gândesc să adaug și Vision API ca improvement, pentru a putea permite OCR (optical character recognition). Astfel, un utilizator ar putea încărca o imagine a testului său, aplicația ar prelua textul și astfel ar putea obține traduceri pentru rezultatul său în mai multe limbi și le poate primi pe mail.
De asemenea, interfața poate fi îmbunătățită, pentru a oferi un UX cât mai plăcut.

Referințe
https://gurita-alexandru.gitbook.io/cloud-computing-2022-simpre/ 
https://www.youtube.com/watch?v=3qra7B0-M94&list=PLNg1OHxiA0eZ2fy-dqggWmC1Yy_P0Kj7U&index=1 
https://www.youtube.com/watch?v=LRsAF9DB_ag 
https://www.youtube.com/watch?v=iUqhgJHXmVM
https://github.com/guritaalexandru/CloudComputing-Back
https://v2.tailwindcss.com/docs
