const NUTRITIONIX_API = process.env.NUTRITIONIX_API,
    NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID,
    fetch = require("node-fetch"),
    baseURL = 'trackapi.nutritionix.com/';

module.exports = {
    parseNutritionFromLabels: (labelData) => {
        let promises = [];
        for (const label of labelData) {
            promises.push(checkNutrition(label.Name));
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(foodData => {
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

checkNutrition = (name) => {
    let params = {
        query: name,
        num_servings: 1,
        line_delimited: false,
        use_raw_foods: false,
        include_subrecipe: false,
        lat: 0,
        lng: 0,
        meal_type: 0,
        use_branded_foods: false,
        locale: "en_US"
    }

    let headers = {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API,
        'x-remote-user-id': 0
    };

    const endpoint = baseURL + 'v2/natural/nutrients';
    return new Promise((resolve, reject) => {
        fetch(endpoint, {
            method: 'POST',
            body: params,
            headers: headers
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });

}
