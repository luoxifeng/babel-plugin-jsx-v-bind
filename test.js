
const { transform,  } = require('@babel/core');


const transpile = src => {
    return transform(src, {
        plugins: ['./index']
    }).code.trim()
}

const code = transpile(`<Component vBind={d} attrs={{ss: 123}}/>`)

console.log(code);


