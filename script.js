// =========================================
// FIREBASE CONFIGURAZIONE
// =========================================

const firebaseConfig = {

    apiKey: "AIzaSyDdhoHC6hhXl8rshWvxbTWT8hMkoa82pl4",

    authDomain: "amoremio-43a39.firebaseapp.com",

    databaseURL:
    "https://amoremio-43a39-default-rtdb.europe-west1.firebasedatabase.app",

    projectId:"amoremio-43a39",

    storageBucket:
    "amoremio-43a39.firebasestorage.app",

    messagingSenderId:"948222176917",

    appId:
    "1:948222176917:web:881c34a38da68ffc9d759c"

};


firebase.initializeApp(firebaseConfig);


const database = firebase.database();




// Cambia questo nell'altro telefono
let mioID="io";






// =========================================
// SISTEMA APERTURA SCHERMATE
// =========================================


function apriSchermata(id){

    const pagina=document.getElementById(id);

    if(!pagina)return;


    pagina.style.display="flex";


    document.body.classList.add(
        "blocca-scroll"
    );

}




function chiudiSchermata(id){

    const pagina=document.getElementById(id);

    if(!pagina)return;


    pagina.style.display="none";


    document.body.classList.remove(
        "blocca-scroll"
    );

}








// =========================================
// LOCK SCREEN
// =========================================


const codiceSegreto="080526";


let codiceInserito="";




function premiTasto(numero){


    if(codiceInserito.length>=6)
        return;



    codiceInserito+=numero;


    aggiornaPallini();



    if(codiceInserito.length===6){


        setTimeout(
            controllaCodice,
            250
        );


    }

}





function cancellaTasto(){


    codiceInserito=
    codiceInserito.slice(0,-1);


    aggiornaPallini();


}






function aggiornaPallini(){


    document
    .querySelectorAll(".dot")
    .forEach((dot,index)=>{


        dot.classList.toggle(

            "pieno",

            index < codiceInserito.length

        );


    });


}






function controllaCodice(){



    const lock=
    document.getElementById(
        "lock-screen"
    );




    if(codiceInserito===codiceSegreto){


        lock.style.opacity="0";



        setTimeout(()=>{


            lock.style.display="none";


            lock.style.opacity="1";


        },500);



    }


    else{


        const dots=
        document.querySelector(
            ".dots-container"
        );



        dots.classList.add(
            "errore-shake"
        );



        setTimeout(()=>{


            dots.classList.remove(
                "errore-shake"
            );


            codiceInserito="";


            aggiornaPallini();



        },500);



    }


}

/* =========================================
   COUNTDOWN RELAZIONE
========================================= */


const inizioRelazione =
new Date("2026-05-08T00:00:00");



function aggiornaContatore(){


    const ora=new Date();


    const differenza =
    ora - inizioRelazione;



    if(differenza < 0)
        return;



    const giorni =
    Math.floor(
        differenza /
        (1000*60*60*24)
    );



    const ore =
    Math.floor(
        (differenza /
        (1000*60*60)) % 24
    );



    const minuti =
    Math.floor(
        (differenza /
        (1000*60)) % 60
    );



    const secondi =
    Math.floor(
        (differenza /
        1000) % 60
    );



    const elemento =
    document.getElementById(
        "counter"
    );


    if(elemento){


        elemento.innerHTML =

        `${giorni} giorni, 
        ${ore} ore,
        ${minuti} minuti
        e ${secondi} secondi 🩷`;

    }

}



setInterval(
    aggiornaContatore,
    1000
);


aggiornaContatore();








/* =========================================
   MINI COUNTDOWN ANNIVERSARIO
========================================= */


function aggiornaMiniCountdown(){


    const oggi=new Date();



    const anniversario =
    new Date(
        oggi.getFullYear(),
        4,
        8
    );



    if(oggi > anniversario){


        anniversario.setFullYear(
            oggi.getFullYear()+1
        );

    }



    const differenza =
    anniversario - oggi;



    const giorni =
    Math.ceil(
        differenza /
        (1000*60*60*24)
    );



    const elemento =
    document.getElementById(
        "giorni-mancanti"
    );



    if(elemento){


        elemento.textContent =
        giorni;


    }

}


aggiornaMiniCountdown();










/* =========================================
   MENU LATERALE
========================================= */


function apriMenu(){


    document
    .getElementById(
        "sidebar-menu"
    )
    .classList.add(
        "aperto"
    );



    document
    .getElementById(
        "overlay-menu"
    )
    .classList.add(
        "aperto"
    );

}





