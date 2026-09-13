import { fileURLToPath } from "node:url";

const legalDirectory = fileURLToPath(new URL("../legal/", import.meta.url));

const documents = [
    ["/privacy-policy", "privacy-policy.html"],
    ["/terms-of-service", "terms-of-service.html"],
    ["/user-data-deletion", "user-data-deletion.html"],
];

export const legalController = {
    mapRoutes(app) {
        for (const [route, filename] of documents) {
            app.get(route, (req, res, next) => {
                res.type("html");
                res.sendFile(filename, { root: legalDirectory }, (error) => {
                    if (error) next(error);
                });
            });
        }
    },
};
