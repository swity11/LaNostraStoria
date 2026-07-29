// ==========================================
// CONFIGURAZIONE FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDdhoHC6hhXl8rshWvxbTWT8hMkoa82pl4",
    authDomain: "amoremio-43a39.firebaseapp.com",
    databaseURL: "https://amoremio-43a39-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "amoremio-43a39",
    storageBucket: "amoremio-43a39.firebasestorage.app",
    messagingSenderId: "948222176917",
    appId: "1:948222176917:web:881c34a38da68ffc9d759c"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Cambiare su ogni telefono
// "io" = tuo telefono
// "amore" = telefono della tua ragazza
const mioID = "io";

// ==========================================
// SCHERMATA BLOCCO CODICE
// ==========================================
const codiceSegreto = "080526";
let codiceInserito = "";

function premiTasto(numero) {
    if (codiceInserito.length >= 6) return;

    codiceInserito += numero;
    aggiornaPallini();

    if (codiceInserito.length === 6) {
        setTimeout(controllaCodice, 150);
    }
}

function cancellaTasto() {
    if (codiceInserito.length === 0) return;
    codiceInserito = codiceInserito.slice(0, -1);
    aggiornaPallini();
}

function aggiornaPallini() {
    const pallini = document.querySelectorAll(".dot");
    pallini.forEach((p, i) => {
        p.classList.toggle("pieno", i < codiceInserito.length);
    });
}

function controllaCodice() {
    const lock = document.getElementById("lock-screen");

    if (codiceInserito === codiceSegreto) {
        lock.classList.add("sbloccato");
        setTimeout(() => {
            lock.style.display = "none";
        }, 600);
    } else {
        const box = document.querySelector(".dots-container");
        box.classList.add("errore-shake");

        setTimeout(() => {
            box.classList.remove("errore-shake");
            codiceInserito = "";
            aggiornaPallini();
        }, 400);
    }
}

// ==========================================
// TIMER RELAZIONE
// ==========================================
const inizio = new Date("2026-05-08T00:00:00");

function aggiornaContatore() {
    const ora = new Date();
    const diff = ora - inizio;

    if (diff < 0) return;

    const giorni = Math.floor(diff / (1000 * 60 * 60 * 24));
    const ore = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minuti = Math.floor(diff / (1000 * 60)) % 60;
    const secondi = Math.floor(diff / 1000) % 60;

    const elemento = document.getElementById("counter");

    if (elemento) {
        elemento.innerHTML = `${giorni} giorni, ${ore} ore, ${minuti} minuti e ${secondi} secondi 🩷`;
    }
}

setInterval(aggiornaContatore, 1000);
aggiornaContatore();

// ==========================================
// MINI COUNTDOWN ANNIVERSARIO
// ==========================================
function aggiornaMiniCountdown() {
    const oggi = new Date();
    let anno = oggi.getFullYear();
    let prossimo = new Date(anno, 4, 8); // 8 Maggio

    if (oggi > prossimo) {
        prossimo.setFullYear(anno + 1);
    }

    const giorni = Math.ceil((prossimo - oggi) / (1000 * 60 * 60 * 24));
    const el = document.getElementById("giorni-mancanti");

    if (el) {
        el.innerHTML = giorni;
    }
}
aggiornaMiniCountdown();

// ==========================================
// GESTIONE SCHERMATE
// ==========================================
function apriSchermata(id) {
    const schermata = document.getElementById(id);
    if (schermata) {
        schermata.style.display = "flex";
    }
}

function chiudiSchermata(id) {
    const schermata = document.getElementById(id);
    if (schermata) {
        schermata.style.display = "none";
    }
}

// ==========================================
// CHAT COPPIA FIREBASE
// ==========================================
let chatCaricata = false;

function apriChat() {
    apriSchermata("chat-schermo");
    if (!chatCaricata) {
        caricaMessaggi();
        chatCaricata = true;
    }
}

function chiudiChat() {
    chiudiSchermata("chat-schermo");
}

