// --- SEZIONE TIMER ---
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


// --- SEZIONE SORPRESA (Frasi casuali) ---
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
}


// --- SEZIONE GALLERIA FOTO ---

function scegliFoto() {
    document.getElementById("fileInput").click();
}

function salvaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const fotoDataUrl = e.target.result; 
        
        let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];
        fotoSalvate.push(fotoDataUrl);
        
        try {
            localStorage.setItem("fotoAmore", JSON.stringify(fotoSalvate));
            alert("Foto aggiunta ai nostri ricordi! 🩷");
        } catch (errore) {
            alert("Oops! Memoria del browser piena. Prova a usare foto più leggere.");
        }
    };
    reader.readAsDataURL(file);
}

// --- MODIFICA QUESTA FUNZIONE ESISTENTE ---
function apriGalleria() {
    document.getElementById("galleria-schermo").style.display = "flex";
    const griglia = document.getElementById("griglia-foto");
    griglia.innerHTML = ""; // Pulisci la griglia prima di caricarla

    // Recupera le foto salvate usando la chiave corretta "fotoAmore"
    let fotoSalvate = JSON.parse(localStorage.getItem("fotoAmore")) || [];

    if (fotoSalvate.length === 0) {
        griglia.innerHTML = "<p style='color:white; grid-column: 1/-1; text-align:center;'>Non hai ancora aggiunto foto.</p>";
        return;
    }

    // Crea i quadratini
    fotoSalvate.forEach((dataUrl, index) => {
        const img = document.createElement("img");
        img.src = dataUrl;
        img.alt = "Ricordo di coppia " + (index + 1);
        
        // Evento click per ingrandire la foto con dissolvenza
        img.onclick = function() {
            apriFotoGrande(dataUrl);
        };
        
        griglia.appendChild(img);
    });
}
// --- FUNZIONI AGGIUNTIVE PER GESTIRE L'IMMAGINE SINGOLA ---

// 1. Mostra l'immagine grande con dissolvenza
function apriFotoGrande(url) {
    const visualizzatore = document.getElementById("visualizzatore-singolo");
    const imgGrande = document.getElementById("immagine-grande");
    
    imgGrande.src = url; // Imposta l'immagine
    visualizzatore.classList.add("mostra"); // ♥♥♥ Attiva la classe CSS per la dissolvenza ♥♥♥
}

// 2. Chiudi l'immagine grande con dissolvenza
function chiudiFotoGrande() {
    const visualizzatore = document.getElementById("visualizzatore-singolo");
    visualizzatore.classList.remove("mostra"); // ♥♥♥ Rimuove la classe per nasconderla ♥♥♥
}

// Modifica la funzione chiudiGalleria per assicurarsi che il visualizzatore sia chiuso
function chiudiGalleria() {
    document.getElementById("galleria-schermo").style.display = "none";
    chiudiFotoGrande(); // Chiudi anche l'eventuale foto ingrandita
}

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

    // Calcola solo i giorni totali rimasti
    const giorni = Math.ceil(differenza / (1000 * 60 * 60 * 24));

    document.getElementById("giorni-mancanti").innerHTML = giorni;
}

// Aggiorna all'avvio
aggiornaMiniCountdown();
