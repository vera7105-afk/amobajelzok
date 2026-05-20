const wordData = {
    "Minőségjelzős": [
        "okos diák", "furfangos libapásztor", "kegyetlen földesúr", "bátor hős", "hatalmas malomkő", "apró kavics", "utolsó pad", "hátsó udvar", "bal oldali ajtó", "magas hegy", "hosszú út", "szűk utca", "előző óra", "érdekes történet", "nehéz feladat", "repülő tányér", "sötét erdő", "szép dallam", "vidám osztály", "tiszta füzet", "piros toll", "fa asztal", "törött ablak", "gyönyörű táj", "széles folyó", "rongyos ruha", "bőr táska", "friss kenyér", "hideg tél", "felső polc"
    ],
    "Mennyiségjelzős": [
        "három füzet", "tizenöt diák", "száz oldal", "ezer forint", "két gól", "harminc perc", "nyolc óra", "húsz kilométer", "hat alma", "ötven pont", "fél torta", "negyed pizza", "másfél liter", "tucatnyi tojás", "számtalan csillag", "sok feladat", "kevés idő", "néhány barát", "rengeteg ember", "több könyv", "temérdek kincs", "csipetnyi só", "pár ember", "számos lehetőség", "több ezer néző", "két-három nap", "maréknyi mogyoró", "semennyi pénz", "egy kevés víz", "minden ember"
    ],
    "Birtokos jelzős": [
        "az iskola udvara", "a fiú könyve", "Toldi fegyvere", "Lúdas Matyi lúdja", "a fának az ága", "a kutyának a játékai", "a hegy csúcsa", "Döbrögi uram büntetése", "az erdő csendje", "a király palotája", "a tenger hulláma", "a lány testvére", "a barátomnak a biciklije", "a szomszéd macskája", "a könyv borítója", "a számítógép billentyűzete", "az apukámnak az autója", "a virág illata", "a ház teteje", "az ablak üvege", "a diákok füzetei", "a nyár melege", "a film dallama", "az ajtónak a kilincse", "az aranyérem csillogása", "a szülők kérése", "a testvéremnek a szobája", "a város utcái", "Arany János verse", "a ceruza hegye"
    ],
    "Értelmező jelzős": [
        "barátomnak, Péternek", "ceruzával, pirossal", "Toldit, a lovagot", "könyvet, egy izgalmasat", "Döbrögitől, a földesúrtól", "a bizonyítványomat, a félévit", "ötösöket, hármat", "a padtársamról, Annáról", "ruhában, az ünneplőben", "Lúdas Matyinak, a libapásztornak", "egy kutyát, feketét", "a tanár úrral, a matektanárral", "a dolgozatot, a tegnapit", "feladatot, sokat", "az asztalon, a másikon"
    ]
};

// Generáljuk a kérdéseket dinamikusan a szógyűjteményből
const questionBank = [];
const categories = Object.keys(wordData);

categories.forEach(correctCategory => {
    wordData[correctCategory].forEach(word => {
        // Válasszunk 3 másik véletlenszerű kategóriát a hibás válaszokhoz
        let wrongCategories = categories.filter(c => c !== correctCategory);
        wrongCategories = wrongCategories.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        let options = [correctCategory, ...wrongCategories];
        
        // Keverjük meg az opciókat
        options = options.sort(() => 0.5 - Math.random());
        
        let correctIndex = options.indexOf(correctCategory);
        
        questionBank.push({
            question: `Milyen mondatrész?\n\n"${word}"`,
            options: options,
            correctIndex: correctIndex
        });
    });
});