function inviaMessaggio() {
    const input = document.getElementById("input-messaggio");
    if (!input) return;

    const testo = input.value.trim();
    if (testo === "") return;

    const messaggio = {
        mittente: mioID,
        testo: testo,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    database.ref("chat_coppia").push(messaggio);
    input.value = "";
}

function gestisciInvioInvio(e) {
    if (e.key === "Enter") {
        inviaMessaggio();
    }
}

function caricaMessaggi() {
    const lista = document.getElementById("lista-messaggi");
    if (!lista) return;

    database.ref("chat_coppia").on("value", snapshot => {
        lista.innerHTML = "";
        const dati = snapshot.val();
        
        if (!dati) return;

        Object.values(dati).forEach(msg => {
            const div = document.createElement("div");
            const classe = msg.mittente === mioID ? "inviato" : "ricevuto";
            
            div.className = "messaggio " + classe;
            div.innerHTML = `
                <div>${msg.testo}</div>
                <div class="ora-messaggio">${msg.timestamp}</div>
            `;
            
            lista.appendChild(div);
        });

        lista.scrollTop = lista.scrollHeight;
    });
}

// ==========================================
// MENU LATERALE
// ==========================================
function apriMenu() {
    document.getElementById("sidebar-menu").classList.add("aperto");
    document.getElementById("overlay-menu").classList.add("aperto");
}

function chiudiMenu() {
    document.getElementById("sidebar-menu").classList.remove("aperto");
    document.getElementById("overlay-menu").classList.remove("aperto");
}

function apriChatDalMenu() {
    chiudiMenu();
    setTimeout(() => {
        apriChat();
    }, 300);
}

// ==========================================
// GALLERIA RICORDI
// ==========================================
let indiceFotoCorrente = null;

function scegliFoto() {
    const input = document.getElementById("fileInput");
    if (input) {
        input.click();
    }
}

function salvaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            const max = 900;
            let width = img.width;
            let height = img.height;

            if (width > max) {
                height = height * max / width;
                width = max;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const foto = canvas.toDataURL("image/jpeg", 0.75);
            let archivio = JSON.parse(localStorage.getItem("fotoAmore")) || [];
            
            archivio.push(foto);

            try {
                localStorage.setItem("fotoAmore", JSON.stringify(archivio));
                alert("Foto aggiunta ai ricordi 🩷");
            } catch(err) {
                alert("Memoria piena, elimina qualche foto");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function apriGalleria() {
    apriSchermata("galleria-schermo");
    const griglia = document.getElementById("griglia-foto");
    
    if (!griglia) return;
    
    griglia.innerHTML = "";
    const foto = JSON.parse(localStorage.getItem("fotoAmore")) || [];

    if (foto.length === 0) {
        griglia.innerHTML = `<p class="nessuna-foto">Non hai ancora aggiunto foto 🩷</p>`;
        return;
    }

    foto.forEach((immagine, index) => {
        const img = document.createElement("img");
        img.src = immagine;
        img.onclick = () => {
            apriFotoGrande(index);
        };
        griglia.appendChild(img);
    });
}

function apriFotoGrande(index) {
    indiceFotoCorrente = index;
    aggiornaFotoGrande();
    document.getElementById("visualizzatore-singolo").classList.add("mostra");
}

function aggiornaFotoGrande() {
    const foto = JSON.parse(localStorage.getItem("fotoAmore")) || [];
    if (foto.length === 0) return;

    if (indiceFotoCorrente < 0) {
        indiceFotoCorrente = foto.length - 1;
    }
    if (indiceFotoCorrente >= foto.length) {
        indiceFotoCorrente = 0;
    }

    document.getElementById("immagine-grande").src = foto[indiceFotoCorrente];
}

function cambiaFoto(direzione) {
    const foto = JSON.parse(localStorage.getItem("fotoAmore")) || [];
    if (foto.length <= 1) return;

    indiceFotoCorrente += direzione;
    aggiornaFotoGrande();
}

function chiudiFotoGrande() {
    document.getElementById("visualizzatore-singolo").classList.remove("mostra");
    indiceFotoCorrente = null;
}

function chiudiGalleria() {
    chiudiSchermata("galleria-schermo");
    chiudiFotoGrande();
}

function chiediConfermaEliminazione() {
    if (indiceFotoCorrente === null) return;
    if (!confirm("Eliminare questa foto? 🥺")) return;

    let foto = JSON.parse(localStorage.getItem("fotoAmore")) || [];
    foto.splice(indiceFotoCorrente, 1);
    localStorage.setItem("fotoAmore", JSON.stringify(foto));
    
    chiudiFotoGrande();
    apriGalleria();
}

// ==========================================
// SWIPE FOTO IPHONE
// ==========================================
let touchStartX = 0;
const viewer = document.getElementById("visualizzatore-singolo");

if (viewer) {
    viewer.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    viewer.addEventListener("touchend", e => {
        let fine = e.changedTouches[0].screenX;
        
        if (fine < touchStartX - 50) {
            cambiaFoto(1);
        }
        if (fine > touchStartX + 50) {
            cambiaFoto(-1);
        }
    });
}

// ==========================================
// BUCKET LIST CONDIVISA
// ==========================================
function apriBucketList() {
    apriSchermata("bucket-schermo");
    caricaBucketList();
}

function chiudiBucketList() {
    chiudiSchermata("bucket-schermo");
}

function aggiungiBucketItem() {
    const input = document.getElementById("input-bucket");
    if (!input) return;

    const testo = input.value.trim();
    if (testo === "") return;

    database.ref("bucket_list").push({
        testo: testo,
        completato: false
    });
    
    input.value = "";
}

function gestisciInvioBucket(e) {
    if (e.key === "Enter") {
        aggiungiBucketItem();
    }
}

function caricaBucketList() {
    const lista = document.getElementById("lista-bucket");
    if (!lista) return;

    database.ref("bucket_list").on("value", snapshot => {
        lista.innerHTML = "";
        const dati = snapshot.val();

        if (!dati) {
            lista.innerHTML = `<p class="vuota">Nessun sogno ancora 🩷</p>`;
            return;
        }

        Object.entries(dati).forEach(([id, item]) => {
            const div = document.createElement("div");
            div.className = "bucket-item";
            
            if (item.completato) {
                div.classList.add("completato");
            }

            div.innerHTML = `
                <div class="bucket-info">
                    <input type="checkbox" ${item.completato ? "checked" : ""}>
                    <span>${item.testo}</span>
                </div>
                <button class="bucket-elimina">🗑️</button>
            `;

            div.querySelector("input").onclick = () => {
                database.ref("bucket_list/" + id).update({
                    completato: !item.completato
                });
            };

            div.querySelector(".bucket-elimina").onclick = () => {
                database.ref("bucket_list/" + id).remove();
            };

            lista.appendChild(div);
        });
    });
}

// ==========================================
// SFERA DELL'AMORE
// ==========================================
const risposteSfera = [
    "Certamente sì! ✨",
    "Direi proprio di sì amore mio 🩷",
    "Forse... il destino sta decidendo 🔮",
    "Assolutamente no 🙈",
    "Le stelle dicono sì 🌟",
    "Ovvio amoremio 🩷",
    "Probabilità altissime 💕",
    "Non lo so... ma ti amo comunque 🩷",
    "Sì, senza dubbio ❤️",
    "Riprova tra poco 😜"
];

function apriMagicBall() {
    apriSchermata("magic-schermo");
}

function chiudiMagicBall() {
    chiudiSchermata("magic-schermo");
}

function apriMagicBallDalMenu() {
    chiudiMenu();
    setTimeout(() => {
        apriMagicBall();
    }, 300);
}

function chiediAllaSfera() {
    const ball = document.getElementById("magic-ball");
    const testo = document.getElementById("magic-text");

    if (!ball || !testo) return;

    ball.classList.add("shake-ball");
    testo.style.opacity = "0";

    setTimeout(() => {
        const risposta = risposteSfera[Math.floor(Math.random() * risposteSfera.length)];
        testo.innerHTML = risposta;
        testo.style.opacity = "1";
        ball.classList.remove("shake-ball");
        creaPioggiaDiCuoricini();
    }, 1200);
}

// ==========================================
// SORPRESA ROMANTICA
// ==========================================
const frasiAmore = [
    "Sei il mio posto felice 🩷",
    "Sei perfetta amore 🩷",
    "Il mio sorriso più bello nasce con te 🩷",
    "Hai gli occhietti più belli del mondo 🩷",
    "Con te anche le cose semplici diventano speciali",
    "Ti sceglierei altre mille volte 🩷"
];

function sorpresa() {
    const elemento = document.getElementById("secret");
    if (!elemento) return;

    elemento.innerHTML = frasiAmore[Math.floor(Math.random() * frasiAmore.length)];
    
    elemento.classList.remove("fade-in");
    void elemento.offsetWidth; // Trigger reflow per riavviare l'animazione
    elemento.classList.add("fade-in");
    
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

// ==========================================
// AVVIO APP E CONTROLLI FINALI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Nasconde correttamente le schermate secondarie all'avvio
    const schermate = [
        "galleria-schermo",
        "chat-schermo",
        "bucket-schermo",
        "magic-schermo"
    ];

    schermate.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
        }
    });

    // Aggiorna timer subito
    aggiornaContatore();
    aggiornaMiniCountdown();
});