function chiudiMenu(){


    document
    .getElementById(
        "sidebar-menu"
    )
    .classList.remove(
        "aperto"
    );



    document
    .getElementById(
        "overlay-menu"
    )
    .classList.remove(
        "aperto"
    );


}










/* =========================================
   CHAT
========================================= */


let chatCaricata=false;




function apriChat(){


    apriSchermata(
        "chat-schermo"
    );


    if(!chatCaricata){


        caricaMessaggi();


        chatCaricata=true;


    }


}






function chiudiChat(){


    chiudiSchermata(
        "chat-schermo"
    );


}









/* =========================================
   BUCKET LIST
========================================= */


let bucketCaricato=false;




function apriBucketList(){


    apriSchermata(
        "bucket-schermo"
    );



    if(!bucketCaricato){


        caricaBucketList();


        bucketCaricato=true;


    }

}





function chiudiBucketList(){


    chiudiSchermata(
        "bucket-schermo"
    );


}









/* =========================================
   MAGIC BALL
========================================= */


function apriMagicBall(){


    apriSchermata(
        "magic-schermo"
    );


}




function chiudiMagicBall(){


    chiudiSchermata(
        "magic-schermo"
    );


}








/* =========================================
   MENU COLLEGAMENTI
========================================= */


function apriChatDalMenu(){


    chiudiMenu();


    setTimeout(
        apriChat,
        300
    );

}





function apriMagicBallDalMenu(){


    chiudiMenu();


    setTimeout(
        apriMagicBall,
        300
    );


}

/* =========================================
   CHAT FIREBASE TEMPO REALE
========================================= */


function inviaMessaggio(){


    const input =
    document.getElementById(
        "input-messaggio"
    );


    const testo =
    input.value.trim();



    if(testo==="")
        return;




    const messaggio={


        mittente:mioID,


        testo:testo,


        timestamp:
        new Date()
        .toLocaleTimeString(
            [],
            {
                hour:"2-digit",
                minute:"2-digit"
            }
        )


    };



    database
    .ref("chat_coppia")
    .push(messaggio);



    input.value="";



}







function gestisciInvioInvio(event){


    if(event.key==="Enter"){


        event.preventDefault();


        inviaMessaggio();


    }


}








function caricaMessaggi(){


    const lista =
    document.getElementById(
        "lista-messaggi"
    );



    database
    .ref("chat_coppia")
    .on(
        "value",
        snapshot=>{


            lista.innerHTML="";



            const dati =
            snapshot.val();



            if(!dati)
                return;



            Object.values(dati)
            .forEach(msg=>{


                const div =
                document.createElement(
                    "div"
                );



                div.className =
                "messaggio " +
                (
                    msg.mittente===mioID
                    ?
                    "inviato"
                    :
                    "ricevuto"
                );



                div.innerHTML=`

                    <div>
                        ${msg.testo}
                    </div>

                    <div class="ora-messaggio">
                        ${msg.timestamp}
                    </div>

                `;



                lista.appendChild(div);



            });



            lista.scrollTop =
            lista.scrollHeight;



        }
    );


}









/* =========================================
   BUCKET LIST FIREBASE
========================================= */



function aggiungiBucketItem(){


    const input =
    document.getElementById(
        "input-bucket"
    );



    const testo =
    input.value.trim();



    if(testo==="")
        return;




    database
    .ref("bucket_list")
    .push({

        testo:testo,

        completato:false

    });



    input.value="";


}







function gestisciInvioBucket(event){


    if(event.key==="Enter"){


        event.preventDefault();


        aggiungiBucketItem();


    }


}









function caricaBucketList(){


    const lista =
    document.getElementById(
        "lista-bucket"
    );



    database
    .ref("bucket_list")
    .on(
        "value",
        snapshot=>{


            lista.innerHTML="";



            const dati =
            snapshot.val();




            if(!dati){


                lista.innerHTML=

                `

                <p style="
                text-align:center;
                color:#777;
                ">
                Nessun sogno aggiunto ancora 🩷
                </p>

                `;


                return;


            }






            Object.entries(dati)
            .forEach(
            ([id,item])=>{



                const div =
                document.createElement(
                    "div"
                );



                div.className =
                "bucket-item " +
                (
                    item.completato
                    ?
                    "completato"
                    :
                    ""
                );



                div.innerHTML=`

                <div 
                class="bucket-info"
                onclick="
                toggleBucketItem(
                '${id}',
                ${item.completato}
                )">

                    <input 
                    type="checkbox"
                    ${item.completato
                    ?
                    "checked"
                    :
                    ""}
                    >

                    <span>
                    ${item.testo}
                    </span>


                </div>



                <button
                class="bucket-elimina"
                onclick="
                eliminaBucketItem(
                '${id}'
                )">

                🗑️

                </button>

                `;



                lista.appendChild(div);



            });



        }

    );


}









