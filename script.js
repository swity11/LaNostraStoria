// === 1. CONFIGURAZIONE E INIZIALIZZAZIONE FIREBASE ===
const firebaseConfig = {
    apiKey: "AIzaSyDdhoHC6hhXl8rshWvxbTWT8hMkoa82pl4",
    authDomain: "amoremio-43a39.firebaseapp.com",
    databaseURL: "https://amoremio-43a39-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "amoremio-43a39",
    storageBucket: "amoremio-43a39.firebasestorage.app",
    messagingSenderId: "948222176917",
    appId: "1:948222176917:web:881c34a38da68ffc9d759c",
    measurementId: "G-2186W8C114"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Distingue chi invia il messaggio
// Nota: Sul tuo telefono lascialo così ("io"). Sul telefono della tua ragazza cambialo in "amore"!
let mioID = "io"; 


// === 2. SCHERMATA DI BLOCCO ===
const codiceSegreto = "080526"; // La vostra data speciale
let codiceInserito = "";

function premiTasto(numero) {
    if (codiceInserito.length < 6) {
        codiceInserito += numero;
        aggiornaPallini();

        if (codiceInserito.length === 6) {
            setTimeout(controllaCodice, 200);
        }
    }
}

function cancellaTasto() {
    if (codiceInserito.length > 0) {
        codiceInserito = codiceInserito.slice(0, -1);
        aggiornaPallini();
    }
}

function aggiornaPallini() {
    const pallini = document.querySelectorAll(".dot");
    pallini.forEach((pallino, index) => {
        if (index < codiceInserito.length) {
            pallino.classList.add("pieno");
        } else {
            pallino.classList.remove("pieno");
        }
    });
}

function controllaCodice() {
    if (codiceInserito === codiceSegreto) {
        const lockScreen = document.getElementById("lock-screen");
        lockScreen.style.opacity = "0";
        
        setTimeout(() => {
            lockScreen.style.display = "none";
            codiceInserito = "";
            aggiornaPallini();
            lockScreen.style.opacity = "1";
        }, 500);
    } else {
        const contenitorePallini = document.querySelector(".dots-container");
        contenitorePallini.classList.add("errore-shake");
        
        setTimeout(() => {
            contenitorePallini.classList.remove("errore-shake");
            codiceInserito = "";
            aggiornaPallini();
        }, 400);
    }
}


// === 3. SEZIONE TIMER & COUNTDOWN ===
const inizio = new Date("2026-05-08T00:00:00");

function aggiornaContatore() {
    const oggi = new Date();
    const differenza = oggi - inizio;

    const giorni = Math.floor(differenza / (1000 * 60 * 60 * 24));
    const ore = Math.floor((differenza / (1000 * 60 * 60)) % 24);
    const minuti = Math.floor((differenza / (1000 * 60)) % 60);
    const secondi = Math.floor((differenza / 1000) % 60);

    const el = document.getElementById("counter");
    if(el) {
        el.innerHTML = `${giorni} giorni, ${ore} ore, ${minuti} minuti e ${secondi} secondi 🩷`;
    }
}
setInterval(aggiornaContatore, 1000);
aggiornaContatore();

function aggiornaMiniCountdown() {
    const giornoAnniversario = 8;
    const meseAnniversario = 4; // Maggio (0=Gennaio)

    const oraCorrente = new Date();
    let annoCorrente = oraCorrente.getFullYear();

    let prossimoAnniversario = new Date(annoCorrente, meseAnniversario, giornoAnniversario);

    if (oraCorrente > prossimoAnniversario) {
        prossimoAnniversario.setFullYear(annoCorrente + 1);
    }

    const differenza = prossimoAnniversario - oraCorrente;
    const el = document.getElementById("giorni-mancanti");

    if (el) {
        if (differenza <= 0) {
            el.innerHTML = "Oggi! 🎉";
        } else {
            const giorni = Math.ceil(differenza / (1000 * 60 * 60 * 24));
            el.innerHTML = giorni;
        }
    }
}
aggiornaMiniCountdown();


// === 4. CHAT DI COPPIA IN TEMPO REALE ===
function apriChat() {
    document.getElementById("chat-schermo").style.display = "flex";
    caricaMessaggi();
}

function chiudiChat() {
    document.getElementById("chat-schermo").style.display = "none";
}

function inviaMessaggio() {
    const input = document.getElementById("input-messaggio");
    const testo = input.value.trim();

    if (testo === "") return;

    const nuovoMessaggio = {
        mittente: mioID,
        testo: testo,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    database.ref("chat_coppia").push(nuovoMessaggio);
    input.value = "";
}

function gestisciInvioInvio(e) {
    if (e.key === "Enter") inviaMessaggio();
}

function caricaMessaggi() {
    const lista = document.getElementById("lista-messaggi");

    database.ref("chat_coppia").on("value", (snapshot) => {
        lista.innerHTML = "";
        const dati = snapshot.val();

        if (dati) {
            Object.values(dati).forEach(msg => {
                const div = document.createElement("div");
                const classeMittente = (msg.mittente === mioID) ? "inviato" : "ricevuto";
                div.className = `messaggio ${classeMittente}`;
                
                div.innerHTML = `
                    <div>${msg.testo}</div>
                    <div class="ora-messaggio">${msg.timestamp}</div>
                `;
                
                lista.appendChild(div);
            });

            lista.scrollTop = lista.scrollHeight;
        }
    });
}


// === 5. SEZIONE SORPRESA (Frasi e Cuoricini) ===
const frasiAmore = [
    "Sei il mio primo pensiero al mattino e l'ultimo prima di dormire. 🩷",
    "Amore mio, ogni istante con te è pura magia. 🩷",
    "Non ho mai smesso di innamorarmi di te dal primo momento. 🩷",
    "Sei il mio rifugio sicuro e la mia pace. 🩷",
    "Guardarti sorridere mi riempie il cuore di gioia. 🩷",
    "Insieme a te ho trovato tutto ciò che cercavo. 🩷",
    "Rendi la mia vita migliore semplicemente essendoci, amore. 🩷",
    "Sei la stella più luminosa del mio cielo. 🩷",
    "Ogni giorno che passo con te è un regalo meraviglioso. 🩷",
    "Il mio cuore batte più forte solo a sentire il tuo nome. 🩷",
    "Sei la mia persona preferita in assoluto. 🩷",
    "Non potrei mai immaginare il mio futuro senza di te al mio fianco. 🩷",
    "La mia felicità ha i tuoi occhi e il tuo sorriso. 🩷",
    "Amore, sei la ragione per cui mi sveglio felice ogni mattina. 🩷",
    "Tutto ha più senso da quando ci sei tu nella mia vita. 🩷",
    "Stringerti forte tra le mie braccia è la sensazione più bella dell'universo. 🩷",
    "Non importa dove andiamo, l'importante è tenersi per mano. 🩷",
    "Sei la mia certezza più bella. 🩷",
    "Ti sceglierei in questa vita e in altre mille ancora, amore mio. 🩷",
    "Sei esattamente tutto ciò di cui ho bisogno. 🩷"
];

function sorpresa() {
    const secretElement = document.getElementById("secret");
    const indiceCasuale = Math.floor(Math.random() * frasiAmore.length);
    
    secretElement.innerHTML = frasiAmore[indiceCasuale];

    secretElement.classList.remove("fade-in");
    void secretElement.offsetWidth; 
    secretElement.classList.add("fade-in");

    creaPioggiaDiCuoricini();
}

function creaPioggiaDiCuoricini() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const cuore = document.createElement("div");
            cuore.innerHTML = "🩷";
            cuore.className = "cuoricino-volante";
            cuore.style.left = Math.random() * 100 + "vw";
            cuore.style.fontSize = (Math.random() * 20 + 15) + "px";
            document.body.appendChild(cuore);

            setTimeout(() => {
                cuore.remove();
            }, 3000);
        }, i * 100);
    }
}


