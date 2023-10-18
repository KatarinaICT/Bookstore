//ajaxCallBack
function ajaxCallBack(url, result){
    $.ajax({
        url: url, 
        method: "get",
        dataType: "json",
        success: result,
        error: function(xhr){
            console.log(xhr);
        }
    });
}
const BASEURL = "assets/data/";
$(document).ready(function(){

    // DOHVATANJE URL-A TRENUTNE STRANICE
    var url = window.location.href;
    const linkN = url.split("/");
    var link = linkN[5];
    const urlId = url.split("=");
    var knjiga = urlId[1];

    // DOHVATANJE I PROSLEDJIVANJE PODATAKA IZ JSON FAJLA
    ajaxCallBack(BASEURL + "meni.json", function(result){
        ispisNavigacije(result);
    });    
    ajaxCallBack(BASEURL + "knjige.json", function(result){
        preporuka(result);
        datum(result);
        ispisKnjiga(result, "sveKnjige");
        sacuvajULS("knjige", result);
        detaljiKnjiga(result, knjiga);
        // sadrzajKorpe(result);
    })
    ajaxCallBack(BASEURL + "pisci.json", function(result){
        sacuvajULS("sviPisci", result);
    })
    ajaxCallBack(BASEURL + "zanrovi.json", function(result){
        ispisZanrova(result);
        sacuvajULS("zanrovi", result);
    })

    // FUNKCIJA ZA ISPIS NAVIGACIJE
    function ispisNavigacije(data){
        let html = "";
        let klasa;
        for(d of data){
            if(link == d.url){
                klasa = "active";
            }
            else{
                klasa = "";
            }
            html += `<li class="nav-item col-3 text-center">
            <a class="nav-link ${klasa}" id="${d.nazivStranice}" href="${d.url}">${d.nazivStranice}</a>
          </li>`;
          console.log(klasa);
        }
        $(".navUl").html(html);
    }

    // FUNKCIJA ZA ISPIS ZANROVA
    function ispisZanrova(data){
        let html = "";
        for(d of data){
            // html+=`<p class='border-bottom'>${d.kategorija}`;
            html+=`<button type="button" class="btn btn-light border-bottom col-12 mb-3 filterZanr" data-id="${d.id}">${d.kategorija}</button></br>`;
        }
        $(".zanrovi").html(html);
    }

    // FUNKCIJA ZA ISPIS KNJIGA
    function ispisKnjiga(data, div){
        let html="";
            for(d of data){
                html += `<div class="col-6 col-md-3 mt-3 text-center knjiga">
                <img class="mx-auto" src="assets/img/${d.slika}2.jpg" alt="${d.naslov}">
                <h4 class="text-center">${d.naslov}</h4>
                <h5>${pisacDelo(d.id_autor, "sviPisci")}</h5>
                    <div class="hoverKnjiga">
                        <div class="container-fluid">
                            <div class="row align-items-center d-flex justify-content-center mb-3">
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary dodaj-u-korpu" data-id=${d.id}>
                                        <i class='fas fa-shopping-basket'></i>
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button type="button" class="btn btn-secondary dodaj-listu" data-id="${d.id}">
                                        <i class='fas fa-heart'></i>
                                    </button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <a class="btn btn-secondary pogledaj" href="jednaKnjiga.html?id=${d.id}">Pogledaj vise</a>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>`;
            }
        $('#'+ div).html(html);
    }
    
    // FUNKCIJA ZA POVEZIVANJE PISCA SA DELOM
    function pisacDelo(id, naziv){
        let pisac = "";
        let nizLS = dohvatiLS(naziv);
        for(let n of nizLS){
            if(id == n.id){
                pisac = n.ime + ' ' + n.prezime;
                break;
            }
        }
        return pisac;
    }

    // FUNKCIJA ZA DOHVATANJE POSLEDNJE DODATIH KNJIGA
    function datum(data){
        var novo = data.sort(function(a, b){
            let vreme1 = a.datumIzdanja.split(" ");
            let vreme2 = b.datumIzdanja.split(" ");
            return vreme2[2] - vreme1[2];
        })
        var knjige= [];
        var i=1;
        for(n of novo){
            if(i<5){
                knjige.push(n);
            }
            i++;
        }
        ispisKnjiga(knjige, "novo");
    }

    //FUNKCIJA ZA DOHVATANJE 4 RAND KNJIGE 
    function preporuka(data){
        let knjige=[];
        for(let i=1; i<5; i++){
            let randId = Math.floor(Math.random() * 8 + 1);
            for(d of data){
                if(randId == d.id){
                    knjige.push(d);
                }
            }
        }
        ispisKnjiga(knjige, "preporuceno");
    }

    // FUNKCIJA ZA CUVANJE PODATAKA U LS
    function sacuvajULS(naziv, vrednost){
        localStorage.setItem(naziv, JSON.stringify(vrednost));
    }

    // FUNKCIJA ZA DOHVATANJE PODATAKA IZ LS
    function dohvatiLS(naziv){
        return JSON.parse(localStorage.getItem(naziv));
    }

    // FUNKCIJA ZA PRIKAZ DETALJA O KNJIZI
    function detaljiKnjiga(data, id){
        let html="";
        let opis='';
        let maliOpis= '';
        let cena='';
        for(d of data){
            if(d.id == id){
                html+=` <img class="mb-3 slikaDetalj" src="assets/img/${d.slika}.jpg" alt="${d.naslov}">
                <p><span>Broj strana: </span>${d.brStrana}</p>
                <p><span>Pismo:</span> ${d.cirilica?"Ćirilica":"Latinica"}</p>
                <p><span>Povez: </span>${d.tvrdPovez?"Tvrd":"Mek"}</p>
                <p><span>Izdato: </span>${d.datumIzdanja}</p>`;
                opis+=`<div class="naslov border-bottom mb-5">
                    <h1>${d.naslov}</h1>
                    <h3>Zanrovi:</h3>
                    <p>${zanrKnjiga(d.zanr, "zanrovi")}</p>
                </div>
                <div id="opisVeliki">
                    <h2>Opis</h2>
                    <p>${d.opis}</p>
                </div>`;
                maliOpis+=`<div id="msliOpis">
                <h2 class="mb-2 border-bottom">Opis</h2>
                <p>${d.opis}</p>
                </div`;
                cena += `<div class="row">
                    <div class="col-11 border mx-auto ms-md-2">
                        <h4 class="border-bottom">Cena: </h4>
                        <p>Cena: <span>${d.cena.nova} din</span> <s> ${d.cena.stara}</s></p>
                        <p class="border-bottom">Ušteda: <span>${d.cena.stara - d.cena.nova} din</span></p>
                        <input type="button" value="Dodaj u korpu" class="btn btn-dark col-12 dodaj-u-korpu" data-id=${d.id}>
                        <input type="button" value="Dodaj na listu želja" class="btn btn-danger mt-3 col-12 mb-3 dodaj-listu" data-id="${d.id}">
                    </div>
                </div>`;
            }
        }
        $("#slika").html(html);
        $("#opis").html(opis);
        $("#cena").html(cena);
        $("#maliOpis").html(maliOpis);
    }

    // FUNKCIJA ZA ISPIS SVIH ZANROVA JEDNE KNJIGE
    function zanrKnjiga(id, naziv){
        let ispis='';
        let niz=[];
        let nizZanrovi = dohvatiLS(naziv);
        for(i of id){
            for(n of nizZanrovi){
                if(n.id == i){
                    niz.push(n.kategorija);
                }
            }
        }
        niz.forEach((element, i) => {
            i==0? ispis += element : ispis += " / " + element;
        });
        return ispis;
    }

    // FILTRIRANJE, SORTIRANJE, SEARCH

    $(document).on("click", ".filterZanr", promena);
    $(document).on("change", "#ddlSort", promena);
    
    // DOHVATANJE PARAMETARA ZA SORT I FILTER
    function promena(){
        
        let knjige = dohvatiLS("knjige");
        let id = $(this).attr("data-id");
        if(id == undefined){
            id = dohvatiLS("zanrFilter");
        }
        if(id == null){
            id = "";
        }
        sacuvajULS("zanrFilter", id);
        
        console.log(id);
        
        var izbor = $("#ddlSort").val();
        if(izbor == undefined){
            izbor = 0;
        }
        sacuvajULS("sort", izbor);
        knjige = filter(knjige);
        knjige = sortiranje(knjige);
        ispisKnjiga(knjige, "sveKnjige");

    }
    // FUNKCIJA ZA SORTIRANJE PO PROSLEDJENIM PARAMETRIMA
    function sortiranje(knjige){
        var sortiraneKnjige = [];
        var izbor = dohvatiLS("sort");
        
        if(izbor == "0"){
            sortiraneKnjige = knjige;
        }
        else{
            sortiraneKnjige = knjige.sort(function(a, b){
                if(izbor == "cena-asc"){
                    return a.cena.nova - b.cena.nova;
                }
                if(izbor == "cena-desc"){
                    return b.cena.nova - a.cena.nova;
                }
                if(izbor == "naziv-asc"){
                    if(a.naslov < b.naslov){
                        return -1;
                    }
                    else if(a.naziv > b.naziv){
                        return 1;
                    }
                    else{
                        return 0;
                    }
                }
                if(izbor == "naziv-desc"){
                    if(a.naziv > b.naziv){
                        return -1;
                    }
                    else if(a.naziv < b.naziv){
                        return 1;
                    }
                    else{
                        return 0;
                    }
                }
            })
        }
        return sortiraneKnjige;
    }   
    // FUNKCIJA ZA FILTER PO PROSLEDJENOM ZANRU
    function filter(knjige){
        let filterKnjige=[];
        let id = dohvatiLS("zanrFilter");
        if(id == 0){
          filterKnjige = knjige;
        }
        for(k of knjige){
            var zanrovi = k.zanr;
            for(z of zanrovi){
                if(z == id){
                    filterKnjige.push(k);
                }
            }
        }
        return filterKnjige;
    }
    // FUNKCIJA ZA PONISTAVANJE FILTERA NAKON PONOVNOG UCITAVANJA STRANICE
    if(window.location.reload){
        localStorage.removeItem("zanrFilter");
    }
    // FUNKCIJA ZA PRETRAGU KNJIGA
    $("#search").on("keyup", function(){
            var vrednost = $(this).val().toLowerCase();
            $(".knjiga").filter(function(){
                $(this).toggle($(this).text().toLowerCase().indexOf(vrednost) > -1);
            })
        })


    // KORPA

    // DOGADJAJI VEZANI ZA DODAVANJE U KORPU
    $(document).on('click', '.dodaj-u-korpu', dodajUKorpu);
    $(document).on('click', '.dodaj-u-korpu', function(e) {
        Swal.fire({
            position: 'center',
                icon: 'success',
                title: 'Knjiga je dodata u korpu.',
                showConfirmButton: false,
                timer: 2500
    })});
    $(document).on("click",".obrisiIzKorpe", obrisiIzKorpe);
    // DODAVANJE KNJIGE U KORPU
    function dodajUKorpu(){
        let id = $(this).attr("data-id");
        var knjigeKorpa = dohvatiLS("korpa");
        console.log(knjigeKorpa);
        if(knjigeKorpa){
            if(knjigaUKorpi()){
                dodajKolicinu();
            }
            else{
                dodajULS();
            }
        }
        else{
            dodajPrvuKnjigu();
        }
        function dodajPrvuKnjigu(){
            let knjige = [];
            knjige[0] = {
                id : id,
                kolicina : 1
            };
            sacuvajULS("korpa", knjige);
        }
        
        function knjigaUKorpi(){
            return knjigeKorpa.filter(k => k.id == id).length;
        }

        function dodajKolicinu(){
            let knjigeIzLS = dohvatiLS("korpa");
            for(k in knjigeIzLS){
                if(knjigeIzLS[k].id == id ){
                    knjigeIzLS[k].kolicina++;
                    break;
                }
            }
            sacuvajULS("korpa", knjigeIzLS);
        }

        function dodajULS(){
            var knjigeIzLS = dohvatiLS("korpa");
            knjigeIzLS.push({
                id : id,
                kolicina : 1
            });
            sacuvajULS("korpa", knjigeIzLS);
        }
        kolicinaUKorpi();
    }
    // PRIKAZ BR KNJIGA U KORPI
    function kolicinaUKorpi(){
            var knjigeKorpa = dohvatiLS("korpa");
                if(knjigeKorpa){
                    var knjigeKol = knjigeKorpa.length;
                    $("#kolKorpa").html("("+knjigeKol+")");
                }
                else{
                    $("#kolKorpa").html("(0)");
                }
    }
    kolicinaUKorpi();
    // PRIKAZ SADRZAJA KORPE
    $("#prikazKorpe").on("click", sadrzajKorpe);
    function sadrzajKorpe(){
        var knjigeKorpa = dohvatiLS("korpa");
        var knjige = dohvatiLS("knjige");
        let html="";
        if(!knjigeKorpa || knjigeKorpa.length == 0){
            html += `Trenutno nema knjiga u korpi.`;
        }
        else{
            for(korpa of knjigeKorpa){
                for(k of knjige){
                    if(korpa.id == k.id){
                        html += `<div class="row">
                        <div class="col-2 border-end">
                          <img src="assets/img/${k.slika}.jpg" alt="${k.naslov}" style="width:100%; height: auto;">
                        </div>
                        <div class="col-4 border-end">
                          <h3>${k.naslov}</h3>
                          <p>${pisacDelo(k.id_autor, "sviPisci")}</p>
                        </div>
                        <div class="col-3 border-end">
                          <p>Cena: ${k.cena.nova * korpa.kolicina}</p>
                          <p>Kolicina: ${korpa.kolicina}</p>
                        </div>
                        <div class="col-3 align-items-center d-flex justify-content-center">
                          <input type="button" data-id="${k.id}" value="Obriši" class="btn btn-danger col-lg-12 obrisiIzKorpe">
                        </div>
                      </div>`;
                    }
                }
            }
        }
        html+=`<p id="poruka"></p>`;
        // console.log(knjigeKorpa);
        $("#korpa").html(html);
    }
    // BRISANJE KNJIGE IZ KORPE
    function obrisiIzKorpe(){
            let id = $(this).attr("data-id");
            console.log(id);
            let knjige = dohvatiLS("korpa");
            let novaKorpa = knjige.filter(k => k.id != id);
            sacuvajULS("korpa", novaKorpa);
            // let sveKnjige = dohvatiLS("sveKnjige");
            sadrzajKorpe();
            kolicinaUKorpi();
            // alert('ok');

    }
    // KUPOVINA KNJIGA KOJE SE NALAZE U KORPI
    $(document).on("click",".kupi", function(){
            let knjige = dohvatiLS("korpa");
            if(knjige){
                localStorage.removeItem("korpa");
                sadrzajKorpe(knjige);
                Swal.fire(
                    'Hvala na ukazanom poverenju.',
                    'Vaša porudžbina je primljena i uskoro će biti poslata na obradu.',
                    'success'
                )
            }
            else{
                Swal.fire(
                    'Korpa je prazna.',
                    'Molimo Vas da ubacite u korpu artikle kako bi započeli proces kupovine. Hvala.',
                    'error'
                )
            }
            kolicinaUKorpi();
    })
    

    // LISTA ZELJA

    // DOGADJAJI VEZANI ZA LISTU
    $(document).on('click', '.dodaj-listu', dodajNaListu);
    $(document).on('click', '.dodaj-listu', function(e) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Knjiga je dodata na listu želja.',
            showConfirmButton: false,
            timer: 2500
          })
    });
    // FUNKCIJA ZA DODAVANJE KNJIGE NA LISTU
    function dodajNaListu(){
        let id = $(this).attr("data-id");
        var knjigeLista = dohvatiLS("lista");

        if(knjigeLista){
            if(knjigaNaListi()){
                dodajKolicinuNaListu();
            }
            else{
                dodajULS();
            }
        }
        else{
            dodajNaListu();
        }
        function dodajNaListu(){
            let knjige = [];
            knjige[0] = {
                id : id,
                kolicina : 1
            };
            sacuvajULS("lista", knjige);
        }
        
        function knjigaNaListi(){
            return knjigeLista.filter(k => k.id == id).length;
        }

        function dodajULS(){
            var knjigeIzLS = dohvatiLS("lista");
            knjigeIzLS.push({
                id : id,
                kolicina : 1
            });
            sacuvajULS("lista", knjigeIzLS);
        }
        kolicinaNaListi();
    }
    // PRIKAZ BR KNJIGA NA LISTI
    function kolicinaNaListi(){
        var knjigeLista = dohvatiLS("lista");
            if(knjigeLista){
                var knjigeKol = knjigeLista.length;
                $("#kolLista").html("("+knjigeKol+")");
            }
            else{
                $("#kolLista").html("(0)");
            }
    }
    kolicinaNaListi();
    // PRIKAZ SADRZAJA LISTE
    $("#prikazListe").on("click", sadrzajListe);    
    function sadrzajListe(){
        var knjigeLista = dohvatiLS("lista");
        var knjige = dohvatiLS("knjige");
        let html="";
        if(!knjigeLista || knjigeLista.length == 0){
            html += `Trenutno nema knjiga na listi.`;
        }
        else{
            for(lista of knjigeLista){
                for(k of knjige){
                    if(lista.id == k.id){
                        html += `<div class="row">
                        <div class="col-2 border-end">
                          <img src="assets/img/${k.slika}.jpg" alt="${k.naslov}" style="width:100%; height:auto;">
                        </div>
                        <div class="col-4 border-end">
                          <h3>${k.naslov}</h3>
                          <p>${pisacDelo(k.id_autor, "sviPisci")}</p>
                        </div>
                        <div class="col-2 border-end">
                          <p>Cena: ${k.cena.nova}</p>
                        </div>
                        <div class="col-4">
                          <input type="button" data-id="${k.id}" value="Obriši" class="btn col-12 mb-2 btn-danger obrisiIzListe">
                          <input type="button" value="Dodaj u korpu" class="btn btn-dark col-12 prebaciUKorpu" data-id=${k.id}>
                        </div>
                      </div>`;
                    }
                }
            }
        }
        html+=`<p id="porukaLista"></p>`;
        $("#lista").html(html);
        $(".prebaciUKorpu").click(function(e) {
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Knjiga je dodata u korpu.',
                showConfirmButton: false,
                timer: 2500
              })
        });
    }
    // BRISANJE SA LISTE
    $(document).on("click",".obrisiIzListe", obrisiIzListe);
    function obrisiIzListe(){
        let id = $(this).attr("data-id");
        console.log(id);
        let knjige = dohvatiLS("lista");
        let novaLista = knjige.filter(k => k.id != id);
        sacuvajULS("lista", novaLista);
        sadrzajListe();
        kolicinaNaListi();

    }
    // PREBACIVANJE SA LISTE U KORPU   
    $(document).on("click", ".prebaciUKorpu", dodajUKorpu);
    $(document).on("click", ".prebaciUKorpu", obrisiIzListe);


    // VALIDACIJA PODATAKA ZA SLANJE PORUKE IZ KONTAKT FORME
    function validacija(data, regEx, poruka){
        greske=0;

        if(!regEx.test(data.val())){
            data.addClass('border border-3 border-danger');
            data.parent().find("p").html(poruka);
            greske++;
        }
        else{
            data.removeClass('border border-3 border-danger');
            data.parent().find("p").html("");
        }

        return greske;
    }
    // OBAVESTENJE O USPESNOSTI SLANJA PORUKE
    function poruka(){
        greska=0;

        ime = $("#tbIme");
        email = $("#tbEmail");
        naslov = $('#tbNaslov');
        text = $("#tbPoruka");
        mssg =text.val().trim().split(" ");

        imeGreska = "Ime mora početi velikim slovom i imati najmanje 3 slova.";
        emailGreska = "Email nije u odgovarajucem formatu.";
        naslovGreska = "Ovo je obavezno polje, ne sme biti prazno.";

        regIme = /^[A-ZŠĐŽČĆ][a-zšđžčć]{2,50}$/;
        regEmail = /^\w[.\d\w]*\@[a-z]{2,10}(\.[a-z]{2,3})+$/;
        regNaslov=/^[\w\s]+$/;

        greska+=validacija(ime, regIme, imeGreska);
        greska+=validacija(email, regEmail, emailGreska);
        greska+=validacija(naslov, regNaslov, naslovGreska);

        if(text.val() == "" || mssg.length < 5){
            text.addClass('border-danger');
            text.parent().find('p').html("Poruka mora sadržati najmanje 5 reči.");
            greska++;
        }
        else{
            text.removeClass('border-danger');
            text.parent().find('p').html("");
        }
        if(greska == 0){
            $("#poruka").addClass('alert alert-success form-control my-3');
            $("#poruka").html("Poruka je poslata.");
            podaci = [];
            podaci[0] = {
                ime : ime.val(),
                email: email.val(),
                naslov: naslov.val(),
                poruka: text.val()
            }
            sacuvajULS("poruka", podaci);
        }
    }
    $("#tbSend").click(poruka);  

})