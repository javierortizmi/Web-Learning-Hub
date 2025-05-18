import { PokemonImage } from "@/components/pokemon-image";
import { Progress } from "@/components/ui/progress";
import { getPokemon } from "@/lib/pokemonAPI";

// Pokemon name: Charizard, Pikachu, etc.
export default async function pokemonPage({ params } : { params: { pokemonName: string } }) {
    const { pokemonName } = params;

    const pokemonObject = await getPokemon(pokemonName);

    // console.log(pokemonObject);

    return (
        <>
            <h1 className="text-4xl font-bold pt-4">{pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h1>
            <div className="m-4 relative w-64 h-64">
                <PokemonImage image={pokemonObject["sprites"]["other"]["official-artwork"]["front_default"]} name={pokemonName} />
            </div>
            <h3>Weight: {pokemonObject.weight}</h3>
            <div className="flex-col">
                {pokemonObject.stats.map((stat: any) => {
                    const statName = stat.stat.name;
                    const statValue = stat.base_stat;
                    
                    return (
                        <div key={statName} className="flex items-stretch w-[500px]">
                            <h3 className="p-3 w-2/4">{statName}: {statValue}</h3>
                            <Progress className="w-1/2 m-auto" value={statValue} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}