// === 6. GALLERIA RICORDI ===
let indiceFotoCorrente = null;

function scegliFoto() {
    document.getElementById("fileInput").click();
}

function salvaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const fotoCompressaDataUrl = canvas.toDataURL("image/jpeg", 0.8);

            let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
            fotoSalvate.push(fotoCompressaDataUrl);
            
            try {
                localStorage.setItem("fotoAmore", JSON.stringify(fotoSalvate));
                alert("Foto aggiunta ai nostri ricordi! 🩷");
            } catch (errore) {
                alert("Oops! Memoria piena.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function apriGalleria() {
    document.getElementById("galleria-schermo").style.display = "flex";
    const griglia = document.getElementById("griglia-foto");
    griglia.innerHTML = ""; 

    let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];

    if (fotoSalvate.length === 0) {
        griglia.innerHTML = "<p style='color:white; grid-column: 1 / -1; text-align:center; padding: 20px;'>Non hai ancora aggiunto foto.</p>";
        return;
    }

    fotoSalvate.forEach((dataUrl, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "img-wrapper";
        
        const img = document.createElement("img");
        img.src = dataUrl;
        img.alt = "Ricordo di coppia " + (index + 1);
        
        img.onclick = function() {
            apriFotoGrande(index);
        };
        
        wrapper.appendChild(img);
        griglia.appendChild(wrapper);
    });
}

