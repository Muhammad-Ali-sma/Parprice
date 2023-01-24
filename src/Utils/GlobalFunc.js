export const ctf = (val) => {
    if(isNaN(parseFloat(val))){
        return 0;
    }
    return parseFloat(val)
}