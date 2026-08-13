import { config } from 'dotenv';

config({ quiet: true });

export const token = process.env.TOKEN || ""
export const clientId = process.env.CLIENTID || ""
export const clientUsername = process.env.USERNAME || "Poke Medio"
export const clientAvatar = process.env.AVATAR || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapi.triviacreator.com%2Fv1%2Fimgs%2Fquiz%2Fwhos_that_pokemon-a5373887-8dd0-449f-8475-d7bc129d767d.webp&f=1&nofb=1&ipt=82741640762a7826c958fe6dee5f1dbc0be22312e7f5b9b075cd2169bb230c98"
export const clientBanner = process.env.BANNER || "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lyr0uwg2l3md56"
