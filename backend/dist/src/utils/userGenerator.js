"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsers = void 0;
const userMiddleware_1 = require("../middleware/userMiddleware");
const generateUsers = (groupNames, tagNames) => {
    const users = {};
    let id = 1;
    for (const group of groupNames) {
        users[group] = [];
        for (const tag of tagNames) {
            const user = {
                ...(0, userMiddleware_1.generateUserByIndex)(id),
                id,
                RG: `${group}${tag}`
            };
            users[group].push(user);
            id++;
        }
        users[group].reverse();
    }
    return users;
};
exports.generateUsers = generateUsers;
//# sourceMappingURL=userGenerator.js.map