function toggleBucketItem(id,stato){


    database
    .ref(
        "bucket_list/"+id
    )
    .update({

        completato:
        !stato

    });


}








function eliminaBucketItem(id){


    database
    .ref(
        "bucket_list/"+id
    )
    .remove();


}

/* =========================================
   GALLERIA RICORDI
========================================= */


let indiceFotoCorrente = null;





function scegliFoto(){


    document
    .getElementById(
        "fileInput"
    )
    .click();


}








function salvaFoto(event){


    const file =
    event.target.files[0];



    if(!file)
        return;




    const reader =
    new FileReader();



    reader.onload=function(e){



        const img =
        new Image();



        img.onload=function(){



            const canvas =
            document.createElement(
                "canvas"
            );



            const maxWidth=900;



            let width =
            img.width;



            let height =
            img.height;





            if(width>maxWidth){


                height =
                height *
                maxWidth /
                width;


                width=maxWidth;


            }



            canvas.width=width;

            canvas.height=height;



            const ctx =
            canvas.getContext(
                "2d"
            );



            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );



            const foto =
            canvas.toDataURL(
                "image/jpeg",
                0.8
            );




            let salvate =
            JSON.parse(
                localStorage
                .getItem(
                    "fotoAmore"
                )
            ) || [];




            salvate.push(foto);




            try{


                localStorage.setItem(
                    "fotoAmore",
                    JSON.stringify(
                        salvate
                    )
                );



                alert(
                    "Foto aggiunta ai nostri ricordi 🩷"
                );



            }
            catch(err){


                alert(
                    "Memoria piena 😢"
                );


            }


        };



        img.src=e.target.result;


    };



    reader.readAsDataURL(file);



    event.target.value="";


}









function apriGalleria(){



    apriSchermata(
        "galleria-schermo"
    );



    const griglia =
    document.getElementById(
        "griglia-foto"
    );



    griglia.innerHTML="";



    const foto =
    JSON.parse(
        localStorage
        .getItem(
            "fotoAmore"
        )
    ) || [];





    if(foto.length===0){


        griglia.innerHTML=`

        <p style="
        grid-column:1/-1;
        text-align:center;
        padding:30px;
        color:#777;
        ">
        Nessuna foto ancora 🩷
        </p>

        `;


        return;


    }





    foto.forEach(
    (immagine,index)=>{


        const img =
        document.createElement(
            "img"
        );



        img.src=immagine;



        img.onclick=()=>{


            apriFotoGrande(
                index
            );


        };



        griglia.appendChild(img);


    });


}









function apriFotoGrande(index){


    indiceFotoCorrente=index;



    aggiornaImmagineGrande();



    document
    .getElementById(
        "visualizzatore-singolo"
    )
    .classList
    .add(
        "mostra"
    );


}









function aggiornaImmagineGrande(){



    const foto =
    JSON.parse(
        localStorage
        .getItem(
            "fotoAmore"
        )
    ) || [];



    if(foto.length===0)
        return;



    if(indiceFotoCorrente<0)


        indiceFotoCorrente =
        foto.length-1;




    if(indiceFotoCorrente>=foto.length)


        indiceFotoCorrente=0;





    document
    .getElementById(
        "immagine-grande"
    )
    .src =
    foto[indiceFotoCorrente];



}









function cambiaFoto(direzione){



    const foto =
    JSON.parse(
        localStorage
        .getItem(
            "fotoAmore"
        )
    ) || [];



    if(foto.length<=1)
        return;



    indiceFotoCorrente += direzione;



    aggiornaImmagineGrande();


}









function chiudiFotoGrande(){


    document
    .getElementById(
        "visualizzatore-singolo"
    )
    .classList
    .remove(
        "mostra"
    );



    indiceFotoCorrente=null;


}








function chiudiGalleria(){



    chiudiSchermata(
        "galleria-schermo"
    );



    chiudiFotoGrande();



}








