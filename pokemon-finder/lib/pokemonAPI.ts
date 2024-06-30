
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function getPokemonList() {
    const response = await fetch(POKEMON_API_URL + "?limit=151&offset=0");
    const data = await response.json();
    return data.results;
}

export async function getPokemon(pokemonName: string) {
    const response = await fetch(`${POKEMON_API_URL}/${pokemonName}`);
    const data = await response.json();
    return data;
}