import { generateUserByIndex } from "../middleware/userMiddleware";

// Interface para o usuário gerado
interface GeneratedUser {
    id: number;
    name: string;
    email: string;
    password: string;
    category: string;
    className: string;
    position: [number, number];
    customIcon: string;
    status: string;
    color: string;
    isActive: boolean;
    createAt: Date;
    updateAt: Date;
    RG?: string;
}

// Interface para a estrutura de retorno
interface GroupedUsers {
    [group: string]: GeneratedUser[];
}

export const generateUsers = (groupNames: string[], tagNames: string[]): GroupedUsers => {
    const users: GroupedUsers = {};
    let id = 1;

    // Itera sobre os grupos
    for (const group of groupNames) {
        users[group] = [];

        // Itera sobre as tags para cada grupo
        for (const tag of tagNames) {
            const user = { 
                ...generateUserByIndex(id), // Gera o usuário com índice
                id,
                RG: `${group}${tag}` // Adiciona RG composto por grupo + tag
            };
            users[group].push(user);
            id++;
        }
        users[group].reverse(); // Para ordenar de cima para baixo
    }

    return users;
};