function chiediConfermaEliminazione(){



    if(indiceFotoCorrente===null)
        return;



    if(!confirm(
        "Eliminare questa foto? 🥺"
    ))
        return;




    let foto =
    JSON.parse(
        localStorage
        .getItem(
            "fotoAmore"
        )
    ) || [];



    foto.splice(
        indiceFotoCorrente,
        1
    );



    localStorage.setItem(
        "fotoAmore",
        JSON.stringify(
            foto
        )
    );



    chiudiFotoGrande();


    apriGalleria();



}









/* =========================================
   SWIPE FOTO MOBILE
========================================= */


let touchStartX=0;


let touchEndX=0;




const viewer =
document.getElementById(
    "visualizzatore-singolo"
);



if(viewer){


    viewer.addEventListener(
        "touchstart",
        e=>{


            touchStartX =
            e.changedTouches[0]
            .screenX;


        }
    );




    viewer.addEventListener(
        "touchend",
        e=>{


            touchEndX =
            e.changedTouches[0]
            .screenX;




            if(
                touchEndX <
                touchStartX-50
            ){


                cambiaFoto(1);


            }




            if(
                touchEndX >
                touchStartX+50
            ){


                cambiaFoto(-1);


            }


        }
    );


}









/* =========================================
   CUORICINI VOLANTI
========================================= */


function creaPioggiaDiCuoricini(){



    for(
        let i=0;
        i<25;
        i++
    ){


        setTimeout(()=>{



            const cuore =
            document.createElement(
                "div"
            );



            cuore.innerHTML="🩷";



            cuore.className =
            "cuoricino-volante";



            cuore.style.left =
            Math.random()*100+"vw";



            cuore.style.fontSize =
            (
                Math.random()*20+15
            )
            +"px";



            document
            .body
            .appendChild(
                cuore
            );



            setTimeout(
                ()=>{
                    cuore.remove();
                },
                3000
            );



        },i*100);



    }


}

/* =========================================
   SORPRESA AMORE
========================================= */


const frasiAmore = [

"Sei il mio primo pensiero al mattino e l'ultimo prima di dormire 🩷",

"Ogni momento con te è il mio momento preferito 🩷",

"Sei la mia casa anche quando siamo lontani 🩷",

"Con te anche le giornate normali diventano speciali ✨",

"Il mio posto preferito è sempre vicino a te 🩷",

"Ti sceglierei oggi, domani e in ogni vita possibile 🩷",

"Il tuo sorriso è la mia cosa preferita al mondo 🩷",

"Grazie per rendere la mia vita più bella ogni giorno 🩷",

"Non ho bisogno di altro quando ho te accanto 🩷",

"Sei il mio piccolo miracolo quotidiano 🩷"

];




function sorpresa(){


    const box =
    document.getElementById(
        "secret"
    );


    const frase =
    frasiAmore[
        Math.floor(
            Math.random()
            *
            frasiAmore.length
        )
    ];



    box.innerHTML=frase;



    box.classList.remove(
        "fade-in"
    );


    void box.offsetWidth;


    box.classList.add(
        "fade-in"
    );


    creaPioggiaDiCuoricini();



}








/* =========================================
   MENU LATERALE
========================================= */


function apriMenu(){


    document
    .getElementById(
        "sidebar-menu"
    )
    .classList
    .add(
        "aperto"
    );


    document
    .getElementById(
        "overlay-menu"
    )
    .classList
    .add(
        "aperto"
    );

}



function chiudiMenu(){


    document
    .getElementById(
        "sidebar-menu"
    )
    .classList
    .remove(
        "aperto"
    );


    document
    .getElementById(
        "overlay-menu"
    )
    .classList
    .remove(
        "aperto"
    );

}





/* =========================================
   CHAT
========================================= */


function apriChatDalMenu(){


    chiudiMenu();


    setTimeout(()=>{


        apriChat();


    },300);


}





function apriChat(){


    apriSchermata(
        "chat-schermo"
    );


    caricaMessaggi();


}





function chiudiChat(){


    chiudiSchermata(
        "chat-schermo"
    );


}







function inviaMessaggio(){



    const input =
    document.getElementById(
        "input-messaggio"
    );


    const testo =
    input.value.trim();



    if(!testo)
        return;



    database
    .ref(
        "chat_coppia"
    )
    .push({

        mittente:mioID,

        testo:testo,

        timestamp:
        new Date()
        .toLocaleTimeString(
            [],
            {
                hour:"2-digit",
                minute:"2-digit"
            }
        )

    });



    input.value="";



}





