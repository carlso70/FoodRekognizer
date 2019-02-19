const NUTRITIONIX_API = process.env.NUTRITIONIX_API,
    NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID,
    fetch = require("node-fetch"),
    baseURL = 'https://trackapi.nutritionix.com/';

module.exports = {
    parseNutritionFromLabels: (labelData) => {
        let promises = [];
        for (const label of labelData) {
            promises.push(checkNutrition(label.Name));
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(foodData => {
                let result = []
                for (const item of foodData) {
                    /* Valid results come back with the foods object */
                    if (item.foods !== undefined) {
                        result.concat(item.foods);
                    }
                }
                resolve(result);
            }).catch(err => reject(err));
        });
    }
};

checkNutrition = (name) => {
    let params = {
        "query": name,
    }

    let headers = {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API,
    };

    let endpoint = baseURL + 'v2/natural/nutrients';
    return new Promise((resolve, reject) => {
        fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: headers
        })
            .then(response => {
                return response.json();
            })
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}