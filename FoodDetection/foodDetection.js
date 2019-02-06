const EDAMAM_KEY = process.env.EDAMAM_KEY,
    EDAMAM_APP_ID = process.env.EDAMAM_APP_ID,
    querystring = require('querystring'),
    util = require('util'),
    fetch = require("node-fetch");

module.exports = {
    parseLabelDataForFood: (labelData) => {
        console.log(labelData);

        let promises = [];
        for (const label of labelData) {
            promises.push(checkFoodDatabase(label.Name));
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(foodData => {
                // console.log(util.inspect(res, { showHidden: false, depth: null }));
                let result = []

                /* Go through results and add valid food responses */
                for (const food of foodData) {
                    for (const hint of food.hints) {
                        if (hint.food.label && hint.food.nutrients) {
                            result.push(hint);
                        }
                    }
                }
                resolve(result);
            }).catch(err => reject(err));
        });
    }
};

function checkFoodDatabase(food) {
    /* Note when there are spaces in a word, the space should be replaced by %20: example red apple becomes red%20apple */
    food = food.replace(" ", "%20");

    let params = {
        ingr: food,
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_KEY,
    }
    /* https://api.edamam.com/api/food-database/parser?nutrition-type=logging&ingr=red%20apple&app_id={your app_id}&app_key={your app_key} */
    const endpoint = `https://api.edamam.com/api/food-database/parser?` + querystring.stringify(params);

    return new Promise((resolve, reject) => {
        fetch(endpoint)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}