function apriFotoGrande(index) {
    indiceFotoCorrente = index; 
    aggiornaImmagineGrande();
    document.getElementById("visualizzatore-singolo").classList.add("mostra");
}

function aggiornaImmagineGrande() {
    let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
    if (fotoSalvate.length === 0) return;

    if (indiceFotoCorrente < 0) {
        indiceFotoCorrente = fotoSalvate.length - 1;
    } else if (indiceFotoCorrente >= fotoSalvate.length) {
        indiceFotoCorrente = 0;
    }

    const imgGrande = document.getElementById("immagine-grande");
    imgGrande.src = fotoSalvate[indiceFotoCorrente];
}

function cambiaFoto(direzione, evento) {
    if (evento) evento.stopPropagation();
    
    let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
    if (fotoSalvate.length <= 1) return;

    indiceFotoCorrente += direzione;
    aggiornaImmagineGrande();
}

function chiudiFotoGrande() {
    document.getElementById("visualizzatore-singolo").classList.remove("mostra");
    indiceFotoCorrente = null;
}

function chiudiGalleria() {
    document.getElementById("galleria-schermo").style.display = "none";
    chiudiFotoGrande();
}

function chiediConfermaEliminazione() {
    if (indiceFotoCorrente === null) return;
    let conferma = confirm("Vuoi davvero eliminare questa foto dai ricordi? 🥺");
    
    if (conferma) {
        let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
        fotoSalvate.splice(indiceFotoCorrente, 1);
        localStorage.setItem("fotoAmore", JSON.stringify(fotoSalvate));
        
        chiudiFotoGrande();
        apriGalleria();
    }
}

// Scorrimento touch (Swipe)
let touchStartX = 0;
let touchEndX = 0;

const visualizzatore = document.getElementById("visualizzatore-singolo");
if (visualizzatore) {
    visualizzatore.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    visualizzatore.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) cambiaFoto(1);
        if (touchEndX > touchStartX + 50) cambiaFoto(-1);
    });
}

// === 7. BUCKET LIST CONDIVISA ===
function apriBucketList() {
    document.getElementById("bucket-schermo").style.display = "flex";
    caricaBucketList();
}

function chiudiBucketList() {
    document.getElementById("bucket-schermo").style.display = "none";
}

