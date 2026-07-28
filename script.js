// --- SEZIONE SCHERMATA DI BLOCCO ---
const codiceSegreto = "080526"; // La vostra data 08/05/26
let codiceInserito = "";

// Se l'app è già stata sbloccata non chiediamo il codice ad ogni refresh della pagina
if (sessionStorage.getItem("appSbloccata") === "vero") {
    document.getElementById("lock-screen").style.display = "none";
}

function premiTasto(numero) {
    if (codiceInserito.length < 6) {
        codiceInserito += numero;
        aggiornaPallini();

        if (codiceInserito.length === 6) {
            // Aspetta un istante per far vedere l'ultimo pallino colorato, poi controlla
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
        // Codice corretto! Effetto dissolvenza
        const lockScreen = document.getElementById("lock-screen");
        lockScreen.style.opacity = "0";
        sessionStorage.setItem("appSbloccata", "vero"); // Memorizza lo sblocco per la sessione attuale
        
        setTimeout(() => {
            lockScreen.style.display = "none";
        }, 500);
    } else {
        // Codice errato: tremano i pallini (stile iPhone)
        const contenitorePallini = document.querySelector(".dots-container");
        contenitorePallini.classList.add("errore-shake");
        
        // Dopo l'animazione, svuota il codice
        setTimeout(() => {
            contenitorePallini.classList.remove("errore-shake");
            codiceInserito = "";
            aggiornaPallini();
        }, 400);
    }
}


const inizio = new Date("2026-05-08T00:00:00");

function aggiornaContatore() {
    const oggi = new Date();
    const differenza = oggi - inizio;

    const giorni = Math.floor(differenza / (1000 * 60 * 60 * 24));
    const ore = Math.floor((differenza / (1000 * 60 * 60)) % 24);
    const minuti = Math.floor((differenza / (1000 * 60)) % 60);
    const secondi = Math.floor((differenza / 1000) % 60);

    document.getElementById("counter").innerHTML =
    `${giorni} giorni, ${ore} ore, ${minuti} minuti e ${secondi} secondi 🩷`;
}

setInterval(aggiornaContatore, 1000);
aggiornaContatore();


// --- SEZIONE SORPRESA (Frasi e Cuoricini) ---
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

    // Lancia l'animazione dei cuoricini!
    creaPioggiaDiCuoricini();
}

function creaPioggiaDiCuoricini() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const cuore = document.createElement("div");
            cuore.innerHTML = "🩷";
            cuore.className = "cuoricino-volante";
            cuore.style.left = Math.random() * 100 + "vw"; // Posizione orizzontale casuale
            cuore.style.fontSize = (Math.random() * 20 + 15) + "px"; // Grandezza casuale
            document.body.appendChild(cuore);

            // Rimuove il cuoricino dopo che l'animazione è finita per non appesantire l'app
            setTimeout(() => {
                cuore.remove();
            }, 3000);
        }, i * 100); // Li fa apparire uno alla volta sfalsati
    }
}


// --- SEZIONE COMPRESSIONE E SALVATAGGIO FOTO ---
function scegliFoto() {
    document.getElementById("fileInput").click();
}

function salvaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        // Creiamo un'immagine temporanea in memoria
        const img = new Image();
        img.onload = function() {
            // Creiamo un "foglio da disegno" virtuale (canvas) per rimpicciolire la foto
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800; // Larghezza massima ottimizzata per smartphone
            let width = img.width;
            let height = img.height;

            // Calcoliamo le nuove proporzioni
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Trasformiamo l'immagine compressa in testo (qualità JPEG all'80%)
            const fotoCompressaDataUrl = canvas.toDataURL("image/jpeg", 0.8);

            // Salviamo la foto super-leggera
            let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
            fotoSalvate.push(fotoCompressaDataUrl);
            
            try {
                localStorage.setItem("fotoAmore", JSON.stringify(fotoSalvate));
                alert("Foto aggiunta ai nostri ricordi! 🩷");
            } catch (errore) {
                alert("Oops! La memoria del browser è ancora piena.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// --- SEZIONE GALLERIA FOTO E SCORRIMENTO ---
let indiceFotoCorrente = null;

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

// --- VISUALIZZATORE CON SCORRIMENTO FRECCE ---
function apriFotoGrande(index) {
    indiceFotoCorrente = index; 
    aggiornaImmagineGrande();
    document.getElementById("visualizzatore-singolo").classList.add("mostra");
}

function aggiornaImmagineGrande() {
    let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
    if (fotoSalvate.length === 0) return;

    // Se andiamo oltre l'ultima foto, torniamo alla prima (e viceversa)
    if (indiceFotoCorrente < 0) {
        indiceFotoCorrente = fotoSalvate.length - 1;
    } else if (indiceFotoCorrente >= fotoSalvate.length) {
        indiceFotoCorrente = 0;
    }

    const imgGrande = document.getElementById("immagine-grande");
    imgGrande.src = fotoSalvate[indiceFotoCorrente];
}

function cambiaFoto(direzione) {
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

// --- GESTIONE DELLO SWIPE (Scorrimento col dito) ---
let touchStartX = 0;
let touchEndX = 0;

const visualizzatore = document.getElementById("visualizzatore-singolo");

visualizzatore.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

visualizzatore.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    gestisciSwipe();
});

function gestisciSwipe() {
    const sogliaDiScorrimento = 50; // Quanti pixel devi trascinare il dito
    if (touchEndX < touchStartX - sogliaDiScorrimento) {
        cambiaFoto(1); // Swipe verso sinistra -> foto successiva
    }
    if (touchEndX > touchStartX + sogliaDiScorrimento) {
        cambiaFoto(-1); // Swipe verso destra -> foto precedente
    }
}

// --- ELIMINAZIONE ---
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

// --- MINI COUNTDOWN ---
function aggiornaMiniCountdown() {
    const giornoAnniversario = 8;
    const meseAnniversario = 4; // Maggio (0=Gennaio, 4=Maggio)

    const oraCorrente = new Date();
    let annoCorrente = oraCorrente.getFullYear();

    let prossimoAnniversario = new Date(annoCorrente, meseAnniversario, giornoAnniversario);

    if (oraCorrente > prossimoAnniversario) {
        prossimoAnniversario.setFullYear(annoCorrente + 1);
    }

    const differenza = prossimoAnniversario - oraCorrente;

    if (differenza <= 0) {
        document.getElementById("giorni-mancanti").innerHTML = "Oggi! 🎉";
        return;
    }

    const giorni = Math.ceil(differenza / (1000 * 60 * 60 * 24));
    document.getElementById("giorni-mancanti").innerHTML = giorni;
}

aggiornaMiniCountdown();
