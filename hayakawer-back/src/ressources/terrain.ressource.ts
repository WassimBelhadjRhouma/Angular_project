import { Terrain } from "../models/terrain.model";

export const terrainRessource = {

    getTerrain: (terrain: Terrain) => {
        const data = {
            capacity: terrain.capacity,
            city: terrain.city,
            description: terrain.description,
            position: terrain.position,
            price: terrain.price,
            region: terrain.region,
            title: terrain.title,
            id: terrain._id,
            reservation: terrain.reservation
        }
        return data;
    }
}