function aggiungiBucketItem() {
    const input = document.getElementById("input-bucket");
    const testo = input.value.trim();
    if (testo === "") return;

    const nuovoSogno = {
        testo: testo,
        completato: false
    };

    database.ref("bucket_list").push(nuovoSogno);
    input.value = "";
}

function gestisciInvioBucket(e) {
    if (e.key === "Enter") aggiungiBucketItem();
}

function caricaBucketList() {
    const lista = document.getElementById("lista-bucket");
    database.ref("bucket_list").on("value", (snapshot) => {
        lista.innerHTML = "";
        const dati = snapshot.val();
        
        if (dati) {
            Object.entries(dati).forEach(([id, item]) => {
                const div = document.createElement("div");
                div.className = `bucket-item ${item.completato ? 'completato' : ''}`;
                
                div.innerHTML = `
                    <div class="bucket-info" onclick="toggleBucketItem('${id}', ${item.completato})">
                        <input type="checkbox" ${item.completato ? 'checked' : ''} style="pointer-events: none;">
                        <span>${item.testo}</span>
                    </div>
                    <button class="bucket-elimina" onclick="eliminaBucketItem('${id}')">🗑️</button>
                `;
                lista.appendChild(div);
            });
        } else {
            lista.innerHTML = "<p style='text-align:center; color:#777; margin-top:20px;'>Nessun sogno aggiunto ancora. Scrivi il primo! 🩷</p>";
        }
    });
}

function toggleBucketItem(id, statoAttuale) {
    database.ref("bucket_list/" + id).update({
        completato: !statoAttuale
    });
}

function eliminaBucketItem(id) {
    database.ref("bucket_list/" + id).remove();
}

// === 8. GESTIONE MENU LATERALE ===
function apriMenu() {
    document.getElementById("sidebar-menu").classList.add("aperto");
    document.getElementById("overlay-menu").classList.add("aperto");
}

function chiudiMenu() {
    document.getElementById("sidebar-menu").classList.remove("aperto");
    document.getElementById("overlay-menu").classList.remove("aperto");
}

function apriChatDalMenu() {
    chiudiMenu(); // Richiude il menu per fare ordine
    setTimeout(apriChat, 300); // Aspetta un attimo che l'animazione finisca, poi apre la chat
}

// === 9. PALLA DELL'AMORE (MAGIC 8-BALL) ===
const risposteSfera = [
    "Certamente sì! 🩷",
    "Senza alcun dubbio ✨",
    "È altamente probabile 🥰",
    "Chiedimelo più tardi... 🤫",
    "Meglio di no per ora 🙈",
    "Assolutamente sì, amore mio! 💖",
    "Le stelle dicono di sì 🌟",
    "Mh, ci sto pensando... 🤔",
    "Sicuro al 100%! 💕",
    "Solo se mi dai un bacio prima 😘",
    "Le probabilità sono altissime! 🚀",
    "Chiedi al tuo cuore, lui sa già la risposta 💓",
    "Sì, ma solo se ordiniamo il gelato 🍨",
    "Ovviamente sì! Non ci sono dubbi 🌸"
];

function apriMagicBall() {
    document.getElementById("magic-schermo").style.display = "flex";
}

function chiudiMagicBall() {
    document.getElementById("magic-schermo").style.display = "none";
}

function apriMagicBallDalMenu() {
    chiudiMenu(); // Chiude il menu laterale
    setTimeout(apriMagicBall, 300); // Apre la sfera con la stessa transizione fluida della chat
}

function chiediAllaSfera() {
    const ball = document.getElementById("magic-ball");
    const textElement = document.getElementById("magic-text");

    // Fa partire l'animazione di scuotimento e nasconde il testo temporaneamente
    ball.classList.add("shake-ball");
    textElement.style.opacity = "0";

    setTimeout(() => {
        const indiceCasuale = Math.floor(Math.random() * risposteSfera.length);
        textElement.innerHTML = risposteSfera[indiceCasuale];
        textElement.style.opacity = "1";
        ball.classList.remove("shake-ball");
    }, 250);
}
