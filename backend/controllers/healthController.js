const name = 'health';

export const healthController = {
    mapRoutes: function (app) {

        app.get(`/${name}/`, async (req, res, next) => {
            try {
                return res.json({
                    "message": "healthy"
                });
            } catch (e) {
                next(e);
            }
        });

    }
}
