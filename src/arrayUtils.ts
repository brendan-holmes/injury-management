export const arrayUtils = {
    replace: (array: Array<any>, value: any, index: number) => {
        return array.map((x, i) => i === index ? value : x);
    }
}