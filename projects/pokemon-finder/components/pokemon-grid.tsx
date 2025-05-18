"use client"

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PokemonCard } from "@/components/pokemon-card";

interface PokemonGridProps {
    pokemonList: any;
}

export function PokemonGrid({ pokemonList } : PokemonGridProps) {
    const [serachText, setSearchText] = useState("");

    // console.log(pokemonList);

    // Filter the pokemon list based on the search text
    

    const searchFilter = (pokemon: any) => {
        return pokemonList.filter(
            (pokemon: any) => pokemon.name.toLowerCase().includes(serachText.toLowerCase())
        );
    }

    const filteredPokemonList = searchFilter(pokemonList);

    return (
        <>
        <div>
            <h3 className="text-2xl py-6 text-center">Search For Your Pokemon</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="pokemonName">Pokemon Name</Label>
                <Input 
                    type="text"
                    value={serachText}
                    autoComplete="off"
                    id="pokemonName"
                    placeholder="Charizard, Pikachu, etc."
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <h3 className="text-3xl pt-12 pb-6 text-center">Pokemon Collection</h3>
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            {filteredPokemonList.map((pokemon: any) => {
                return <PokemonCard name={pokemon.name} key={pokemon.name} />
            })}
        </div>
        </>
    );
}