// ==========================================
// RESET INPUT FOTO
// ==========================================
const inputFoto = document.getElementById("fileInput");
if (inputFoto) {
    inputFoto.addEventListener("change", () => {
        setTimeout(() => {
            inputFoto.value = "";
        }, 500);
    });
}

// ==========================================
// BLOCCO SCROLL QUANDO APRI SCHERMATE
// ==========================================
function bloccaScroll() {
    document.body.style.overflow = "hidden";
}

function abilitaScroll() {
    document.body.style.overflow = "";
}

// sostituisce apertura schermata con versione più fluida
const apriOriginale = window.apriSchermata;
window.apriSchermata = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = "flex";
        bloccaScroll();
    }
};

const chiudiOriginale = window.chiudiSchermata;
window.chiudiSchermata = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = "none";
        abilitaScroll();
    }
};

// ==========================================
// GESTIONE ROTAZIONE SCHERMO
// ==========================================
window.addEventListener("orientationchange", () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 300);
});

// ==========================================
// SERVICE WORKER PWA
// ==========================================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(err => console.log("SW errore", err));
    });
}

// Funzione per aprire la schermata del messaggio
function apriMessaggio() {
    // Chiude prima il menu laterale se è aperto
    document.getElementById('sidebar-menu').classList.remove('aperto');
    document.getElementById('overlay-menu').classList.remove('aperto');
    
    // Mostra la schermata del messaggio
    document.getElementById('messaggio-schermo').style.display = 'flex';
}

// Funzione per chiudere la schermata del messaggio e tornare alla home
function chiudiMessaggio() {
    document.getElementById('messaggio-schermo').style.display = 'none';
}