function gestisciInvioInvio(e){


    if(e.key==="Enter")
        inviaMessaggio();


}






function caricaMessaggi(){



    const lista =
    document.getElementById(
        "lista-messaggi"
    );



    database
    .ref(
        "chat_coppia"
    )
    .on(
        "value",
        snapshot=>{


            lista.innerHTML="";



            const dati =
            snapshot.val();



            if(!dati)
                return;




            Object.values(dati)
            .forEach(
            msg=>{


                const div =
                document.createElement(
                    "div"
                );



                div.className =
                "messaggio " +
                (
                msg.mittente===mioID
                ?
                "inviato"
                :
                "ricevuto"
                );



                div.innerHTML=`

                <div>
                ${msg.testo}
                </div>

                <small>
                ${msg.timestamp}
                </small>

                `;



                lista.appendChild(div);


            });



            lista.scrollTop =
            lista.scrollHeight;


        }
    );


}









/* =========================================
   BUCKET LIST
========================================= */


function apriBucketList(){


    apriSchermata(
        "bucket-schermo"
    );


    caricaBucketList();


}



function chiudiBucketList(){


    chiudiSchermata(
        "bucket-schermo"
    );


}






function aggiungiBucketItem(){


    const input =
    document.getElementById(
        "input-bucket"
    );


    const testo =
    input.value.trim();



    if(!testo)
        return;




    database
    .ref(
        "bucket_list"
    )
    .push({

        testo:testo,

        completato:false

    });



    input.value="";


}





function gestisciInvioBucket(e){


    if(e.key==="Enter")
        aggiungiBucketItem();


}







function caricaBucketList(){



    const lista =
    document.getElementById(
        "lista-bucket"
    );



    database
    .ref(
        "bucket_list"
    )
    .on(
        "value",
        snap=>{


            lista.innerHTML="";



            const dati =
            snap.val();



            if(!dati)
                return;



            Object.entries(dati)
            .forEach(
            ([id,item])=>{


                const div =
                document.createElement(
                    "div"
                );



                div.className =
                "bucket-item";



                div.innerHTML=`

                <span>
                <input type="checkbox"
                ${item.completato?"checked":""}
                onclick="toggleBucketItem('${id}',${item.completato})">

                ${item.testo}

                </span>


                <button onclick="eliminaBucketItem('${id}')">
                🗑️
                </button>

                `;



                lista.appendChild(div);



            });


        }
    );


}




function toggleBucketItem(id,stato){


    database
    .ref(
        "bucket_list/"+id
    )
    .update({

        completato:!stato

    });


}





function eliminaBucketItem(id){


    database
    .ref(
        "bucket_list/"+id
    )
    .remove();


}









/* =========================================
   MAGIC BALL
========================================= */


const risposteSfera=[

"Certamente sì 🩷",

"Assolutamente no 😂",

"Le stelle dicono sì ✨",

"Probabilmente sì",

"Riprova più tardi 🔮",

"Il destino sorride a voi due 🩷",

"Sì, ma solo con il gelato 🍦",

"Non ne sono sicuro 🤔"

];






function apriMagicBallDalMenu(){


    chiudiMenu();


    setTimeout(()=>{


        apriMagicBall();


    },300);


}





function apriMagicBall(){


    apriSchermata(
        "magic-schermo"
    );


}





function chiudiMagicBall(){


    chiudiSchermata(
        "magic-schermo"
    );


}





function chiediAllaSfera(){



    const testo =
    document.getElementById(
        "magic-text"
    );



    const ball =
    document.getElementById(
        "magic-ball"
    );



    ball.classList.add(
        "shake-ball"
    );



    testo.style.opacity=0;



    setTimeout(()=>{


        testo.innerHTML =
        risposteSfera[
            Math.floor(
                Math.random()
                *
                risposteSfera.length
            )
        ];



        testo.style.opacity=1;



        ball.classList.remove(
            "shake-ball"
        );



        creaPioggiaDiCuoricini();



    },1000);



}









/* =========================================
   FUNZIONI SCHERMATE
========================================= */


function apriSchermata(id){


    const el =
    document.getElementById(id);



    if(el)
        el.style.display="flex";


}





function chiudiSchermata(id){


    const el =
    document.getElementById(id);



    if(el)
        el.style.display="none";


}







/* =========================================
   AVVIO APP
========================================= */


window.addEventListener(
"load",
()=>{


    aggiornaContatore();

    aggiornaMiniCountdown();


});

