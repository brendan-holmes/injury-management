const arrayUtils = {
    replace: (array, value, index) => {
        return array.map((x, i) => i === index ? value : x);
    }
}

export default arrayUtils;