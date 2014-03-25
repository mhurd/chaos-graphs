var chaotic = {

    logistic: function (x, k) {
        return k * x * (1 - x);
    },

    quadratic: function (x, k) {
        return k - (x * x);
    }

};
