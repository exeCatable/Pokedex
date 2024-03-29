let pokemonRepository = (function () {
  let pokemonRawDataList = [];
  let pokemonList = {};
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function add(pokemon) {
    if (typeof pokemon !== "object") {
      console.log("Not a pokemon, please try again");
      return;
    }
    pokemonRawDataList.push(pokemon);
  }

  function getAll() {
    return pokemonRawDataList;
  }

  function addListItem(pkm) {
    let mainList = document.querySelector(".pokemon-list");
    let button = document.createElement("li");
    button.dataset.target = "#exampleModal";
    button.dataset.toggle = "modal";
    button.classList.add("list-group-item");
    button.classList.add("pkm-btn");

    let buttonTitle = document.createElement("h3");
    buttonTitle.innerText = pkm.name;
    button.appendChild(buttonTitle);

    loadDetails(pkm).then(function () {
      let typeName = pkm.types[0].type.name;
      let colorCode = calcColorByType(typeName);
      let typeContainer = document.createElement("div");
      typeContainer.classList.add("type-wrap");
      button.appendChild(typeContainer);

      for (let typeObj of pkm.types) {
        let typeElement = document.createElement("p");
        typeElement.innerText = typeObj.type.name;
        typeContainer.appendChild(typeElement);
      }

      let imgContainer = document.createElement("div");
      imgContainer.classList.add("img-wrap");
      button.appendChild(imgContainer);
      button.style.backgroundColor = colorCode;
      let imgElement = document.createElement("img");
      imgElement.src = pkm.imageUrl;
      imgContainer.appendChild(imgElement);

      mainList.appendChild(button);
    });

    button.addEventListener("click", function (event) {
      showDetails(pkm.id);
    });
  }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(pkm) {
    let url = pkm.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        pkm.id = details.id;
        pkm.imageUrl = details.sprites.front_default;
        pkm.height = details.height;
        pkm.types = details.types;
        pkm.weight = details.weight;
        pkm.abilities = details.abilities;

        pokemonList[pkm.id] = pkm;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetails(pkmId) {
    let pokemon = pokemonList[pkmId];
    if (!pokemon) {
      console.error("Pokemon " + pkmId + " is not available");
      return;
    }
    showModal(pokemon);
  }

  let modalContainer = document.querySelector("#exampleModal");
  $("#exampleModal").on("hidden.bs.modal", function (e) {
    hideModal();
  });

  function showModal(pokemon) {
    let modal = document.querySelector(".modal-content");
    let typeName = pokemon.types[0].type.name;

    // Pokemon Name
    let modalTitle = document.querySelector(".modal-title");
    modalTitle.innerText = pokemon.name;

    let modalHeader = document.querySelector(".modal-header");
    modalHeader.style.backgroundColor = calcColorByType(typeName);

    // Pokemon Image
    let modalBody = document.querySelector(".modal-body");
    let imageElement = document.createElement("img");
    imageElement.classList.add("detailPokemon");
    imageElement.src = pokemon.imageUrl;
    modalBody.appendChild(imageElement);

    // Pokemon Type
    for (let typeObj of pokemon.types) {
      let typeElement = document.createElement("p");
      typeElement.innerText = typeObj.type.name;
      modalBody.appendChild(typeElement);
    }
  }

  function hideModal() {
    let titleElement = $(".modal-title");
    titleElement.empty();

    let modalBody = $(".modal-body");
    modalBody.empty();
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

function calcColorByType(type) {
  let typeToColorMapping = {
    normal: "#A8A878",
    fire: "#F08030",
    fighting: "#C03028",
    water: "#6890F0",
    flying: "#A890F0",
    grass: "#78C850",
    poison: "#A040A0",
    electric: "#F8D030",
    ground: "#E0C068",
    psychic: "#F85888",
    rock: "#B8A038",
    ice: "#98D8D8",
    bug: "#A8B820",
    dragon: "#7038F8",
    ghost: "#705898",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };
  let formattedType = type.toLowerCase();
  let colorCode = typeToColorMapping[formattedType];
  if (!colorCode) {
    return "red";
  }
  return colorCode;
}

let pokemonList = pokemonRepository.getAll();

pokemonRepository
  .loadList()
  .then(function () {
    pokemonList.forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  })
  .then(function () {
    let header = document.querySelector("#pokedex-header");
    header.innerText =
      header.innerText + " of " + pokemonList.length + " Pokémons ";
  });

function filterPokemon() {
  let inputElement = document.querySelector("#Search");

  let pokemonListElement = document.querySelector(".pokemon-list");
  for (let element of pokemonListElement.children) {
    let pokemonName = element.querySelector("h3").innerText;
    let searchValue = inputElement.value.toLowerCase();
    let match = pokemonName.toLowerCase().includes(searchValue);


    if (match) {
      element.style.display = "";
    } else {
      element.style.display = "none";
    }
  }
}