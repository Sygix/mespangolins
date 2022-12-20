export interface Pangolin {
    _id?: String;
    name: String;
    email: String;
    password: String;
    role: Role;
}

export enum Role {
    Guerrier = "GUERRIER",
    Alchimiste = "ALCHIMISTE",
    Sorcier = "SORCIER",
    Espion = "ESPION",
    Enchanteur = "ENCHANTEUR"
}